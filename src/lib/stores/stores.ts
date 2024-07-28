import { derived, get, writable, type Readable } from 'svelte/store';
import Pattern from '$lib/models/pattern';
import type Module from '$lib/models/module';
import type VisibleRow from '$lib/models/visible-row';
import type Ornament from '$lib/models/ornament';

export const moduleTitle = writable('');
export const moduleAuthor = writable('');
export const moduleInitSpeed = writable(3);
export const patterns = writable([new Pattern()]);
export const ornaments = writable<Ornament[]>([]);
export const currentPatternIndex = writable(0);
export const currentPattern = derived(
	[currentPatternIndex, patterns],
	([$currentPatternIndex, $patterns]) => $patterns[$currentPatternIndex]
);

export const currentPatternLength = derived(
	currentPattern,
	($currentPattern) => $currentPattern.length
);

export const allPatternRows = derived(patterns, ($patterns): VisibleRow[] => {
	let currentIndex = 0;

	return $patterns
		.map((pattern) =>
			pattern.patternRows.map((row, rowIndex) => ({
				row: row,
				globalIndex: currentIndex++,
				patternIndex: rowIndex,
				isPlaceholder: false,
				ownerPattern: pattern
			}))
		)
		.flat();
});

export function setCurrentModule(module: Module) {
	moduleTitle.set(module.title);
	moduleAuthor.set(module.author);
	moduleInitSpeed.set(module.initSpeed);
	patterns.set(module.patterns);
	ornaments.set(module.ornaments);
	cursorPosition.setPosition(0, 0);
}

export type CursorPosition = {
	posX: number;
	posY: number;
};

function createCursorPosition() {
	const initialState: CursorPosition = { posX: 0, posY: 0 };
	const { subscribe, update, set } = writable(initialState);

	function adjustPosition(prop: 'posX' | 'posY', value: number) {
		update((state) => ({ ...state, [prop]: state[prop] + value }));
	}

	return {
		subscribe,
		setPosition: (x: number, y: number) => set({ posX: x, posY: y }),
		incrementXBy: (value: number) => adjustPosition('posX', value),
		decrementXBy: (value: number) => adjustPosition('posX', -value),
		incrementYBy: (value: number) => adjustPosition('posY', value),
		decrementYBy: (value: number) => adjustPosition('posY', -value)
	};
}

export const cursorPosition = createCursorPosition();

export const globalCursorPosY = derived(
	[cursorPosition, patterns, currentPatternIndex],
	([$cursorPosition, $patterns, $currentPatternIndex]) => {
		let lengthBeforeCurrent = 0;
		for (let i = 0; i < $currentPatternIndex; i++) {
			lengthBeforeCurrent += $patterns[i].patternRows.length;
		}

		return lengthBeforeCurrent + $cursorPosition.posY;
	}
);

export const currentPatternSelectedRow = derived(cursorPosition, ($cursorPosition) => {});
