import React from "react";
import Pattern from "../../models/pattern";
import EditorRow from "./EditorRow";

type PatternEditorProps = {
  currentPattern: Pattern;
};

function PatternEditor({ currentPattern }: PatternEditorProps) {
  return (
    <div className="overflow-y-auto max-w-fit grow select-none mx-auto flex flex-col my-4 bg-slate-800 drop-shadow-md font-mono text-slate-400 text-lg text-center">
      {currentPattern.patternRows.map((row, i) => (
        <EditorRow
          bgEndOfBar={"bg-slate-700"}
          row={row}
          index={i}
          channels={currentPattern.channels}
          key={i}
        />
      ))}
    </div>
  );
}

export default PatternEditor;
