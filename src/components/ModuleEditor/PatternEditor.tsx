import React, { useEffect } from "react";
import Pattern from "../../models/pattern";
import EditorRow from "./EditorRow";
import { useStore } from "../../stores";

type PatternEditorProps = {
  currentPattern: Pattern;
};

function PatternEditor({ currentPattern }: PatternEditorProps) {
  const { incrementX, incrementY, decrementX, decrementY, setPosition } =
    useStore((state) => ({
      incrementX: state.incrementXBy,
      incrementY: state.incrementYBy,
      decrementX: state.decrementXBy,
      decrementY: state.decrementYBy,
      setPosition: state.setPosition,
    }));

  useEffect(() => {
    setPosition(0, 0);
  }, [currentPattern, setPosition]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    switch (e.key) {
      case "ArrowUp":
        decrementY(1);
        break;
      case "ArrowDown":
        incrementY(1);
        break;
      case "ArrowLeft":
        decrementX(1);
        break;
      case "ArrowRight":
        incrementX(1);
        break;
      case "PageUp":
        decrementY(0x10);
        break;
      case "PageDown":
        incrementY(0x10);
        break;
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      decrementY(1);
    } else {
      incrementY(1);
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={1}
      className="overflow-y-hidden h-screen select-none mx-auto my-4 bg-slate-800 drop-shadow-md font-mono text-slate-400 text-lg text-center focus:border-2 focus:border-blue-500 outline-none"
    >
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
