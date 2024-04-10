<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import EditorRow from './EditorRow.svelte';
	import {
		cursorPosition,
		currentPattern,
		patterns,
		currentPatternIndex
	} from '$lib/stores/stores.js';
	import PatternRow from '$lib/models/pattern-row';
	import PlaceholderRow from './PlaceholderRow.svelte';

	interface VisibleRow {
		row: PatternRow;
		index: number;
		isPlaceholder: boolean;
	}

	let container: HTMLElement;
	let visibleRows: VisibleRow[] = [];

	const editorRowHeight = 24;

	$: calculateVisibleRows($cursorPosition.posY);

	onMount(() => {
		cursorPosition.setPosition(0, 0);
		calculateVisibleRows(0);

		const resizeObserver = new ResizeObserver(() => {
			calculateVisibleRows($cursorPosition.posY);
		});

		resizeObserver.observe(container);

		onDestroy(() => {
			resizeObserver.disconnect();
		});
	});

	function calculateVisibleRows(cursorPositionY: number) {
		const possibleVisibleRowsCount = Math.floor(container?.clientHeight / editorRowHeight);
		const totalRows = $currentPattern.patternRows.length;
		const halfVisibleRows = Math.floor(possibleVisibleRowsCount / 2);

		let startRow = Math.max(cursorPositionY - halfVisibleRows, 0);
		let endRow = Math.min(cursorPositionY + halfVisibleRows, totalRows - 1);

		let ghostRowsAtStart = Math.max(halfVisibleRows - cursorPositionY, 0);
		let ghostRowsAtEnd = Math.max(cursorPositionY + halfVisibleRows - (totalRows - 1), 0);

		visibleRows = [];
		for (let i = 0; i < ghostRowsAtStart; i++) {
			visibleRows.push(createGhostRow(i - ghostRowsAtStart));
		}

		visibleRows.push(
			...$currentPattern.patternRows.slice(startRow, endRow + 1).map((row, index) => ({
				row,
				index: startRow + index,
				isPlaceholder: false
			}))
		);

		for (let i = 0; i < ghostRowsAtEnd; i++) {
			visibleRows.push(createGhostRow(totalRows + i));
		}
	}

	function createGhostRow(index: number): VisibleRow {
		return {
			row: new PatternRow(),
			index,
			isPlaceholder: true
		};
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
	on:resize={() => calculateVisibleRows($cursorPosition.posY)}
	on:wheel={handleWheel}
	on:keydown={handleKeyDown}
	tabindex="0"
	class="overflow-y-hidden h-screen select-none mx-auto bg-slate-800 drop-shadow-md font-mono
	text-slate-600 text-md text-center focus:border-2 focus:border-blue-500 outline-none"
>
	<div>
		{#each visibleRows as { row, index, isPlaceholder } (index)}
			{#if isPlaceholder}
				<PlaceholderRow />
			{:else}
				<EditorRow
					{row}
					{index}
					class="{index % 4 === 0 && $cursorPosition.posY !== index
						? 'bg-slate-400/10'
						: ''} {$cursorPosition.posY === index ? 'bg-blue-800 text-slate-300' : ''}"
				/>
			{/if}
		{/each}
	</div>
</div>
