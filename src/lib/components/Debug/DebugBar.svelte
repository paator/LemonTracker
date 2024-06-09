<script>
	import { cursorPosition, globalCursorPosY } from '$lib/stores/stores';
</script>

<div class="bg-black min-w-full min-h-5 flex p-1 gap-2 font-mono text-sm text-white">
	<p>GlobalCursorPosY: {$globalCursorPosY}</p>
	<p>CursorPosX: {$cursorPosition.posX}</p>
	<p>CursorPosY: {$cursorPosition.posY}</p>
</div>
