import NoteData from '$lib/models/note-data';
import { Note } from '$lib/models/note-data';
import type Ornament from '$lib/models/ornament';
import type Sample from '$lib/models/sample';

let isRunning = false;
let channelNotes: NoteData[] = [
	new NoteData(Note.None, 0),
	new NoteData(Note.None, 0),
	new NoteData(Note.None, 0)
];
let channelSamples: Sample[] = [];
let channelVolumes: number[] = [15, 15, 15];

let channelOrnaments: Ornament[] = [
	{ noteShiftValues: [0], loopPoint: 0 },
	{ noteShiftValues: [0], loopPoint: 0 },
	{ noteShiftValues: [0], loopPoint: 0 }
];

let ornamentPositions: number[] = [0, 0, 0];

const PT3ToneTable = [
	0x0d10, 0x0c55, 0x0ba4, 0x0afc, 0x0a5f, 0x09ca, 0x093d, 0x08b8, 0x083b, 0x07c5, 0x0755, 0x06ec,
	0x0688, 0x062a, 0x05d2, 0x057e, 0x052f, 0x04e5, 0x049e, 0x045c, 0x041d, 0x03e2, 0x03ab, 0x0376,
	0x0344, 0x0315, 0x02e9, 0x02bf, 0x0298, 0x0272, 0x024f, 0x022e, 0x020f, 0x01f1, 0x01d5, 0x01bb,
	0x01a2, 0x018b, 0x0174, 0x0160, 0x014c, 0x0139, 0x0128, 0x0117, 0x0107, 0x00f9, 0x00eb, 0x00dd,
	0x00d1, 0x00c5, 0x00ba, 0x00b0, 0x00a6, 0x009d, 0x0094, 0x008c, 0x0084, 0x007c, 0x0075, 0x006f,
	0x0069, 0x0063, 0x005d, 0x0058, 0x0053, 0x004e, 0x004a, 0x0046, 0x0042, 0x003e, 0x003b, 0x0037,
	0x0034, 0x0031, 0x002f, 0x002c, 0x0029, 0x0027, 0x0025, 0x0023, 0x0021, 0x001f, 0x001d, 0x001c,
	0x001a, 0x0019, 0x0017, 0x0016, 0x0015, 0x0014, 0x0012, 0x0011, 0x0010, 0x000f, 0x000e, 0x000d
];

self.onmessage = (event) => {
	const { type, value } = event.data;

	switch (type) {
		case 'start':
			startBackgroundLoop();
			break;
		case 'stop':
			stopBackgroundLoop();
			break;
		case 'sample_0':
			channelSamples[0] = value;
			break;
		case 'sample_1':
			channelSamples[1] = value;
			break;
		case 'sample_2':
			channelSamples[2] = value;
			break;
		case 'note_0':
			channelNotes[0] = value;
			break;
		case 'note_1':
			channelNotes[1] = value;
			break;
		case 'note_2':
			channelNotes[2] = value;
			break;
		case 'volume_0':
			channelVolumes[0] = value;
			break;
		case 'volume_1':
			channelVolumes[1] = value;
			break;
		case 'volume_2':
			channelVolumes[2] = value;
			break;
		case 'ornament_0':
			updateOrnamentPosition(value, 0);
			break;
		case 'ornament_1':
			updateOrnamentPosition(value, 1);
			break;
		case 'ornament_2':
			updateOrnamentPosition(value, 2);
			break;
	}
};

function updateOrnamentPosition(ornament: Ornament, channel: number) {
	ornamentPositions[channel] = 0;
	channelOrnaments[channel] = ornament;
}

function startBackgroundLoop() {
	if (!isRunning) {
		isRunning = true;
		backgroundLoop();
	}
}

function stopBackgroundLoop() {
	isRunning = false;
}

async function backgroundLoop() {
	while (isRunning) {
		for (let channel = 0; channel < 3; channel++) {
			const noteData = new NoteData(channelNotes[channel].note, channelNotes[channel].octave);
			const noteIntValue = noteData.getNoteValue();
			const ornament = channelOrnaments[channel];

			const currentOrnamentValue = ornament?.noteShiftValues[ornamentPositions[channel]];

			console.log('curerntOrnamentValue', currentOrnamentValue);

			if (noteIntValue) {
				const noteShiftedByOrnament = noteIntValue + currentOrnamentValue;
				const rawNoteAyValue = PT3ToneTable[noteShiftedByOrnament];

				self.postMessage({
					type: 'noteFrequency',
					channel: channel,
					value: rawNoteAyValue
				});
			}

			self.postMessage({
				type: 'volume',
				channel: channel,
				value: channelVolumes[channel]
			});

			if (ornamentPositions[channel] >= ornament.noteShiftValues.length - 1) {
				ornamentPositions[channel] = ornament.loopPoint;
			} else {
				ornamentPositions[channel]++;
			}
		}

		//50hz tick
		const delay = 1000 / 50;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
}
