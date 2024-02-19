<script lang="ts">
	import { onMount } from 'svelte';
	import { currentPatternIndex, cursorPosition, patterns } from '$lib/stores/stores.js';
	import type PatternRow from '$lib/models/pattern-row.js';
	import { Note } from '$lib/models/note-data';
	import ChannelRow from '$lib/models/channel-row';

	export let row: PatternRow;
	export let index: number;

	let height = 0;
	let ref: HTMLElement;
	let previousPatternRows = 0;

	onMount(() => {
		height = ref.offsetHeight;
	});

	$: {
		if ($currentPatternIndex > 0) {
			previousPatternRows = $patterns[$currentPatternIndex - 1].length;
		} else {
			previousPatternRows = 0;
		}
	}

	$: hexIndex = index.toString(16).padStart(2, '0').toUpperCase();
	$: style = `top: calc(${($cursorPosition.posY + previousPatternRows) * -height}px + 50%)`;
	$: classesBase = `${$$props.class ?? ''}`;

	function textColorBasedOnCondition(
		condition: boolean,
		trueClass: string,
		falseClass: string = ''
	) {
		return condition ? trueClass : falseClass;
	}

	function isCharVisible(char: string) {
		return char !== '.';
	}
</script>

<div bind:this={ref} class="flex relative {classesBase}" {style}>
	<span
		class="px-2 {textColorBasedOnCondition(index % 4 === 0, 'text-blue-200', 'text-blue-300')}"
	>
		{hexIndex}
	</span>
	<div class="px-2 flex gap-[0.5px] border-l border-slate-600">
		{#each row.envelopeValue.split('') as cell}
			<span class={textColorBasedOnCondition(isCharVisible(cell), 'text-cyan-400')}
				>{cell}</span
			>
		{/each}
	</div>
	<div class="px-2 flex gap-[0.5px] border-l border-slate-600">
		{#each row.noiseValue.split('') as cell}
			<span class={textColorBasedOnCondition(isCharVisible(cell), 'text-cyan-400')}>
				{cell}
			</span>
		{/each}
	</div>

	{#each row.channels as channel (channel)}
		{#each channel.channelRows as row (row)}
			<span class="px-2 flex border-l border-slate-600">
				<div class="px-1 flex gap-[0.5px]">
					<span
						class={textColorBasedOnCondition(
							row.noteData.note !== Note.None,
							'text-blue-100'
						)}
					>
						{row.noteData}
					</span>
				</div>
				<div class="px-1 flex gap-[0.5px]">
					{#each ['instrument', 'envelope', 'ornament', 'volume'] as prop (prop)}
						<span class={textColorBasedOnCondition(row[prop] !== '.', 'text-blue-300')}>
							{row[prop]}
						</span>
					{/each}
				</div>
				<div class="px-1 flex gap-[0.5px]">
					{#each ['effect', 'effectParamX', 'effectParamY', 'effectParamZ'] as prop (prop)}
						<span
							class={textColorBasedOnCondition(row[prop] !== '.', 'text-yellow-200')}
						>
							{row[prop]}
						</span>
					{/each}
				</div>
			</span>
		{/each}
	{/each}
</div>
