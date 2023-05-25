import Cell from "./Cell";
import CellGroup from "./CellGroup";
import ChannelRow from "./ChannelRow";
import PatternRow from "../../models/pattern-row";
import Channel from "../../models/channel";
import {useRef} from "react";

type EditorRowProps = {
  row: PatternRow;
  index: number;
  channels: Channel[];
  bgEndOfBar?: string;
  currentYPosition: number;
  currentXPosition: number;
};

function EditorRow({
  row,
  index,
  channels,
  bgEndOfBar,
  currentYPosition,
  currentXPosition,
}: EditorRowProps) {
  function applyStyle(
    selectedStyle?: string,
    normalStyle?: string,
    endStyle?: string
  ) {
    if (currentYPosition === index) {
      return selectedStyle;
    }
    if (index % 4 === 0) {
      return endStyle + " " + bgEndOfBar;
    }
    return normalStyle;
  }

  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current ? ref.current.offsetHeight : 0;

  return (
    <div ref={ref} className="flex relative" style={{ top: `calc(${currentYPosition * -height}px + 50%)`}}>
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
        isSelected={currentYPosition === index}
        selectedXIndex={currentXPosition}
      />
      <span className="border border-slate-900" />
      <CellGroup
        className={applyStyle("bg-blue-800") + " px-2"}
        maxLength={2}
        radix={16}
        value={row.noiseValue}
        defaultCellStr="."
        allowZero={true}
        isSelected={currentYPosition === index}
        selectedXIndex={currentXPosition}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyle("bg-blue-800")}
        row={channels[0].channelRows[index]}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyle("bg-blue-800")}
        row={channels[1].channelRows[index]}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyle("bg-blue-800")}
        row={channels[2].channelRows[index]}
      />
    </div>
  );
}

export default EditorRow;
