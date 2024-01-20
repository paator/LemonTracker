import type ChannelRow from './channel-row';

export default class Channel {
	channelRows: ChannelRow[];

	constructor(channelRows: ChannelRow[] = []) {
		this.channelRows = channelRows;
	}
}
