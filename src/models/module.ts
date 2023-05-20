import Pattern from "./pattern";

export default class Module {
  title: string;
  author: string;
  initSpeed: number;
  patterns: Pattern[];
  samples: any[];
  ornaments: any[];

  constructor(
    title: string = "",
    author: string = "",
    initSpeed: number = 3,
    patterns: Pattern[] = [new Pattern(undefined, undefined, new Array(64))],
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
