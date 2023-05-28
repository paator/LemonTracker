import ChannelRow from "../models/channel-row";
import Channel from "../models/channel";
import Module from "../models/module";
import Pattern from "../models/pattern";
import PatternRow from "../models/pattern-row";
import { Note } from "../models/note-data";
import NoteData from "../models/note-data";

enum PT3FreqTable {
  ProTracker = 0,
  SoundTracker,
  ASMorPSC,
  RealSound,
};

type PT3Header = {
  header: string;
  title: string;
  author: string;
  module_type: number;
  freq: PT3FreqTable;
  tempo: number;
  song_end: number;
  song_loop: number;
  pattern_table_offset: number;
  sample_offsets: Uint16Array;
  ornament_offsets: Uint16Array;
  positions: Uint8Array;
}

export default class PT3Converter {
  convertPitch(pitch: number) {
    var notenum = pitch % 12;
    var octave = (pitch / 12 | 0) + 1;
    var note: Note = Note.None;

    switch (notenum)
    {
    case 0:  note = Note.C;      break;
    case 1:  note = Note.Csharp; break;
    case 2:  note = Note.D;      break;
    case 3:  note = Note.Dsharp; break;
    case 4:  note = Note.E;      break;
    case 5:  note = Note.F;      break;
    case 6:  note = Note.Fsharp; break;
    case 7:  note = Note.G;      break;
    case 8:  note = Note.Gsharp; break;
    case 9:  note = Note.A;      break;
    case 10: note = Note.Asharp; break;
    case 11: note = Note.B;      break;
    }

    return new NoteData(note, octave);
  }

  parseChannel(buf: Uint8Array, offset: number, prows: PatternRow[]) {
    var eol = false;
    var ignore_rows = 1;
    var b: number;
    var effects: number[] = [];
    var rows: ChannelRow[] = [];
    var row = new ChannelRow();
    var prow = (typeof prows[0] === 'undefined') ? new PatternRow()
                                                 : prows[0];
    var noise_period = -1;

    while ((b = buf[offset++]) != 0) {
      var hi = b >> 4;
      var lo = b & 0b1111;
      switch (hi)
      {
      case 0x0: // $0x - effects
        effects.push(lo);
        break;
      case 0x1:
        if (lo) { // $1x, henv, lenv, smp*2 - change sample, turn on envelope of type x
          row.envelope = lo;
          prow.envelopeValue = (buf[offset++] << 8) + buf[offset++];
          row.instrument = buf[offset++] >> 1;
        } else { // $10, smp*2 - change sample, reset envelope/ornament
          row.envelope = 0xF;
          row.instrument = buf[offset] >> 1;
          offset += 1;
        }
        break;
      case 0x2:
      case 0x3: // $20-3f - noise period, should occur only in channel B
        noise_period = b - 0x20;
        break;
      case 0x4: // $4x - ornament number x
        row.ornament = lo;
        break;
      case 0x5:
      case 0x6:
      case 0x7:
      case 0x8:
      case 0x9:
      case 0xA: // specify note pitch, EOL
        row.noteData = this.convertPitch(b - 0x50);
        eol = true;
        break;
      case 0xB:
        if (lo == 0) { // $b0 - turn off envelope
          row.envelope = 0xF;
        } else if (lo == 1) { // $b1, rows - ignore channel for n rows 
          ignore_rows = buf[offset++];
        } else { // $bx, henv, lenv - same as $1x but without the sample
          row.envelope = lo;
          prow.envelopeValue = (buf[offset++] << 8) + buf[offset++];
        }
        break;
      case 0xC: // $c0 - note release and EOL
        if (lo == 0) {
          row.noteData = new NoteData(Note.Off, 0);
          eol = true;
        } else { // $cx - set volume to x
          row.volume = lo;
        }
        break;
      case 0xD:
      case 0xE:
        if (b == 0xD0) { // EOL
          eol = true;
        } else { // $d1-ef - set sample
          row.instrument = b - 0xD0;
        }
        break;
      case 0xF: // $fx, smp*2 - set ornament x and sample, env off
        row.ornament = lo;
        row.envelope = 0xF;
        row.instrument = buf[offset++] >> 1;
        break;
      }

      if (!eol) {
        continue;
      }

      for (var i = 0; i < effects.length; i++) {
        switch (effects[i])
        {
          case 0x1: { // $01, delay, lsl, hsl - slide up/down
            row.effectParamX = buf[offset++] & 0b1111;
            var increment = new Int16Array(buf.buffer.slice(offset, offset+2))[0];
            row.effect = increment > 0 ? 0x1 : 0x2;
            increment = Math.abs(increment);
            row.effectParamY = (increment >> 4) & 0b1111;
            row.effectParamZ = increment & 0b1111;
            offset += 2;
            break;
          }
          case 0x2: { // $02, delay, lmax, hmax, lsl, hsl - porta
            row.effect = 0x3;
            row.effectParamX = buf[offset++] & 0b1111;
            var increment = new Int16Array(buf.buffer.slice(offset+2, offset+4))[0];
            increment = Math.abs(increment);
            row.effectParamY = (increment >> 4) & 0b1111;
            row.effectParamZ = increment & 0b1111;
            offset += 4;
            break;
          }
          case 0x3: { // $03, offset - sample offset
            row.effect = 0x4;
            const value = buf[offset++] & 0b1111;
            row.effectParamY = (value >> 4) & 0b1111;
            row.effectParamZ = value & 0b1111;
            break;
          }
          case 0x4: { // $04, offset - ornament offset
            row.effect = 0x5;
            const value = buf[offset++] & 0b1111;
            row.effectParamY = (value >> 4) & 0b1111;
            row.effectParamZ = value & 0b1111;
            break;
          }
          case 0x5: { // $05, on time, off time - "vibrato"
            row.effect = 0x6;
            row.effectParamY = buf[offset++] & 0b1111;
            row.effectParamZ = buf[offset++] & 0b1111;
            break;
          }
          case 0x8: { // $08, delay, lsl, hsl - slide envelope
            row.effectParamX = buf[offset++] & 0b1111;
            var increment = new Int16Array(buf.buffer.slice(offset, offset+2))[0];
            row.effect = increment > 0 ? 0x9 : 0xA;
            increment = Math.abs(increment);
            row.effectParamY = (increment >> 4) & 0b1111;
            row.effectParamZ = increment & 0b1111;
            offset += 2;
            break;
          }
          case 0x9: { // $09, tempo
            row.effect = 0xB;
            const value = buf[offset++];
            row.effectParamY = (value >> 4) & 0b1111;
            row.effectParamZ = value & 0b1111;
            break;
          }
        }
      }

      if (noise_period >= 0) prow.noiseValue = noise_period;
      prows[rows.length] = prow;
      rows.push(row);
      for (var i = ignore_rows; i > 1; i--) {
        prow = (typeof prows[rows.length] === 'undefined') ? new PatternRow()
                                                           : prows[rows.length];

        if (noise_period >= 0) prow.noiseValue = noise_period;
        prows[rows.length] = prow;
        rows.push(new ChannelRow());
      }

      eol = false;
      effects = [];
      row = new ChannelRow();
      prow = (typeof prows[rows.length] === 'undefined') ? new PatternRow()
                                                         : prows[rows.length];
    }

    return new Channel(rows);
  }

