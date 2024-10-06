import type Ornament from './ornament';
import type Sample from './sample';
import Pattern from './pattern';

export default class Module {
	title: string;
	author: string;
	initSpeed: number;
	patterns: Pattern[];
	samples: Sample[];
	ornaments: Ornament[];

	constructor(
		title = '',
		author = '',
		initSpeed = 3,
		patterns: Pattern[] = [new Pattern(undefined, undefined, false)],
		samples: Sample[] = [],
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
