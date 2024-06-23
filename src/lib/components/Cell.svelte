<script lang="ts">
	import { cursorPosition, globalCursorPosY } from '$lib/stores/stores';

	export let coordinates: { x: number; y: number };
	export let value: string;
	let selected: boolean;

	$: {
		selected = isCellSelected($cursorPosition.posX, $globalCursorPosY);
	}

	function isCellSelected(posX: number, posY: number) {
		if (posX === coordinates.x && posY === coordinates.y) {
			return true;
		}

		return false;
	}
</script>

<span class={selected ? ' bg-cyan-300/40' : ''}>
	{value}
</span>
