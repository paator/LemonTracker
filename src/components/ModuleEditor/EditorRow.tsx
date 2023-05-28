import Cell from "./Cell";
import CellGroup from "./CellGroup";
import ChannelRow from "./ChannelRow";
import PatternRow from "../../models/pattern-row";
import { useRef } from "react";
import { shallow } from "zustand/shallow";
import { useBoundStore } from "../../stores";

type EditorRowProps = {
  row: PatternRow;
  index: number;
  bgEndOfBar?: string;
};

function EditorRow({ row, index, bgEndOfBar }: EditorRowProps) {
  function applyStyle(
    selectedStyle?: string,
    normalStyle?: string,
    endStyle?: string
  ) {
    if (posY === index) {
      return selectedStyle;
    }
    if (index % 4 === 0) {
      return endStyle + " " + bgEndOfBar;
    }
    return normalStyle;
  }

  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current ? ref.current.offsetHeight : 0;

  const { posX, posY, pattern } = useBoundStore(
    (state) => ({
      posX: state.posX,
      posY: state.posY,
      pattern: state.currentPattern,
    }),
    shallow
  );

  return (
    <div
      ref={ref}
      className="flex relative"
      style={{ top: `calc(${posY * -height}px + 50%)` }}
    >
      <Cell
        className={
          applyStyle("bg-blue-800", "text-blue-300", "text-blue-200") + " px-2"
        }
        str={index.toString(16).padStart(2, "0").toUpperCase()}
      />
      <span className="border border-slate-900" />
      <CellGroup
        className={applyStyle("bg-blue-800") + " px-2"}
        maxLength={4}
        radix={16}
        value={row.envelopeValue}
        defaultCellStr="."
        allowZero={true}
        isYSelected={posY === index}
      />
      <span className="border border-slate-900" />
      <CellGroup
        className={applyStyle("bg-blue-800") + " px-2"}
        maxLength={2}
        radix={16}
        value={row.noiseValue}
        defaultCellStr="."
        allowZero={true}
        isYSelected={posY === index}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyle("bg-blue-800")}
        row={pattern.channels[0].channelRows[index]}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyle("bg-blue-800")}
        row={pattern.channels[1].channelRows[index]}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyle("bg-blue-800")}
        row={pattern.channels[2].channelRows[index]}
      />
    </div>
  );
}

export default EditorRow;
