import React, {useEffect, useMemo} from "react";
import EditorRow from "./EditorRow";
import { useBoundStore } from "../../stores";
import throttle from "lodash.throttle";

function PatternEditor() {
  const {
    incrementX,
    incrementY,
    decrementX,
    decrementY,
    setPosition,
    pattern,
  } = useBoundStore((state) => ({
    incrementX: state.incrementXBy,
    incrementY: state.incrementYBy,
    decrementX: state.decrementXBy,
    decrementY: state.decrementYBy,
    setPosition: state.setPosition,
    pattern: state.currentPattern,
  }));

  useEffect(() => {
    setPosition(0, 0);
  }, [setPosition]);

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

  const onWheelThrottled = useMemo(() => {
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (e.deltaY < 0) {
        decrementY(1);
      } else {
        incrementY(1);
      }
    };

    return throttle(handleWheel, 20);
  }, [decrementY, incrementY]);

  return (
    <div
      onKeyDown={handleKeyDown}
      onWheel={onWheelThrottled}
      tabIndex={1}
      className="overflow-y-hidden h-screen select-none mx-auto my-4 bg-slate-800 drop-shadow-md font-mono text-slate-400 text-lg text-center focus:border-2 focus:border-blue-500 outline-none"
    >
      {pattern.patternRows.map((row, i) => (
        <EditorRow row={row} index={i} key={i} />
      ))}
    </div>
  );
}

export default PatternEditor;
