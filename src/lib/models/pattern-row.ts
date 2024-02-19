import Channel from './channel';

export default class PatternRow {
	envelopeValue = '....';
	noiseValue = '..';
	channels: Channel[];

	constructor(channels: Channel[] = [new Channel(), new Channel(), new Channel()]) {
		this.channels = channels;
	}
}
