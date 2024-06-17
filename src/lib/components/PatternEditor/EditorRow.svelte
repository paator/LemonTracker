<script lang="ts">
	import type PatternRow from '$lib/models/pattern-row.js';
	import { Note } from '$lib/models/note-data';
	import CellGroup from '../CellGroup.svelte';

	export let row: PatternRow;
	export let index: number = 0;
	export let globalIndex: number = 0;

	$: hexIndex = index.toString(16).padStart(2, '0').toUpperCase();
	$: classesBase = `${$$props.class ?? ''}`;

	function isCharVisible(char: string) {
		return char !== '.';
	}
</script>

<div class="flex relative {classesBase}">
	<CellGroup
		coordinates={{ startingXPosition: -1, yPosition: globalIndex }}
		class="px-2"
		condition={(_hexValue) => index % 4 === 0}
		trueClass="text-blue-200"
		falseClass="text-blue-300"
		values={hexIndex}
	/>
	<div class="px-2 flex border-l border-slate-600">
		<CellGroup
			condition={(envChar) => isCharVisible(envChar)}
			trueClass="text-cyan-400"
			coordinates={{ startingXPosition: 0, yPosition: globalIndex }}
			values={row.envelopeValue.split('')}
		/>
	</div>
	<div class="px-2 flex gap-[0.5px] border-l border-slate-600">
		<CellGroup
			condition={(noiseChar) => isCharVisible(noiseChar)}
			trueClass="text-cyan-400"
			values={row.noiseValue.split('')}
			coordinates={{ startingXPosition: 4, yPosition: globalIndex }}
		/>
	</div>

	{#each row.channels as channel, index (channel)}
		{#each channel.channelRows as channelRow (row)}
			<div class="px-2 flex border-l border-slate-600">
				<div class="px-1 flex gap-[0.5px]">
					<CellGroup
						values={channelRow.noteData}
						coordinates={{ startingXPosition: 6 + index * 9, yPosition: globalIndex }}
						condition={(noteData) => noteData.note !== Note.None}
						trueClass="text-blue-100"
					/>
				</div>
				<div class="px-1 flex gap-[0.5px]">
					<CellGroup
						values={[
							channelRow.instrument,
							channelRow.envelope,
							channelRow.ornament,
							channelRow.volume
						]}
						coordinates={{ startingXPosition: 7 + index * 9, yPosition: globalIndex }}
						condition={(value) => value !== '.'}
						trueClass="text-blue-300"
					/>
				</div>
				<div class="px-1 flex gap-[0.5px]">
					<CellGroup
						values={[
							channelRow.effect,
							channelRow.effectParamX,
							channelRow.effectParamY,
							channelRow.effectParamZ
						]}
						coordinates={{
							startingXPosition: 11 + index * 9,
							yPosition: globalIndex
						}}
						condition={(value) => value !== '.'}
						trueClass="text-yellow-200"
					/>
				</div>
			</div>
		{/each}
	{/each}
</div>
