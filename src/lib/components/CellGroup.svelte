<script lang="ts" generics="TValue extends {}">
	import Cell from './Cell.svelte';

	export let values: TValue[] | TValue;
	export let condition: (value: TValue) => boolean;

	export let trueClass = '';
	export let falseClass = '';
	export let coordinates: { startingXPosition: number; yPosition: number };

	function textColorBasedOnCondition(condition: boolean, trueClass: string, falseClass = '') {
		return condition ? trueClass : falseClass;
	}
</script>

{#if Array.isArray(values)}
	{#each values as singleCellValue, index}
		<span
			class="{$$props.class} {textColorBasedOnCondition(
				condition(singleCellValue),
				trueClass,
				falseClass
			)}"
		>
			<Cell
				value={singleCellValue.toString()}
				coordinates={{ x: coordinates.startingXPosition + index, y: coordinates.yPosition }}
			/>
		</span>
	{/each}
{:else}
	<span
		class="{$$props.class} {textColorBasedOnCondition(
			condition(values),
			trueClass,
			falseClass
		)}"
	>
		<Cell
			value={values.toString()}
			coordinates={{ x: coordinates.startingXPosition, y: coordinates.yPosition }}
		/>
	</span>
{/if}
