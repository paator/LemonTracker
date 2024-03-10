<script lang="ts">
	import type PatternRow from '$lib/models/pattern-row.js';
	import { Note } from '$lib/models/note-data';

	export let row: PatternRow;
	export let index: number;

	$: hexIndex = index.toString(16).padStart(2, '0').toUpperCase();
	$: classesBase = `${$$props.class ?? ''}`;

	function textColorBasedOnCondition(condition: boolean, trueClass: string, falseClass = '') {
		return condition ? trueClass : falseClass;
	}

	function isCharVisible(char: string) {
		return char !== '.';
	}
</script>

<div class="flex relative {classesBase}">
	<span
		class="px-2 {textColorBasedOnCondition(index % 4 === 0, 'text-blue-200', 'text-blue-300')}"
	>
		{hexIndex}
	</span>
	<div class="px-2 flex gap-[0.5px] border-l border-slate-600">
		{#each row.envelopeValue.split('') as cell}
			<span class={textColorBasedOnCondition(isCharVisible(cell), 'text-cyan-400')}>
				{cell}
			</span>
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
			<div class="px-2 flex border-l border-slate-600">
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
			</div>
		{/each}
	{/each}
</div>
