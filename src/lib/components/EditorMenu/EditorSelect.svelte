<script lang="ts" context="module">
	export type EditorSelectOption = {
		value: string|number|null|undefined,
		label?: string
	}
</script>

<script lang="ts">
	export let isDisabled = false;
	export let value: EditorSelectOption['value'];
	export let options: EditorSelectOption[];
	export let placeholder: string|undefined = '---';
</script>

<select
	class="shadow-slate-900 drop-shadow-md bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-lg font-mono text-xs transition-colors"
	disabled={isDisabled}
	bind:value={value}
>
	{#if placeholder}
		<option value="" disabled selected>{@html placeholder}</option>
	{/if}
	{#each options as option}
		<option value={option.value}>{option.label ?? option.value}</option>
	{/each}
</select>
