import type PatternRow from './pattern-row.js';

export default class Pattern {
	number: number;
	patternRows: PatternRow[];
	isLoopPoint: boolean;

	constructor(number = 0, patternRows: PatternRow[] = [], isLoopPoint = false) {
		this.number = number;
		this.patternRows = patternRows;
		this.isLoopPoint = isLoopPoint;
	}

	public get length(): number {
		return this.patternRows.length;
	}
}
