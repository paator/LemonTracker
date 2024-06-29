import ChannelRow from './channel-row';

export default class PatternRow {
	envelopeValue = '....';
	noiseValue = '..';
	channelsData: ChannelRow[];

	constructor(channels: ChannelRow[] = [new ChannelRow(), new ChannelRow(), new ChannelRow()]) {
		this.channelsData = channels;
	}
}
