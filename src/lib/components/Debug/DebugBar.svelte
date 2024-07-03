<script>
	import { isTrackPlaying } from '$lib/stores/debug';
	import { cursorPosition, globalCursorPosY } from '$lib/stores/stores';
</script>

<div
	class="min-w-full min-h-5 flex p-1 gap-2 font-mono text-sm text-white {$isTrackPlaying
		? 'bg-blue-500'
		: 'bg-black'}"
>
	<p>GlobalCursorPosY: {$globalCursorPosY}</p>
	<p>CursorPosX: {$cursorPosition.posX}</p>
	<p>CursorPosY: {$cursorPosition.posY}</p>
</div>
