import NoteData, { Note } from "./note-data";

export default class ChannelRow {
  instrument: number = 0;
  ornament: number = 0;
  envelope: number = 0;
  noteData: NoteData = new NoteData(Note.None, 0);
  volume: number = 0;
  effect: number = 0;
  effectParamX: number = 0;
  effectParamY: number = 0;
  effectParamZ: number = 0;
}
