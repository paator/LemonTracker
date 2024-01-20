export default class NoteData {
	note: Note;
	octave: number;

	constructor(note: Note, octave: number) {
		this.note = note;
		this.octave = octave;
	}

	toString() {
		return `${this.note}${
			this.note === Note.None || this.note === Note.Off ? '-' : this.octave
		}`;
	}
}

export enum Note {
	None = '--',
	C = 'C-',
	Csharp = 'C#',
	D = 'D-',
	Dsharp = 'D#',
	E = 'E-',
	F = 'F-',
	Fsharp = 'F#',
	G = 'G-',
	Gsharp = 'G#',
	A = 'A-',
	Asharp = 'A#',
	B = 'B-',
	Off = 'R-'
}
