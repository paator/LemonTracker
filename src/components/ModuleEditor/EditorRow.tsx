import Cell from "./Cell";
import CellGroup from "./CellGroup";
import ChannelRow from "./ChannelRow";
import PatternRow from "../../models/pattern-row";
import Channel from "../../models/channel";

type EditorRowProps = {
  row: PatternRow;
  index: number;
  channels: Channel[];
  bgEndOfBar?: string;
};

function EditorRow({ row, index, channels, bgEndOfBar }: EditorRowProps) {
  function applyStyleWhenEndOfBar(normalStyle?: string, endStyle?: string) {
    if (index % 4 === 0) {
      return endStyle + " " + bgEndOfBar;
    } else {
      return normalStyle;
    }
  }

  return (
    <div className="flex relative" style={{ top: `${0}px` }}>
      <Cell
        className={
          applyStyleWhenEndOfBar("text-blue-300", "text-blue-200") + " px-2"
        }
        str={index.toString(16).padStart(2, "0").toUpperCase()}
      />
      <span className="border border-slate-900" />
      <CellGroup
        className={applyStyleWhenEndOfBar() + " px-2"}
        maxLength={4}
        radix={16}
        value={row.envelopeValue}
        defaultCellStr="."
        allowZero={true}
      />
      <span className="border border-slate-900" />
      <CellGroup
        className={applyStyleWhenEndOfBar() + " px-2"}
        maxLength={2}
        radix={16}
        value={row.noiseValue}
        defaultCellStr="."
        allowZero={true}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyleWhenEndOfBar()}
        row={channels[0].channelRows[index]}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyleWhenEndOfBar()}
        row={channels[1].channelRows[index]}
      />
      <span className="border border-slate-900" />
      <ChannelRow
        className={applyStyleWhenEndOfBar()}
        row={channels[2].channelRows[index]}
      />
    </div>
  );
}

export default EditorRow;
