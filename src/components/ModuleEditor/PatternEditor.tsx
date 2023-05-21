import CellGroup from "./CellGroup";
import Channel from "./Channel";
import React from "react";
import Pattern from "../../models/pattern";

type PatternEditorProps = {
  currentPattern: Pattern;
};

function PatternEditor({ currentPattern }: PatternEditorProps) {
  return (
    <div
      className="divide-x-2 divide-slate-900 max-w-fit
          [&>div>div:first-child]:py-2 select-none
          mx-auto flex my-4 bg-slate-800 drop-shadow-md rounded-xl font-mono text-slate-400 text-lg text-center"
    >
      <div className="[&>*:nth-child(4n+2)]:bg-slate-700 [&>*:nth-child(4n-2)]:text-blue-200">
        <div className="text-sm text-yellow-200 ">.</div>
        {currentPattern.patternRows.map((row, i) => (
          <div className="text-blue-300 px-2" key={i}>
            {i.toString(16).padStart(2, "0").toUpperCase()}
          </div>
        ))}
      </div>
      <div className="[&>*:nth-child(4n+2)]:bg-slate-700">
        <div className="text-sm text-yellow-200">Envelope</div>
        {currentPattern.patternRows.map((row, i) => (
          <CellGroup
            className="px-4"
            key={i}
            maxLength={4}
            radix={16}
            value={row.envelopeValue}
            defaultCellStr="."
            allowZero={true}
          />
        ))}
      </div>
      <div className="[&>*:nth-child(4n+2)]:bg-slate-700">
        <div className="text-sm text-yellow-200">Noise</div>
        {currentPattern.patternRows.map((row, i) => (
          <CellGroup
            className="px-4"
            key={i}
            maxLength={2}
            radix={16}
            value={row.noiseValue}
            defaultCellStr="."
            allowZero={true}
          />
        ))}
      </div>
      {currentPattern.channels.map((ch, i) => (
        <Channel
          key={i}
          channelRows={ch.channelRows}
          channelName={"Channel"}
          index={i}
        />
      ))}
    </div>
  );
}

export default PatternEditor;