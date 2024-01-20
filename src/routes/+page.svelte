<script lang="ts">
	import EditorButton from '$lib/components/EditorMenu/EditorButton.svelte';
	import EditorMenu from '$lib/components/EditorMenu/EditorMenu.svelte';
	import Module from '$lib/models/module';
	import VortexModuleConverter from '$lib/services/vt-converter';
	import { currentPatternIndex, setCurrentModule } from '$lib/stores/stores.js';
	import ModuleEditor from '$lib/components/ModuleEditor/ModuleEditor.svelte';

	let fileLoaderInput: HTMLInputElement;

	function newModule() {
		setCurrentModule(new Module());
		currentPatternIndex.set(0);
	}

	function loadModule() {
		fileLoaderInput.click();
	}

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files || files.length === 0) return;

		const file = files[0];
		const converter = new VortexModuleConverter();

		const lemonModule = await converter.convertToLemonModule(
			new Blob([file], { type: file.type })
		);

		setCurrentModule(lemonModule);
		currentPatternIndex.set(0);
	}
</script>

<div class="flex flex-col gap-4 min-h-0">
	<EditorMenu>
		<EditorButton on:click={newModule}>New Track</EditorButton>
		<EditorButton on:click={loadModule}>Load Module</EditorButton>
	</EditorMenu>
	<ModuleEditor />
</div>
<input
	bind:this={fileLoaderInput}
	hidden
	type="file"
	accept=".vt2,.pt3"
	on:change={handleFileSelect}
/>
