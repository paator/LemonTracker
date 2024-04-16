import type Pattern from './pattern';
import type PatternRow from './pattern-row';

export default interface VisibleRow {
	row: PatternRow;
	globalIndex: number;
	isPlaceholder: boolean;
	patternIndex?: number;
	ownerPattern?: Pattern;
}
