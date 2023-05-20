import Channel from "./channel.js";
import PatternRow from "./pattern-row";

export default class Pattern {
  number: number;
  channels: Channel[];
  patternRows: PatternRow[];
  isLoopPoint: boolean;

  constructor(
    number: number = 0,
    channels: Channel[] = [new Channel(), new Channel(), new Channel()],
    patternRows: any[] = [],
    isLoopPoint: boolean = false
  ) {
    this.number = number;
    this.channels = channels;
    this.patternRows = patternRows;
    this.isLoopPoint = isLoopPoint;
  }
}
