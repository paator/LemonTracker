<script lang="ts">
	export let isDisabled = false;
</script>

<button
	on:click
	class="shadow-slate-900 drop-shadow-md bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-lg font-mono text-sm"
	disabled={isDisabled}
>
	<slot />
</button>
