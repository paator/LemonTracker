import Module from "../models/module.js";
import Pattern from "../models/pattern.js";
import toModuleNote from "../models/mappings.js";
import PatternRow from "../models/pattern-row.js";
import ChannelRow from "../models/channel-row.js";

type VortexMetaData = {
  VortexTrackerII: string;
  Version: string;
  Title: string;
  Author: string;
  ShowInfo: string;
  NoteTable: string;
  ChipFreq: string;
  IntFreq: string;
  Speed: string;
  Noise: string;
  PlayOrder: string;
};

export default class VortexModuleConverter {
  convertToLemonModule(moduleFile: Blob): Promise<Module> {
    return new Promise((resolve, reject) => {
      const module = new Module("", "", 3, []);
      const fileReader = new FileReader();

      fileReader.onerror = () => {
        reject(fileReader.error);
      };

      fileReader.onload = (_progressEvent) => {
        const text = fileReader.result as string;

        const lines = text.split("\r\n");

        const generator = this.createGenerator(lines);
        const metadata = this.parseMetadata(generator);
        this.setMetadataValues(metadata, module);

        const patterns = this.extractPatterns(generator);
        const patternOrder = metadata["PlayOrder"].split(",");
        const patternNumbersOrder = this.getPatternNumbersOrder(patternOrder);
        this.addPatternsToModule(patterns, patternNumbersOrder, module);

        resolve(module);
      };

      fileReader.readAsText(moduleFile);
    });
  }

  createGenerator(lines: string[]): Generator<string, void, string> {
    return (function* generator(fileLines) {
      for (const line of fileLines) {
        yield line;
      }
    })(lines);
  }

  parseMetadata(generator: Generator<string, void, string>) {
    let line: IteratorResult<string, void>;

    let metadata: VortexMetaData = {
      VortexTrackerII: "1",
      Version: "3.7",
      Title: "",
      Author: "",
      ShowInfo: "0",
      NoteTable: "2",
      ChipFreq: "1750000",
      IntFreq: "48828",
      Speed: "3",
      Noise: "HEX",
      PlayOrder: "L0",
    };

    while (!(line = generator.next()).done) {
      if (line.value.startsWith("[Module]")) {
        break;
      }
    }

    if (line.value === undefined) {
      throw new Error(
        "Could not find the module metadata section in .vt2 file."
      );
    }

    const builder: string[] = [];
    while (!(line = generator.next()).done) {
      if (line.value.startsWith("[")) {
        break;
      }

      let isReadingValue = false;
      let key: string | null = null;

      for (const c of line.value) {
        if (!isReadingValue && c === "=") {
          isReadingValue = true;
          key = builder.join("");
          builder.length = 0;
        } else {
          builder.push(c);
        }
      }

      if (key != null) {
        metadata[key as keyof typeof metadata] = builder.join("");
        builder.length = 0;
      }
    }

    return metadata;
  }

  setMetadataValues(metadata: VortexMetaData, module: Module) {
    module.title = metadata["Title"];
    module.author = metadata["Author"];
    module.initSpeed = parseInt(metadata["Speed"]);
  }

  extractPatterns(generator: Generator<string, void, string>) {
    const patterns: Pattern[] = [];
    let line: IteratorResult<string, void>;
    let i = 0;

    while (!(line = generator.next()).done) {
      if (!line.value) continue;
      if (!line.value.startsWith("[Pattern")) continue;

      const match = line.value.match(/\d+/);
      let patternNumber = 0;

      if (match) {
        patternNumber = parseInt(match[0], 10);
      }

      const pattern = new Pattern(patternNumber);
      patterns.push(pattern);

      while (true) {
        const patternLine = generator.next().value;
        if (!patternLine || patternLine.trim() === "") break;

        const rowValues = patternLine.split("|");
        const patternRow = this.createPatternRow(rowValues);
        patterns[i].patternRows.push(patternRow);

        // Channel A
        let trimmedRowData = rowValues[2].replace(/\s+/, "");
        patterns[i].channels[0].channelRows.push(
          this.mapRowData(trimmedRowData)
        );

        // Channel B
        trimmedRowData = rowValues[3].replace(/\s+/, "");
        patterns[i].channels[1].channelRows.push(
          this.mapRowData(trimmedRowData)
        );

        // Channel C
        trimmedRowData = rowValues[4].replace(/\s+/, "");
        patterns[i].channels[2].channelRows.push(
          this.mapRowData(trimmedRowData)
        );
      }

      i++;
    }

    return patterns;
  }

  createPatternRow(rowValues: string[]) {
    const patternRow = new PatternRow();

    let envelopeValue = parseInt(rowValues[0].replace(/\./g, ""), 16);
    if (isNaN(envelopeValue)) envelopeValue = 0;
    patternRow.envelopeValue = envelopeValue;

    let noiseValue = parseInt(rowValues[1].replace(/\./g, ""), 16);
    if (isNaN(noiseValue)) noiseValue = 0;
    patternRow.noiseValue = noiseValue;

    return patternRow;
  }

  mapRowData(trimmedRowData: string) {
    const row = new ChannelRow();
    row.noteData = toModuleNote(trimmedRowData.slice(0, 3));
    row.instrument = parseInt(trimmedRowData[3], 32) || 0;
    row.envelope = parseInt(trimmedRowData[4], 16) || 0;
    row.ornament = parseInt(trimmedRowData[5], 16) || 0;
    row.volume = parseInt(trimmedRowData[6], 16) || 0;
    row.effect = parseInt(trimmedRowData[8], 16) || 0;
    row.effectParamX = parseInt(trimmedRowData[9], 16) || 0;
    row.effectParamY = parseInt(trimmedRowData[10], 16) || 0;
    row.effectParamZ = parseInt(trimmedRowData[11], 16) || 0;
    return row;
  }

  getPatternNumbersOrder(patternOrder: string[]) {
    return patternOrder.map((x) => {
      x = x.replace(/^L+/, "");
      return parseInt(x);
    });
  }

  addPatternsToModule(patterns: Pattern[], patternNumbersOrder: number[], module: Module) {
    for (const patternNumber of patternNumbersOrder) {
      const pattern = patterns.find((x) => x.number === patternNumber);
      if (pattern) {
        module.patterns.push(pattern);
      }
    }
  }
}
