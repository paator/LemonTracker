<script lang="ts">
	import DebugBar from '$lib/components/Debug/DebugBar.svelte';
	import '../app.css';
</script>

<main class="h-full flex flex-col">
	<div class="p-2 text-slate-200 min-h-0 flex flex-col">
		<slot />
	</div>
	<DebugBar />
</main>
