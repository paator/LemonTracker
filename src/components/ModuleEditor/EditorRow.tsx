import React, { useRef } from "react";

import Cell from "./Cell";
import CellGroup from "./CellGroup";
import ChannelRow from "./ChannelRow";
import PatternRow from "../../models/pattern-row";
import { useBoundStore } from "../../stores";

type EditorRowProps = {
  row: PatternRow;
  index: number;
  bgEndOfBar?: string;
};

function EditorRow({ row, index }: EditorRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current ? ref.current.offsetHeight : 0;

  const { posY, pattern } = useBoundStore((state) => ({
    posY: state.posY,
    pattern: state.currentPattern,
  }));

  return (
    <div
      ref={ref}
      className="flex relative"
      style={{ top: `calc(${posY * -height}px + 50%)` }}
    >
      <Cell
        str={index.toString(16).padStart(2, "0").toUpperCase()}
        yPositionInGrid={index}
        className="px-2"
      />
      <span className="border border-slate-900" />
      <CellGroup
        maxLength={4}
        radix={16}
        value={row.envelopeValue}
        defaultCellStr="."
        allowZero={true}
        xPositionInGrid={0}
        yPositionInGrid={index}
      />
      <span className="border border-slate-900" />
      <CellGroup
        maxLength={2}
        radix={16}
        value={row.noiseValue}
        defaultCellStr="."
        allowZero={true}
        xPositionInGrid={1}
        yPositionInGrid={index}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        row={pattern.channels[0].channelRows[index]}
        xPositionInGrid={2}
        yPositionInGrid={index}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        row={pattern.channels[1].channelRows[index]}
        xPositionInGrid={3}
        yPositionInGrid={index}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        row={pattern.channels[2].channelRows[index]}
        xPositionInGrid={4}
        yPositionInGrid={index}
      />
    </div>
  );
}

export default EditorRow;
