<script lang="ts">
	import { onMount } from 'svelte';
	import EditorRow from './EditorRow.svelte';
	import { cursorPosition, currentPattern } from '../../stores/stores.js';

	onMount(() => {
		cursorPosition.setPosition(0, 0);
	});

	function handleKeyDown(event: KeyboardEvent) {
		event.preventDefault();

		switch (event.key) {
			case 'ArrowUp':
				cursorPosition.decrementYBy(1);
				break;
			case 'ArrowDown':
				cursorPosition.incrementYBy(1);
				break;
			case 'ArrowLeft':
				cursorPosition.decrementXBy(1);
				break;
			case 'ArrowRight':
				cursorPosition.incrementXBy(1);
				break;
			case 'PageUp':
				cursorPosition.decrementYBy(0x10);
				break;
			case 'PageDown':
				cursorPosition.incrementYBy(0x10);
				break;
		}
	}

	function handleWheel(event: WheelEvent) {
		if (event.deltaY < 0) {
			cursorPosition.decrementYBy(1);
		} else {
			cursorPosition.incrementYBy(1);
		}
	}
</script>

<div
	on:keydown={handleKeyDown}
	on:wheel={handleWheel}
	class="overflow-y-hidden h-screen select-none mx-auto my-4 bg-slate-800 drop-shadow-md font-mono text-slate-400 text-lg text-center focus:border-2 focus:border-blue-500 outline-none"
>
	{#each $currentPattern.patternRows as row, i}
		<EditorRow {row} index={i} />
	{/each}
</div>
