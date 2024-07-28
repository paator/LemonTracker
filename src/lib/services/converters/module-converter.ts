import type Module from '$lib/models/module';

export interface ModuleConverter {
	convertToLemonModule(moduleFile: Blob): Promise<Module>;
}
