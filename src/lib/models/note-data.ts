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

	getNoteValue(): number | null {
		const noteValues: { [key: string]: number | null } = {
			'--': null,
			'C-': 0,
			'C#': 1,
			'D-': 2,
			'D#': 3,
			'E-': 4,
			'F-': 5,
			'F#': 6,
			'G-': 7,
			'G#': 8,
			'A-': 9,
			'A#': 10,
			'B-': 11,
			'R-': null
		};

		const baseValue = noteValues[this.note];

		if (baseValue === null) {
			return null;
		}

		return baseValue + this.octave * 12;
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
