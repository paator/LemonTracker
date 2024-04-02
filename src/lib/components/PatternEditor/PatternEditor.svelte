<script lang="ts">
	import { onMount } from 'svelte';
	import EditorRow from './EditorRow.svelte';
	import {
		cursorPosition,
		currentPattern,
		patterns,
		currentPatternIndex
	} from '$lib/stores/stores.js';
	import type PatternRow from '$lib/models/pattern-row';

	interface VisibleRow {
		row: PatternRow;
		index: number;
		isFromGhostPattern: boolean;
	}

	let container: HTMLElement;
	let visibleRows: VisibleRow[] = [];
	const editorRowHeight = 24;
	const buffer = 1;

	$: calculateVisibleRows($cursorPosition.posY);

	onMount(() => {
		cursorPosition.setPosition(0, 0);
		calculateVisibleRows(0);
	});

	function calculateVisibleRows(cursorPositionY: number) {
		const possibleVisibleRowsCount = Math.floor(container?.clientHeight / editorRowHeight);
		const halfVisibleRows = Math.floor(possibleVisibleRowsCount / 2) + buffer;

		let startRow = Math.max(cursorPositionY - halfVisibleRows, 0);
		let endRow = Math.min(
			cursorPositionY + halfVisibleRows,
			$currentPattern.patternRows.length - 1
		);

		visibleRows = $currentPattern.patternRows.slice(startRow, endRow + 1).map((row, index) => ({
			row,
			index: startRow + index,
			isFromGhostPattern: false
		}));
	}

	function updateCursorPosition(deltaY: number) {
		if (deltaY < 0) {
			if ($cursorPosition.posY - 1 < 0 && $currentPatternIndex > 0) {
				$currentPatternIndex--;
				cursorPosition.setPosition(
					$cursorPosition.posX,
					$patterns[$currentPatternIndex].patternRows.length - 1
				);
			} else {
				cursorPosition.decrementYBy(1);
			}
		} else if (
			$cursorPosition.posY + 1 >= $currentPattern.patternRows.length &&
			$currentPatternIndex < $patterns.length - 1
		) {
			$currentPatternIndex++;
			cursorPosition.setPosition($cursorPosition.posX, 0);
		} else {
			cursorPosition.incrementYBy(1);
		}
	}

	function handleWheel(event: WheelEvent) {
		updateCursorPosition(Math.sign(event.deltaY));
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			updateCursorPosition(event.key === 'ArrowUp' ? -1 : 1);
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	bind:this={container}
	on:wheel={handleWheel}
	on:keydown={handleKeyDown}
	tabindex="0"
	class="overflow-y-hidden h-screen select-none mx-auto bg-slate-800 drop-shadow-md font-mono
	text-slate-600 text-md text-center focus:border-2 focus:border-blue-500 outline-none"
>
	<div>
		{#each visibleRows as { row, index } (index)}
			<EditorRow
				{row}
				{index}
				class="{index % 4 === 0 && $cursorPosition.posY !== index
					? 'bg-slate-400/10'
					: ''} {$cursorPosition.posY === index ? 'bg-blue-800 text-slate-300' : ''}"
			/>
		{/each}
	</div>
</div>
