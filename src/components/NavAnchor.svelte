<script lang="ts">
	export let href = '';
	export let onClick: (event: MouseEvent) => void = () => {
		return;
	};
</script>

<a
	{href}
	class="shadow-slate-900 drop-shadow-md bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg"
	on:click={onClick}
>
	<slot />
</a>
