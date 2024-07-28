import type Ornament from './ornament';
import Pattern from './pattern';

export default class Module {
	title: string;
	author: string;
	initSpeed: number;
	patterns: Pattern[];
	samples: any[];
	ornaments: Ornament[];

	constructor(
		title = '',
		author = '',
		initSpeed = 3,
		patterns: Pattern[] = [new Pattern(undefined, undefined, false)],
		samples: any[] = [],
		ornaments: Ornament[] = []
	) {
		this.title = title;
		this.author = author;
		this.initSpeed = initSpeed;
		this.patterns = patterns;
		this.samples = samples;
		this.ornaments = ornaments;
	}
}
