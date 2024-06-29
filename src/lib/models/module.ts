import Pattern from './pattern';

export default class Module {
	title: string;
	author: string;
	initSpeed: number;
	patterns: Pattern[];
	samples: any[];
	ornaments: any[];

	constructor(
		title = '',
		author = '',
		initSpeed = 3,
		patterns: Pattern[] = [new Pattern(undefined, undefined, false)],
		samples: any[] = [],
		ornaments: any[] = []
	) {
		this.title = title;
		this.author = author;
		this.initSpeed = initSpeed;
		this.patterns = patterns;
		this.samples = samples;
		this.ornaments = ornaments;
	}
}
