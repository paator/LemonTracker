import Module from '$lib/models/module.js';
import Pattern from '$lib/models/pattern.js';
import toModuleNote from '$lib/models/mappings.js';
import PatternRow from '$lib/models/pattern-row.js';
import ChannelRow from '$lib/models/channel-row.js';
import type { ModuleConverter } from './module-converter';

type VortexMetaData = {
	VortexTrackerII: string;
	Version: string;
	Title: string;
	Author: string;
	ShowInfo: string;
	NoteTable: string;
	ChipFreq: string;
	IntFreq: string;
	Speed: string;
	Noise: string;
	PlayOrder: string;
};

export default class VortexModuleConverter implements ModuleConverter {
	convertToLemonModule(moduleFile: Blob): Promise<Module> {
		const createGenerator = (lines: string[]): Generator<string, void, string> => {
			return (function* generator(fileLines) {
				for (const line of fileLines) {
					yield line;
				}
			})(lines);
		};

		const parseMetadata = (generator: Generator<string, void, string>) => {
			let line: IteratorResult<string, void>;

			const metadata: VortexMetaData = {
				VortexTrackerII: '1',
				Version: '3.7',
				Title: '',
				Author: '',
				ShowInfo: '0',
				NoteTable: '2',
				ChipFreq: '1750000',
				IntFreq: '48828',
				Speed: '3',
				Noise: 'HEX',
				PlayOrder: 'L0'
			};

			while (!(line = generator.next()).done) {
				if (line.value.startsWith('[Module]')) {
					break;
				}
			}

			if (line.value === undefined) {
				throw new Error('Could not find the module metadata section in .vt2 file.');
			}

			const builder: string[] = [];
			while (!(line = generator.next()).done) {
				if (line.value.startsWith('[')) {
					break;
				}

				let isReadingValue = false;
				let key: string | null = null;

				for (const c of line.value) {
					if (!isReadingValue && c === '=') {
						isReadingValue = true;
						key = builder.join('');
						builder.length = 0;
					} else {
						builder.push(c);
					}
				}

				if (key != null) {
					metadata[key as keyof typeof metadata] = builder.join('');
					builder.length = 0;
				}
			}

			return metadata;
		};

		const setMetadataValues = (metadata: VortexMetaData, module: Module) => {
			module.title = metadata['Title'];
			module.author = metadata['Author'];
			module.initSpeed = parseInt(metadata['Speed']);
		};

		const extractPatterns = (generator: Generator<string, void, string>) => {
			const patterns: Pattern[] = [];
			let line: IteratorResult<string, void>;
			let i = 0;

			while (!(line = generator.next()).done) {
				if (!line.value) continue;
				if (!line.value.startsWith('[Pattern')) continue;

				const match = line.value.match(/\d+/);
				let patternNumber = 0;

				if (match) {
					patternNumber = parseInt(match[0], 10);
				}

				const pattern = new Pattern(patternNumber);
				patterns.push(pattern);

				while (true) {
					const patternLine = generator.next().value;
					if (!patternLine || patternLine.trim() === '') break;

					const rowValues = patternLine.split('|');
					const patternRow = createPatternRow(rowValues);
					patterns[i].patternRows.push(patternRow);
				}

				i++;
			}

			return patterns;
		};

		const createPatternRow = (rowValues: string[]) => {
			const patternRow = new PatternRow();

			let envelopeValue = rowValues[0];
			patternRow.envelopeValue = envelopeValue;

			let noiseValue = rowValues[1];
			patternRow.noiseValue = noiseValue;

			// Channel A
			let trimmedRowData = rowValues[2].replace(/\s+/, '');
			patternRow.channelsData[0] = mapRowData(trimmedRowData);

			// Channel B
			trimmedRowData = rowValues[3].replace(/\s+/, '');
			patternRow.channelsData[1] = mapRowData(trimmedRowData);

			// Channel C
			trimmedRowData = rowValues[4].replace(/\s+/, '');
			patternRow.channelsData[2] = mapRowData(trimmedRowData);
			return patternRow;
		};

		const mapRowData = (trimmedRowData: string) => {
			const row = new ChannelRow();
			row.noteData = toModuleNote(trimmedRowData.slice(0, 3));
			row.instrument = trimmedRowData[3];
			row.envelope = trimmedRowData[4];
			row.ornament = trimmedRowData[5];
			row.volume = trimmedRowData[6];
			row.effect = trimmedRowData[8];
			row.effectParamX = trimmedRowData[9];
			row.effectParamY = trimmedRowData[10];
			row.effectParamZ = trimmedRowData[11];
			return row;
		};

		const getPatternNumbersOrder = (patternOrder: string[]) => {
			return patternOrder.map((x) => {
				x = x.replace(/^L+/, '');
				return parseInt(x);
			});
		};

		const addPatternsToModule = (
			patterns: Pattern[],
			patternNumbersOrder: number[],
			module: Module
		) => {
			for (const patternNumber of patternNumbersOrder) {
				const pattern = patterns.find((x) => x.number === patternNumber);
				if (pattern) {
					module.patterns.push(pattern);
				}
			}
		};

		return new Promise((resolve, reject) => {
			const module = new Module('', '', 3, []);
			const fileReader = new FileReader();

			fileReader.onerror = () => {
				reject(fileReader.error);
			};

			fileReader.onload = (_progressEvent) => {
				const text = fileReader.result as string;

				const lines = text.split('\r\n');

				const generator = createGenerator(lines);
				const metadata = parseMetadata(generator);
				setMetadataValues(metadata, module);

				const patterns = extractPatterns(generator);
				const patternOrder = metadata['PlayOrder'].split(',');
				const patternNumbersOrder = getPatternNumbersOrder(patternOrder);
				addPatternsToModule(patterns, patternNumbersOrder, module);

				resolve(module);
			};

			fileReader.readAsText(moduleFile);
		});
	}
}