  padChannel(ch: Channel, len: number) {
    for (var i = ch.channelRows.length; i < len; i++) {
      ch.channelRows.push(new ChannelRow());
    }
  }

  parseBinary(buffer: ArrayBuffer): Module {
    // Realistically, the smallest valid .pt3 module will be at least 203 bytes:
    // - 201 bytes for the mandatory header contents
    // - 2 bytes for the smallest valid position list
    // Since offsets can point to any arbitrary location in the file,
    // the required pattern, channel, ornament contents (which are normally
    // located further in the file) could be encoded in e.g. the title string.
    //
    // Evil, right.
    //
    // An empty .pt3 file exported by Vortex Tracker 2.6 is 216 bytes though.

    if (buffer.byteLength < 203) {
      throw new Error("File does not appear to be a valid .pt3 file");
    }

    const buf = new Uint8Array(buffer);
    const dec = new TextDecoder("ascii");

    var i = 201;
    var pos_max = 0;
    var pos: number | undefined;
    while ((pos = buf[i]) != 0xFF) {
      if (pos === undefined) {
        throw new Error("Failed to parse the pattern list");
      }
      pos_max = Math.max(pos, pos_max);
      i++;
    }
    pos_max = pos_max / 3 | 0;

    var h: PT3Header = {
      header:               dec.decode(buffer.slice(0,  30)).replace(/\s+$/, ''),
      title:                dec.decode(buffer.slice(30, 30+32)).replace(/\s+$/, ''),
      author:               dec.decode(buffer.slice(66, 66+32)).replace(/\s+$/, ''),
      module_type:          buf[98],
      freq:                 buf[99],
      tempo:                buf[100],
      song_end:             buf[101],
      song_loop:            buf[102],
      pattern_table_offset: buf[103] + (buf[104] << 8),
      sample_offsets:       new Uint16Array(buf.slice(105, 105+64)),
      ornament_offsets:     new Uint16Array(buf.slice(169, 169+32)),
      positions:            new Uint8Array(buf.slice(201, i)),
    };

    var patterns: Pattern[] = [];
    var prows: PatternRow[] = [];
    var a, b, c: Channel;
    var offset: number;

    i = h.pattern_table_offset;

    for (var j = 0; j <= pos_max; j++) {
      offset = buf[i++] + (buf[i++] << 8);
      a = this.parseChannel(buf, offset, prows);

      offset = buf[i++] + (buf[i++] << 8);
      b = this.parseChannel(buf, offset, prows)

      offset = buf[i++] + (buf[i++] << 8);
      c = this.parseChannel(buf, offset, prows)

      const maxlen = prows.length;
      this.padChannel(a, maxlen);
      this.padChannel(b, maxlen);
      this.padChannel(c, maxlen);

      patterns.push(new Pattern(j, [a, b, c], prows));
      prows = [];
    }

    var pattern_pos: Pattern[] = [];

    h.positions.forEach(pos => {
      pattern_pos.push(patterns[pos / 3 | 0]);
    });

    return new Module(
      h.title,
      h.author,
      h.tempo,
      pattern_pos);
  }

  toLemonModule(moduleFile: Blob): Promise<Module> {
    return new Promise((resolve, reject) => {
      const buf = moduleFile.arrayBuffer();
      buf.then(
        result => {
          try {
            resolve(this.parseBinary(result));
          } catch (error) {
            reject(error);
          }
        },
        error => reject(error),
      );
    });
  }
}
