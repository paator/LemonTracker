import NoteData, { Note } from './note-data';

export default class ChannelRow {
	instrument = 0;
	ornament = 0;
	envelope = 0;
	noteData: NoteData = new NoteData(Note.None, 0);
	volume = 0;
	effect = 0;
	effectParamX = 0;
	effectParamY = 0;
	effectParamZ = 0;
}
