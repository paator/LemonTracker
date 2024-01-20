<script lang="ts">
	import Cell from './Cell.svelte';
	import type ChannelRow from '../../models/channel-row';

	export let row: ChannelRow;
	export let className = '';
	export let yPositionInGrid: number;
	export let xPositionInGrid: number;

	function toHexString(value: number): string {
		return value.toString(16).toUpperCase();
	}
</script>

<div class={`${className} flex gap-2`}>
	<span class="text-blue-100">
		<Cell
			{yPositionInGrid}
			{xPositionInGrid}
			str={row.noteData.toString()}
			defaultDisplayValue="---"
		/>
	</span>

	<span class="text-blue-300">
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 1}
			str={toHexString(row.instrument)}
			defaultDisplayValue="."
		/>
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 2}
			str={toHexString(row.envelope)}
			defaultDisplayValue="."
		/>
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 3}
			str={toHexString(row.ornament)}
			defaultDisplayValue="."
		/>
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 4}
			str={toHexString(row.volume)}
			defaultDisplayValue="."
		/>
	</span>

	<span class="text-yellow-200">
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 5}
			str={toHexString(row.effect)}
			defaultDisplayValue="."
		/>
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 6}
			str={toHexString(row.effectParamX)}
			defaultDisplayValue="."
		/>
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 7}
			str={toHexString(row.effectParamY)}
			defaultDisplayValue="."
		/>
		<Cell
			{yPositionInGrid}
			xPositionInGrid={xPositionInGrid + 8}
			str={toHexString(row.effectParamZ)}
			defaultDisplayValue="."
		/>
	</span>
</div>
