import Channel from './channel.js';
import type PatternRow from './pattern-row';

export default class Pattern {
	number: number;
	channels: Channel[];
	patternRows: PatternRow[];
	isLoopPoint: boolean;

	constructor(
		number = 0,
		channels: Channel[] = [new Channel(), new Channel(), new Channel()],
		patternRows: PatternRow[] = [],
		isLoopPoint = false
	) {
		this.number = number;
		this.channels = channels;
		this.patternRows = patternRows;
		this.isLoopPoint = isLoopPoint;
	}

	public get length(): number {
		return this.patternRows.length;
	}
}
