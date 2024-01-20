<script lang="ts">
	import { cursorPosition } from '$lib/stores/stores';

	export let str: string;
	export let defaultDisplayValue: string | undefined = undefined;
	export let allowZero = false;
	export let xPositionInGrid: number | undefined = undefined;
	export let yPositionInGrid: number;

	function cursorToCellPosition() {
		if (xPositionInGrid === undefined) return;
		cursorPosition.setPosition(xPositionInGrid, yPositionInGrid);
	}

	$: isValueOrDefault =
		(defaultDisplayValue && str === '0' && !allowZero) || str == defaultDisplayValue;

	$: isPositionMatched =
		xPositionInGrid === $cursorPosition.posX && yPositionInGrid === $cursorPosition.posY;

	$: displayValue = isValueOrDefault ? defaultDisplayValue : str;
</script>

<span
	on:click={cursorToCellPosition}
	class:text-slate-500={isValueOrDefault}
	class:bg-blue-50={isPositionMatched}
	class:text-black={isPositionMatched}
	class:animate-[pulse_1.2s_linear_infinite]={isPositionMatched}
>
	{displayValue}
</span>
