export default class NoteData {
  constructor(note, octave) {
    this.note = note;
    this.octave = octave;
  }

  toString() {
    return `${this.note}${
      this.note === Note.None || this.note === Note.Off ? "-" : this.octave
    }`;
  }
}

export const Note = {
  None: "--",
  C: "C-",
  Csharp: "C#",
  D: "D-",
  Dsharp: "D#",
  E: "E-",
  F: "F-",
  Fsharp: "F#",
  G: "G-",
  Gsharp: "G#",
  A: "A-",
  Asharp: "A#",
  B: "B-",
  Off: "R-",
};
