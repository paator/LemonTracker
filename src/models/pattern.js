import Channel from "./channel";

export default class Pattern {
  constructor(
    number = 0,
    channels = [new Channel(), new Channel(), new Channel()],
    patternRows = [],
    isLoopPoint = false
  ) {
    this.number = number;
    this.channels = channels;
    this.patternRows = patternRows;
    this.isLoopPoint = isLoopPoint;
  }
}
