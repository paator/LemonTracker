export default class Module {
  constructor(
    title = "",
    author = "",
    initSpeed = 3,
    patterns = [],
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
