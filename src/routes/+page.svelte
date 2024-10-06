<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { listen, type UnlistenFn } from '@tauri-apps/api/event';
	import EditorButton from '$lib/components/EditorMenu/EditorButton.svelte';
	import EditorMenu from '$lib/components/EditorMenu/EditorMenu.svelte';
	import Module from '$lib/models/module';
	import {
		allPatternRows,
		currentPattern,
		currentPatternIndex,
		cursorPosition,
		globalCursorPosY,
		ornaments,
		patterns,
		setCurrentModule
	} from '$lib/stores/stores.js';
	import ModuleEditor from '$lib/components/ModuleEditor/ModuleEditor.svelte';
	import PlayerPlayFilled from '@tabler/icons-svelte/icons/player-play-filled';
	import { isTrackPlaying } from '$lib/stores/debug';
	import NoteData, { Note } from '$lib/models/note-data';
	import EditorSelect, {
		type EditorSelectOption
	} from '$lib/components/EditorMenu/EditorSelect.svelte';
	import DemoPatorDigitalEspresso from '$lib/demoModules/Pator_Digital_Espresso.vt2?raw';
	import DemoMyBestTrack1 from '$lib/demoModules/MyBestTrack1.vt2?raw';
	import DemoMmcm from '$lib/demoModules/mmcm.vt2?raw';
	import DemoQuiteFast from '$lib/demoModules/quitefast.vt2?raw';
	import convertersContainer from '$lib/services/converters/converters-container';
	import { browser } from '$app/environment';
	import { audioContext, audioNode } from '$lib/stores/audio';
	import DemoBfoxSorrow from '$lib/demoModules/bfox.vt2?raw';
	let fileLoaderInput: HTMLInputElement;
	let unlisten: UnlistenFn;
	let worker: Worker;

	onMount(async () => {
		const eventHandlers: Record<string, () => void> = {
			new: newModule,
			open: loadModule,
			play_current_pattern: playOrPauseCurrentPattern
		};

		unlisten = await listen<string>('menu', (event) => {
			const payload = event.payload as keyof typeof eventHandlers;
			const handler = eventHandlers[payload];
			if (handler) {
				handler();
			}
		});

		if (browser && window.Worker) {
			try {
				const ayWorker = await import('$lib/services/audio/ay-worker?worker');
				worker = new ayWorker.default();
				worker.postMessage({ type: 'init' });

				worker.onmessage = (event) => {
					switch (event.data.type) {
						case 'noteFrequency':
							console.log('noteFrequency', event.data.value);

							$audioNode.parameters
								.get(`noteFrequency_${event.data.channel}`)
								?.setValueAtTime(event.data.value, $audioContext.currentTime);
							break;
						case 'volume':
							console.log('volume', event.data.value);
							$audioNode.parameters
								.get(`volume_${event.data.channel}`)
								?.setValueAtTime(event.data.value, $audioContext.currentTime);
							break;
					}
				};

				worker.onerror = (error) => {
					console.error('Worker error:', error);
				};
			} catch (error) {
				console.error('Error initializing worker:', error);
			}
		}
	});

	onDestroy(() => unlisten());

	function newModule() {
		setCurrentModule(new Module());
		currentPatternIndex.set(0);
	}

	function loadModule() {
		fileLoaderInput.click();
	}

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files || files.length === 0) return;

		const file = files[0];
		const extension = file.name.split('.').pop()?.toLocaleLowerCase();

		if (!extension) return;

		const converter = convertersContainer.resolve(extension);

		const lemonModule = await converter.convertToLemonModule(
			new Blob([file], { type: file.type })
		);

		setCurrentModule(lemonModule);
		currentPatternIndex.set(0);
		cursorPosition.setPosition(0, 0);
	}

	async function playOrPauseCurrentPattern() {
		$isTrackPlaying = !$isTrackPlaying;

		if (!$isTrackPlaying) {
			worker?.postMessage({ type: 'stop' });
			await $audioContext.suspend();
			return;
		}

		worker?.postMessage({ type: 'start' });
		await $audioContext.resume();

		const currentRow = $allPatternRows[$globalCursorPosY];

		const remainingRows = $allPatternRows.slice(currentRow.globalIndex);

		if (remainingRows.length === 0) {
			$isTrackPlaying = false;
			await $audioContext.suspend();
			worker?.postMessage({ type: 'stop' });
		}

		let speedDecimal = 3;

		for (const visibleRow of remainingRows) {
			if (!$isTrackPlaying) {
				await $audioContext.suspend();
				worker?.postMessage({ type: 'stop' });
				break;
			}

			for (let i = 0; i < visibleRow.row.channelsData.length; i++) {
				let speedHex: string | null = null;
				let volumeHex: string | null = null;
				let noteData: NoteData = new NoteData(Note.None, 0);

				if (visibleRow.row.channelsData[i].effect === 'B') {
					speedHex = visibleRow.row.channelsData[i].effectParamZ;
					speedDecimal = parseInt(speedHex, 16);
				}

				volumeHex = visibleRow.row.channelsData[i].volume;
				if (volumeHex) {
					const parsedVolume = parseInt(volumeHex, 16);
					if (!isNaN(parsedVolume)) {
						worker?.postMessage({ type: `volume_${i}`, value: parsedVolume });
					}
				}

				noteData = visibleRow.row.channelsData[i].noteData;

				if (noteData) {
					worker?.postMessage({ type: `note_${i}`, value: noteData });
				}

				const envType = visibleRow.row.channelsData[i].envelope;
				if (envType) {
					worker?.postMessage({ type: `envelope_${i}`, value: parseInt(envType, 16) });
				}

				const ornament = visibleRow.row.channelsData[i].ornament;
				if (ornament && ornament !== '.') {
					const ornamentInt = parseInt(ornament, 32);

					const moduleOrnament = $ornaments[ornamentInt];
					worker?.postMessage({ type: `ornament_${i}`, value: moduleOrnament });
				}
			}

			const delay = speedDecimal * (1.0 / 50) * 1000;

			await new Promise((resolve) => setTimeout(resolve, delay));

			if (
				$cursorPosition.posY + 1 >= $currentPattern.patternRows.length &&
				$currentPatternIndex < $patterns.length - 1
			) {
				$currentPatternIndex++;
				cursorPosition.setPosition($cursorPosition.posX, 0);
			} else if (
				$cursorPosition.posY + 1 >= $currentPattern.patternRows.length &&
				$currentPatternIndex >= $patterns.length - 1
			) {
				return;
			} else {
				cursorPosition.incrementYBy(1);
			}
		}
	}

	type DemoModuleOption = { file: string } & EditorSelectOption;
	let loadDemoValue: string | undefined;
	let demoModulesOptions: DemoModuleOption[] = [
		{ value: 'demo-1', label: 'Pator - Digital Espresso', file: DemoPatorDigitalEspresso },
		{ value: 'demo-2', label: 'My Best Track 1', file: DemoMyBestTrack1 },
		{ value: 'demo-3', label: 'MmcM - ConVerS!ons', file: DemoMmcm },
		{ value: 'demo-4', label: 'Quite Fast', file: DemoQuiteFast },
		{ value: 'demo-5', label: 'Bfox - .sorrow.on.d!halt...realtime.ay.', file: DemoBfoxSorrow }
	];

	$: handleChangeDemoModule(loadDemoValue);

	async function handleChangeDemoModule(value: typeof loadDemoValue) {
		const demoModuleOption = demoModulesOptions.find((x) => x.value === value);
		if (!demoModuleOption) return;

		const converter = convertersContainer.resolve('vt2');

		const lemonModule = await converter.convertToLemonModule(
			new Blob([demoModuleOption.file], { type: 'text/plain' })
		);

		setCurrentModule(lemonModule);
		currentPatternIndex.set(0);
		cursorPosition.setPosition(0, 0);
	}
</script>

<div class="flex flex-col gap-2 min-h-0">
	<EditorMenu>
		<EditorButton on:click={newModule}>New Track</EditorButton>
		<EditorButton on:click={loadModule}>Load Module</EditorButton>
		<EditorSelect
			options={demoModulesOptions}
			placeholder="Load Demo"
			bind:value={loadDemoValue}
		/>
		<div>
			<EditorButton on:click={playOrPauseCurrentPattern}>
				<PlayerPlayFilled size={16} />
			</EditorButton>
		</div>
	</EditorMenu>
	<ModuleEditor />
</div>
<input
	bind:this={fileLoaderInput}
	hidden
	type="file"
	accept=".vt2,.pt3"
	on:change={handleFileSelect}
/>
