import Module from "../models/module";
import Pattern from "../models/pattern";
import toModuleNote from "../models/mappings";
import PatternRow from "../models/pattern-row";
import ChannelRow from "../models/channel-row";

export default class VortexModuleConverter {
  convertToLemonModule(moduleFile) {
    return new Promise((resolve, reject) => {
      let module = new Module();
      const fileReader = new FileReader();

      fileReader.onerror = () => {
        reject(fileReader.error);
      }

      fileReader.onload = (_progressEvent) => {
        const text = fileReader.result;
        const lines = text.split("\r\n");

        function* createGenerator(_fileLines) {
          for (const line of lines) {
            yield line;
          }
        }

        const generator = createGenerator(lines);
        let line;

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

        // initialize with VT2 defaults for compatibility
        const metadata = {
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

        const builder = [];

        while (!(line = generator.next()).done) {
          if (line.value.startsWith("[")) {
            break;
          }

          let isReadingValue = false;
          let key = null;

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
            metadata[key] = builder.join("");
            builder.length = 0;
          }
        }

        //TODO: support all commented values

        //metadata["VortexTrackerII"];
        //metadata["Version"];
        module.title = metadata["Title"];
        module.author = metadata["Author"];
        //metadata["ShowInfo"];
        //metadata["NoteTable"];
        //metadata["ChipFreq"];
        //metadata["IntFreq"];
        module.initSpeed = parseInt(metadata["Speed"]);
        //metadata["Noise"];
        const playOrder = metadata["PlayOrder"];
        //metadata["Colors"]; // not always present in the module

        //ornaments and samples skipped for now

        const whitespaceRegex = /\s+/;

        const patterns = [];
        let i = 0;

        while (!(line = generator.next()).done) {
          if (!line.value) continue;
          if (!line.value.startsWith("[Pattern")) continue;

          const match = line.value.match(/\d+/);
          const patternNumber = parseInt(match[0], 10);

          const pattern = new Pattern(patternNumber);
          patterns.push(pattern);

          while (true) {
            const patternLine = generator.next().value;
            if (!patternLine || patternLine.trim() === "") break;

            const rowValues = patternLine.split("|");
            const patternRow = new PatternRow();

            let envelopeValue = parseInt(rowValues[0].trim("."), 16);
            if (isNaN(envelopeValue)) envelopeValue = 0;
            patternRow.envelopeValue = envelopeValue;

            let noiseValue = parseInt(rowValues[1].trim("."), 16);
            if (isNaN(noiseValue)) noiseValue = 0;
            patternRow.noiseValue = noiseValue;

            patterns[i].patternRows.push(patternRow);

            //Channel A
            let trimmedRowData = rowValues[2].replace(whitespaceRegex, "");
            patterns[i].channels[0].channelRows.push(mapRowData(trimmedRowData));

            //Channel B
            trimmedRowData = rowValues[3].replace(whitespaceRegex, "");
            patterns[i].channels[1].channelRows.push(mapRowData(trimmedRowData));

            //Channel C
            trimmedRowData = rowValues[4].replace(whitespaceRegex, "");
            patterns[i].channels[2].channelRows.push(mapRowData(trimmedRowData));
          }

          i++;
        }

        const patternOrder = playOrder.split(",");
        const patternNumbersOrder = patternOrder
          .map((x) => {
            x = x.replace(/^L+/, '')
            return parseInt(x);
          });

        for (const patternNumber of patternNumbersOrder) {
          const pattern = patterns.find((x) => x.number === patternNumber);
          if (pattern) {
            module.patterns.push(pattern);
          }
        }

        resolve(module);

        function mapRowData(trimmedRowData) {
          const row = new ChannelRow();
          row.noteData = toModuleNote(trimmedRowData.slice(0, 3));
          row.instrument = trimmedRowData[3];
          row.envelope = trimmedRowData[4];
          row.ornament = trimmedRowData[5];
          row.volume = trimmedRowData[6];
          row.effect = trimmedRowData[7];
          row.effectParamX = trimmedRowData[8];
          row.effectParamY = trimmedRowData[9];
          row.effectParamZ = trimmedRowData[10];
          return row;
        }
      };

      fileReader.readAsText(moduleFile);
    })
  }
}
