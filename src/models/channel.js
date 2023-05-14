export default class Channel {
  constructor(channelRows = []) {
    this.id = crypto.randomUUID();
    this.channelRows = channelRows;
  }
}
