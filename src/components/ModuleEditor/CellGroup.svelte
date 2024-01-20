<script lang="ts">
	import Cell from './Cell.svelte';

	export let maxLength: number;
	export let radix: number;
	export let value = 0;
	export let defaultCellStr: string;
	export let allowZero = false;
	export let yPositionInGrid: number;
	export let xPositionInGrid: number;

	$: valueWithDefaultPrefix = createValueWithDefaultPrefix();

	function createValueWithDefaultPrefix(): string {
		const num = value === 0 ? '' : value.toString(radix).toUpperCase();
		return num.padStart(maxLength, defaultCellStr);
	}
</script>

{#each valueWithDefaultPrefix.split('') as char, i}
	<Cell
		{yPositionInGrid}
		xPositionInGrid={i + xPositionInGrid}
		defaultDisplayValue={defaultCellStr}
		str={char}
		{allowZero}
	/>
{/each}
