import ChannelRow from "./channel-row";

export default class Channel {
  channelRows: ChannelRow[];

  constructor(channelRows: ChannelRow[] = new Array<ChannelRow>(64)) {
    this.channelRows = channelRows;
  }
}
