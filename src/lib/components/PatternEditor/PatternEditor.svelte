<script lang="ts">
	import { onMount } from 'svelte';
	import EditorRow from './EditorRow.svelte';
	import {
		cursorPosition,
		currentPattern,
		patterns,
		currentPatternIndex
	} from '$lib/stores/stores.js';

	onMount(() => {
		cursorPosition.setPosition(0, 0);
	});

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
		} else {
			if (
				$cursorPosition.posY + 1 >= $currentPattern.patternRows.length &&
				$currentPatternIndex < $patterns.length - 1
			) {
				$currentPatternIndex++;
				cursorPosition.setPosition($cursorPosition.posX, 0);
			} else {
				cursorPosition.incrementYBy(1);
			}
		}
	}

	function handleWheel(event: WheelEvent) {
		updateCursorPosition(event.deltaY);
	}

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				updateCursorPosition(-1);
				break;
			case 'ArrowDown':
				updateCursorPosition(1);
				break;
		}
	}
</script>

<div
	on:wheel={handleWheel}
	on:keydown={handleKeyDown}
	tabindex="0"
	class="overflow-y-hidden h-screen select-none mx-auto bg-slate-800 drop-shadow-md font-mono
	text-slate-600 text-md text-center focus:border-2 focus:border-blue-500 outline-none"
>
	{#if $currentPatternIndex > 0}
		{#each $patterns[$currentPatternIndex - 1].patternRows as row, i}
			<EditorRow {row} index={i} class="opacity-15" />
		{/each}
	{/if}
	{#each $currentPattern.patternRows as row, i}
		<EditorRow
			{row}
			index={i}
			class="{i % 4 === 0 && $cursorPosition.posY !== i ? 'bg-slate-400/10' : ''}
				{$cursorPosition.posY === i ? 'bg-blue-800 text-slate-300' : ''}"
		/>
	{/each}
	{#if $currentPatternIndex < $patterns.length - 1}
		{#each $patterns[$currentPatternIndex + 1].patternRows as row, i}
			<EditorRow {row} index={i} class="opacity-15" />
		{/each}
	{/if}
</div>
