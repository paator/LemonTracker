<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import EditorRow from './EditorRow.svelte';
	import {
		cursorPosition,
		currentPattern,
		patterns,
		currentPatternIndex,
		allPatternRows,
		globalCursorPosY
	} from '$lib/stores/stores.js';
	import PatternRow from '$lib/models/pattern-row';
	import PlaceholderRow from './PlaceholderRow.svelte';
	import type VisibleRow from '$lib/models/visible-row';

	let buffer = 1;
	let container: HTMLElement;
	let visibleRows: VisibleRow[] = [];
	let resizeObserver: ResizeObserver;

	const editorRowHeight = 24;

	$: if ($patterns) {
		calculateVisibleRows($globalCursorPosY);
	}

	onMount(() => {
		resizeObserver = new ResizeObserver(() => {
			calculateVisibleRows($globalCursorPosY);
		});

		resizeObserver.observe(container);

		calculateVisibleRows(0);
	});

	onDestroy(() => {
		resizeObserver.disconnect();
	});

	function calculateVisibleRows(cursorPositionY: number) {
		const possibleVisibleRowsCount =
			Math.floor(container?.clientHeight / editorRowHeight) + buffer;
		const totalRowsLength = $allPatternRows.length;
		const halfVisibleRows = Math.floor(possibleVisibleRowsCount / 2);

		let startRow = Math.max(cursorPositionY - halfVisibleRows, 0);
		let endRow = Math.min(cursorPositionY + halfVisibleRows, totalRowsLength - 1);

		let ghostRowsAtStart = Math.max(halfVisibleRows - cursorPositionY, 0);
		let ghostRowsAtEnd = Math.max(cursorPositionY + halfVisibleRows - (totalRowsLength - 1), 0);

		visibleRows = [];
		for (let i = 0; i < ghostRowsAtStart; i++) {
			visibleRows.push(createPlaceholderRow(i - ghostRowsAtStart));
		}

		visibleRows.push(...$allPatternRows.slice(startRow, endRow + 1));

		for (let i = 0; i < ghostRowsAtEnd; i++) {
			visibleRows.push(createPlaceholderRow(totalRowsLength + i));
		}
	}

	function createPlaceholderRow(index: number): VisibleRow {
		//placeholders need to have constant global index value, but these values should be impossible to reach
		//within normal usage. they are primarily used as key in svelte's for each loop. without this they would be recreated all the time
		return {
			row: new PatternRow(),
			globalIndex: 0x999999 - index,
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

<div
	bind:this={container}
	on:wheel={handleWheel}
	on:keydown={handleKeyDown}
	tabindex="0"
	class="overflow-y-hidden h-screen select-none mx-auto bg-slate-800 drop-shadow-md font-mono
	text-slate-600 text-md text-center focus:border-2 focus:border-blue-500 outline-none"
>
	<div>
		{#each visibleRows as { row, patternIndex, globalIndex, isPlaceholder, ownerPattern } (globalIndex)}
			{#if isPlaceholder}
				<PlaceholderRow />
			{:else}
				<EditorRow
					{row}
					index={patternIndex}
					class="{patternIndex !== undefined &&
					patternIndex % 4 === 0 &&
					$cursorPosition.posY !== patternIndex
						? 'bg-slate-400/10'
						: ''} {$cursorPosition.posY === patternIndex &&
					ownerPattern === $currentPattern
						? 'bg-blue-800 text-slate-300'
						: ''} {ownerPattern === $currentPattern ? '' : 'opacity-10'}"
				/>
			{/if}
		{/each}
	</div>
</div>
