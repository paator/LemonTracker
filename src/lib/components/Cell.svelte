<script lang="ts">
	import { cursorPosition } from '$lib/stores/stores';

	export let coordinates: { x: number; y: number };
	export let value: string;
	let selected: boolean;

	$: if ($cursorPosition.posX) {
		selected = isCellSelected();
	}

	function isCellSelected() {
		if ($cursorPosition.posX === coordinates.x && $cursorPosition.posY && coordinates.y) {
			return true;
		}

		return false;
	}
</script>

<span class={selected ? ' bg-cyan-400/40' : ''}>
	{value}
</span>
