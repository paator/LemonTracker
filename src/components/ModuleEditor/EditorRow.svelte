<script lang="ts">
	import { onMount } from 'svelte';
	import { currentPattern, cursorPosition } from '../../stores/stores.js';
	import Cell from './Cell.svelte';
	import CellGroup from './CellGroup.svelte';
	import ChannelRow from './ChannelRow.svelte';
	import RowContainer from './RowContainer.svelte';
	import Border from './Border.svelte';
	import type PatternRow from '../../models/pattern-row';

	export let row: PatternRow;
	export let index: number;

	let height = 0;

	let ref: HTMLElement;

	onMount(() => {
		height = ref.offsetHeight;
	});

	$: style = `top: calc(${$cursorPosition.posY * -height}px + 50%)`;
</script>

<div bind:this={ref} class="flex relative" {style}>
	<RowContainer yPositionInGrid={index}>
		<Cell yPositionInGrid={index} str={index.toString(16).padStart(2, '0').toUpperCase()} />
	</RowContainer>
	<Border />
	<RowContainer yPositionInGrid={index}>
		<CellGroup
			maxLength={4}
			radix={16}
			value={row.envelopeValue}
			defaultCellStr="."
			allowZero={true}
			yPositionInGrid={index}
			xPositionInGrid={0}
		/>
	</RowContainer>
	<Border />
	<RowContainer yPositionInGrid={index}>
		<CellGroup
			maxLength={2}
			radix={16}
			value={row.noiseValue}
			defaultCellStr="."
			allowZero={true}
			yPositionInGrid={index}
			xPositionInGrid={4}
		/>
	</RowContainer>
	<Border />
	<RowContainer yPositionInGrid={index}>
		<ChannelRow
			row={$currentPattern.channels[0].channelRows[index]}
			yPositionInGrid={index}
			xPositionInGrid={6}
		/>
	</RowContainer>
	<Border />
	<RowContainer yPositionInGrid={index}>
		<ChannelRow
			row={$currentPattern.channels[1].channelRows[index]}
			yPositionInGrid={index}
			xPositionInGrid={15}
		/>
	</RowContainer>
	<Border />
	<RowContainer yPositionInGrid={index}>
		<ChannelRow
			row={$currentPattern.channels[2].channelRows[index]}
			yPositionInGrid={index}
			xPositionInGrid={24}
		/>
	</RowContainer>
</div>
