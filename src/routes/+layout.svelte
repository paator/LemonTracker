<script>
	import '../app.css';
	import NavAnchor from '../components/NavAnchor.svelte';
	import lemonLogo from '../assets/lemon.svg';
</script>

<main class="h-full flex flex-col">
	<nav class="flex bg-gray-800 p-3 gap-6 items-center">
		<div class="flex gap-2 items-center">
			<img src={lemonLogo} class="rounded-sm h-8 w-auto" alt="" draggable="false" />
			<span class="font-mono text-yellow-400 font-bold"> LemonTracker </span>
		</div>
		<div class="flex gap-4 text-slate-300 font-mono text-sm">
			<NavAnchor href="/">Module Editor</NavAnchor>
			<NavAnchor href="/#">Explorer</NavAnchor>
		</div>
	</nav>
	<div class="p-4 text-slate-200 min-h-0 flex flex-col">
		<slot />
	</div>
</main>
