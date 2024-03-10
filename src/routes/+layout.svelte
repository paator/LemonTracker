<script>
	import '../app.css';
</script>

<main class="h-full flex flex-col">
	<nav class="flex bg-gray-800 p-3 gap-6 items-center">
		<div class="flex gap-2 items-center">
			<span class="font-mono text-yellow-400 font-bold"> LemonTracker </span>
		</div>
	</nav>
	<div class="p-2 text-slate-200 min-h-0 flex flex-col">
		<slot />
	</div>
</main>
