import React, { useRef } from "react";

import Cell from "./Cell";
import CellGroup from "./CellGroup";
import ChannelRow from "./ChannelRow";
import PatternRow from "../../models/pattern-row";
import { useBoundStore } from "../../stores";
import RowContainer from "./RowContainer";

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
      <RowContainer yPositionInGrid={index}>
        <Cell
          yPositionInGrid={index}
          str={index.toString(16).padStart(2, "0").toUpperCase()}
        />
      </RowContainer>
      <Border/>
      <RowContainer yPositionInGrid={index}>
        <CellGroup
          maxLength={4}
          radix={16}
          value={row.envelopeValue}
          defaultCellStr="."
          allowZero={true}
          yPositionInGrid={index}
          xPositionInGrid={0}
        />
      </RowContainer>
      <Border/>
      <RowContainer yPositionInGrid={index}>
        <CellGroup
          maxLength={2}
          radix={16}
          value={row.noiseValue}
          defaultCellStr="."
          allowZero={true}
          yPositionInGrid={index}
          xPositionInGrid={4}
        />
      </RowContainer>
      <Border/>
      <RowContainer yPositionInGrid={index}>
        <ChannelRow
          row={pattern.channels[0].channelRows[index]}
          yPositionInGrid={index}
          xPositionInGrid={6}
        />
      </RowContainer>
      <Border/>
      <RowContainer yPositionInGrid={index}>
        <ChannelRow
          row={pattern.channels[1].channelRows[index]}
          yPositionInGrid={index}
          xPositionInGrid={15}
        />
      </RowContainer>
      <Border/>
      <RowContainer yPositionInGrid={index}>
        <ChannelRow
          row={pattern.channels[2].channelRows[index]}
          yPositionInGrid={index}
          xPositionInGrid={24}
        />
      </RowContainer>
    </div>
  );
}

function Border() {
  return <span className="border border-slate-900" />;
}

export default EditorRow;
