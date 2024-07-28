import type { ModuleConverter } from './module-converter';

interface ModuleConverterConstructor {
	new (): ModuleConverter;
}

class ConvertersContainer {
	private converters = new Map<string, ModuleConverterConstructor>();

	register(fileExtension: string, converterConstructor: ModuleConverterConstructor) {
		this.converters.set(fileExtension, converterConstructor);
	}

	resolve(extension: string) {
		const converterType = this.converters.get(extension);

		if (!converterType) {
			throw new Error(`Converter not found for extension: ${extension}`);
		}

		return new converterType();
	}
}

const convertersContainer = new ConvertersContainer();
export default convertersContainer;
