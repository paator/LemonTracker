import { Ayumi } from './ayumi.js';

class Processor extends AudioWorkletProcessor {
	constructor() {
		super();
		this.ayumi = new Ayumi();
		this.ayumi.configure(false, 1750000, 44100);
		this.ayumi.setPan(0, 0.1, 0);
		this.ayumi.setPan(1, 0.5, 0);
		this.ayumi.setPan(2, 0.9, 0);
		this.noteFreq = 0x0d10;
	}

	static get parameterDescriptors() {
		return [];
	}

	process(inputs, outputs) {
		console.log('processing...');

		const left = outputs[0];
		const right = outputs[1];

		console.log(left.length);

		this.ayumi.setMixer(0, 0, 1, 0);
		this.ayumi.setMixer(1, 1, 1, 0);
		this.ayumi.setMixer(2, 1, 1, 0);
		this.ayumi.setVolume(0, 0xc);
		this.ayumi.setTone(0, this.noteFreq);

		for (let i = 0; i < left.length; i++) {
			this.ayumi.process();
			this.ayumi.removeDC();
			console.log(this.ayumi.left);
			console.log(this.ayumi.right);
			left[i] = this.ayumi.left;
			right[i] = this.ayumi.right;
		}

		return true;
	}
}

registerProcessor('processor', Processor);
