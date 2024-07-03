<script lang="ts">
	import DebugBar from '$lib/components/Debug/DebugBar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { audioContext, audioNode } from '$lib/stores/audio';

	onMount(async () => {
		if (!$audioContext) {
			$audioContext = new AudioContext();
			try {
				await $audioContext.audioWorklet.addModule('/processor.js');
			} catch (error) {}

			$audioNode = new AudioWorkletNode($audioContext, 'processor', {
				outputChannelCount: [2]
			});
			$audioNode.connect($audioContext.destination);
		}
	});
</script>

<main class="h-full flex flex-col">
	<div class="p-2 text-slate-200 min-h-0 flex flex-col">
		<slot />
	</div>
	<DebugBar />
</main>
