import Pattern from "./pattern.js";

export default class Module {
  constructor(
    title = "",
    author = "",
    initSpeed = 3,
    patterns = [new Pattern()],
    samples = [],
    ornaments = []
  ) {
    this.title = title;
    this.author = author;
    this.initSpeed = initSpeed;
    this.patterns = patterns;
    this.samples = samples;
    this.ornaments = ornaments;
  }
}
