<script lang="ts">
	import {
		currentPatternIndex,
		cursorPosition,
		moduleAuthor,
		moduleTitle,
		patterns
	} from '$lib/stores/stores.js';
	import PatternEditor from '$lib/components/PatternEditor/PatternEditor.svelte';

	function switchPattern(index: number) {
		$currentPatternIndex = index;
		cursorPosition.setPosition($cursorPosition.posX, 0);
	}
</script>

<div
	class="w-full min-h-0 self-center rounded-xl bg-slate-600 px-3 shadow-slate-900 drop-shadow-md max-w-[1080px] flex flex-col"
>
	<div class="flex gap-4 py-2 font-mono text-xs text-slate-900">
		<div class="grow">
			<span class="text-slate-400">Title:</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md bg-white px-2 shadow-sm"
				bind:value={$moduleTitle}
			/>
		</div>
		<div class="grow">
			<span class="text-slate-400">Author:</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md bg-white px-2 shadow-sm"
				bind:value={$moduleAuthor}
			/>
		</div>
	</div>
	<div
		class="mb-1 flex flex-shrink-0 overflow-auto text-center font-mono text-md shadow-slate-900 gap-[2px] select-none"
	>
		{#each $patterns as pattern, i (i)}
			<button
				class="w-7 flex-shrink-0 {i === $currentPatternIndex
					? 'cursor-default rounded-sm border border-blue-400 bg-blue-600 text-slate-200'
					: 'cursor-pointer rounded-sm border border-slate-400 bg-slate-500 text-slate-900 hover:bg-slate-400'}"
				on:click={() => switchPattern(i)}
			>
				{pattern.number}
			</button>
		{/each}
	</div>
	<PatternEditor />
</div>
