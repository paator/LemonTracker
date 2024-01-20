import { derived, get, writable } from 'svelte/store';
import Pattern from '../models/pattern';
import type Module from '../models/module';

export const moduleTitle = writable('');
export const moduleAuthor = writable('');
export const moduleInitSpeed = writable(3);
export const patterns = writable([new Pattern()]);
export const currentPatternIndex = writable(0);
export const currentPattern = derived(
	[currentPatternIndex, patterns],
	([$currentPatternIndex, $patterns]) => $patterns[$currentPatternIndex]
);
export const currentPatternLength = derived(
	currentPattern,
	($currentPattern) => $currentPattern.length
);
export function setCurrentModule(module: Module) {
	moduleTitle.set(module.title);
	moduleAuthor.set(module.author);
	moduleInitSpeed.set(module.initSpeed);
	patterns.set(module.patterns);
}
export type CursorPosition = {
	posX: number;
	posY: number;
};
function createCursorPosition() {
	const initialState: CursorPosition = {
		posX: 0,
		posY: 0
	};
	const { subscribe, update, set } = writable(initialState);
	return {
		setPosition: function (x: number, y: number) {
			set({ posX: x, posY: y });
		},
		subscribe,
		incrementXBy: function (value: number) {
			update((oldPosition) => {
				if (oldPosition.posX + value > 32) {
					return { ...oldPosition, posX: oldPosition.posX };
				} else {
					return { ...oldPosition, pos: oldPosition.posX + value };
				}
			});
		},
		decrementXBy: function (value: number) {
			update((oldPosition) => {
				if (oldPosition.posX - value < 0) {
					return { ...oldPosition, posx: 0 };
				} else {
					return { ...oldPosition, pos: oldPosition.posX - value };
				}
			});
		},
		incrementYBy: function (value: number) {
			update((oldPosition) => {
				//TODO: should I get rid of get() for performance reasons?
				if (oldPosition.posY + value > get(currentPatternLength) - 1) {
					return { ...oldPosition, posY: oldPosition.posY };
				} else {
					return { ...oldPosition, posY: oldPosition.posY + value };
				}
			});
		},
		decrementYBy: function (value: number) {
			update((oldPosition) => {
				if (oldPosition.posY - value < 0) {
					return { ...oldPosition, posY: 0 };
				} else {
					return { ...oldPosition, posY: oldPosition.posY - value };
				}
			});
		}
	};
}

export const cursorPosition = createCursorPosition();
