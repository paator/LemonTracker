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
	import { playCurrentPattern } from '$lib/services/module-player';
	import { isTrackPlaying } from '$lib/stores/debug';

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
		const firstRowOfCurrentPattern = $allPatternRows[$currentPatternIndex];

		if (firstRowOfCurrentPattern.isPlaceholder) {
			return;
		}

		const remainingRows = $allPatternRows.slice(firstRowOfCurrentPattern.globalIndex);
		let speedDecimal = 3;

		for (const visibleRow of remainingRows) {
			let speedHex: string | null = null;

			//assuming C > B > A priority
			if (visibleRow.row.channelsData[2].effect === 'B') {
				speedHex = visibleRow.row.channelsData[2].effectParamZ;
			} else if (visibleRow.row.channelsData[1].effect === 'B') {
				speedHex = visibleRow.row.channelsData[1].effectParamZ;
			} else if (visibleRow.row.channelsData[0].effect === 'B') {
				speedHex = visibleRow.row.channelsData[0].effectParamZ;
			}

			if (speedHex !== null) {
				speedDecimal = parseInt(speedHex, 16);
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

			if (!$isTrackPlaying) {
				break;
			}
		}

		$isTrackPlaying = !$isTrackPlaying;
	}
</script>

<div class="flex flex-col gap-2 min-h-0">
	<EditorMenu>
		<EditorButton on:click={newModule}>New Track</EditorButton>
		<EditorButton on:click={loadModule}>Load Module</EditorButton>
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
