<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { listen, type UnlistenFn } from '@tauri-apps/api/event';
	import EditorButton from '$lib/components/EditorMenu/EditorButton.svelte';
	import EditorMenu from '$lib/components/EditorMenu/EditorMenu.svelte';
	import Module from '$lib/models/module';
	import VortexModuleConverter from '$lib/services/vt-converter';
	import {
		allPatternRows,
		currentPattern,
		currentPatternIndex,
		cursorPosition,
		patterns,
		setCurrentModule
	} from '$lib/stores/stores.js';
	import ModuleEditor from '$lib/components/ModuleEditor/ModuleEditor.svelte';
	import PlayerPlayFilled from '@tabler/icons-svelte/icons/player-play-filled';
	import { isTrackPlaying } from '$lib/stores/debug';
	import NoteData, { Note } from '$lib/models/note-data';
	import { audioContext, audioNode } from '$lib/stores/audio';
	import EditorSelect, {type EditorSelectOption} from "$lib/components/EditorMenu/EditorSelect.svelte";
	import DemoPatorDigitalEspresso from "$lib/demoModules/Pator_Digital_Espresso.vt2?raw";

	let fileLoaderInput: HTMLInputElement;
	let unlisten: UnlistenFn;

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
		const converter = new VortexModuleConverter();

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
			$audioContext.suspend();
			return;
		}

		$audioContext.resume();

		const PT3ToneTable: number[] = [
			0x0d10, 0x0c55, 0x0ba4, 0x0afc, 0x0a5f, 0x09ca, 0x093d, 0x08b8, 0x083b, 0x07c5, 0x0755,
			0x06ec, 0x0688, 0x062a, 0x05d2, 0x057e, 0x052f, 0x04e5, 0x049e, 0x045c, 0x041d, 0x03e2,
			0x03ab, 0x0376, 0x0344, 0x0315, 0x02e9, 0x02bf, 0x0298, 0x0272, 0x024f, 0x022e, 0x020f,
			0x01f1, 0x01d5, 0x01bb, 0x01a2, 0x018b, 0x0174, 0x0160, 0x014c, 0x0139, 0x0128, 0x0117,
			0x0107, 0x00f9, 0x00eb, 0x00dd, 0x00d1, 0x00c5, 0x00ba, 0x00b0, 0x00a6, 0x009d, 0x0094,
			0x008c, 0x0084, 0x007c, 0x0075, 0x006f, 0x0069, 0x0063, 0x005d, 0x0058, 0x0053, 0x004e,
			0x004a, 0x0046, 0x0042, 0x003e, 0x003b, 0x0037, 0x0034, 0x0031, 0x002f, 0x002c, 0x0029,
			0x0027, 0x0025, 0x0023, 0x0021, 0x001f, 0x001d, 0x001c, 0x001a, 0x0019, 0x0017, 0x0016,
			0x0015, 0x0014, 0x0012, 0x0011, 0x0010, 0x000f, 0x000e, 0x000d
		];

		const firstRowOfCurrentPattern = $allPatternRows[$currentPatternIndex];

		if (firstRowOfCurrentPattern.isPlaceholder) {
			return;
		}

		const remainingRows = $allPatternRows.slice(firstRowOfCurrentPattern.globalIndex);

		if (remainingRows.length === 0) {
			$isTrackPlaying = false;
			$audioContext.suspend();
		}

		let speedDecimal = 3;
		let volume = 15;

		const noteFreqParam = $audioNode.parameters.get('noteFrequency');
		const volumeParam = $audioNode.parameters.get('volume');

		for (const visibleRow of remainingRows) {
			if (!$isTrackPlaying) {
				$audioContext.suspend();
				break;
			}

			let speedHex: string | null = null;
			let volumeHex: string | null = null;
			let noteData: NoteData = new NoteData(Note.None, 0);

			if (visibleRow.row.channelsData[2].effect === 'B') {
				speedHex = visibleRow.row.channelsData[2].effectParamZ;
			} else if (visibleRow.row.channelsData[1].effect === 'B') {
				speedHex = visibleRow.row.channelsData[1].effectParamZ;
			} else if (visibleRow.row.channelsData[0].effect === 'B') {
				speedHex = visibleRow.row.channelsData[0].effectParamZ;
			}

			volumeHex = visibleRow.row.channelsData[0].volume;

			if (speedHex) {
				speedDecimal = parseInt(speedHex, 16);
			}

			if (volumeHex) {
				volume = parseInt(volumeHex, 16);
			}

			noteData = visibleRow.row.channelsData[0].noteData;
			const noteIntValue = noteData.getNoteValue();

			if (noteIntValue) {
				noteFreqParam?.setValueAtTime(
					PT3ToneTable[noteIntValue],
					$audioContext.currentTime
				);
			}

			if (volume) {
				volumeParam?.setValueAtTime(volume, $audioContext.currentTime);
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

	//	Demo modules :)
	type DemoModuleOption = {file: string} & EditorSelectOption;
	let loadDemoValue: string|undefined;
	let demoModulesOptions: DemoModuleOption[] = [
		{value: 'demo-1', label: 'Pator - Digital Espresso', file: DemoPatorDigitalEspresso}
	];

	$: handleChangeDemoModule(loadDemoValue);

	async function handleChangeDemoModule(value: typeof loadDemoValue){

		const demoModuleOption = demoModulesOptions.find(x => x.value === value);
		if(!demoModuleOption) return;	//	Bail early.

		const converter = new VortexModuleConverter();

		const lemonModule = await converter.convertToLemonModule(
			new Blob([demoModuleOption.file], {type: 'text/plain'})
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
			options={[
				{value: 'demo-1', label: 'Pator - Digital Espresso'}
			]}
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
