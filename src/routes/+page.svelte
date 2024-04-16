<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { listen, type UnlistenFn } from '@tauri-apps/api/event';
	import EditorButton from '$lib/components/EditorMenu/EditorButton.svelte';
	import EditorMenu from '$lib/components/EditorMenu/EditorMenu.svelte';
	import Module from '$lib/models/module';
	import VortexModuleConverter from '$lib/services/vt-converter';
	import { currentPatternIndex, cursorPosition, setCurrentModule } from '$lib/stores/stores.js';
	import ModuleEditor from '$lib/components/ModuleEditor/ModuleEditor.svelte';

	let fileLoaderInput: HTMLInputElement;
	let unlisten: UnlistenFn;

	onMount(async () => {
		const eventHandlers: Record<string, () => void> = {
			new: newModule,
			open: loadModule
		};

		unlisten = await listen<string>('menu', (event) => {
			const payload = event.payload as keyof typeof eventHandlers;
			const handler = eventHandlers[payload];
			if (handler) {
				handler();
			}
		});
	});

	onDestroy(() => unlisten());

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
		cursorPosition.setPosition(0, 0);
	}
</script>

<div class="flex flex-col gap-2 min-h-0">
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
