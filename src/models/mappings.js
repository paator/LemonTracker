import NoteData, { Note } from "./note-data";

export default function toModuleNote(noteString) {
  if (noteString.length < 3) return null;

  const noteLabel = noteString.substring(0, 2);

  const note =
    Object.values(Note).find((value) => value === noteLabel) || Note.None;

  const octave = Number(noteString.substring(2)) || 0;
  return new NoteData(note, octave);
}
