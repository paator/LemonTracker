<script lang="ts">
	import { cursorPosition } from '$lib/stores/stores.js';

	export let yPositionInGrid: number;
	export let className = '';

	$: isMultipleOfFour = yPositionInGrid % 4 === 0;
	$: isNotMultipleOfFour = yPositionInGrid % 4 !== 0;
	$: isActivePosition = $cursorPosition.posY === yPositionInGrid;
</script>

<span
	class="{className} px-2"
	class:text-blue-300={isNotMultipleOfFour}
	class:text-blue-200={isMultipleOfFour}
	class:bg-blue-800={isActivePosition}
	class:bg-slate-700={isMultipleOfFour && !isActivePosition}
>
	<slot />
</span>
