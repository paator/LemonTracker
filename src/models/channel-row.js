import { Note } from "./note-data";

export default class ChannelRow {
  constructor(
    instrument = "",
    ornament = "",
    envelope = "",
    noteData = null,
    volume = "",
    effect = "",
    effectParamX = "",
    effectParamY = "",
    effectParamZ = ""
  ) {
    this.id = crypto.randomUUID();
    this.instrument = instrument;
    this.ornament = ornament;
    this.envelope = envelope;
    this.noteData = noteData;
    this.volume = volume;
    this.effect = effect;
    this.effectParamX = effectParamX;
    this.effectParamY = effectParamY;
    this.effectParamZ = effectParamZ;
  }

  get hasNoteData() {
    return this.noteData?.note !== Note.None;
  }
}
