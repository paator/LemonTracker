import Cell from "./Cell";
import ChannelRowModel from "../../models/channel-row";

type ChannelRowProps = {
  row: ChannelRowModel;
  className?: string;
  xPositionInGrid: number;
  yPositionInGrid: number;
};

function ChannelRow({
  row,
  className,
  xPositionInGrid,
  yPositionInGrid,
}: ChannelRowProps) {
  return (
    <div className={className + " flex"}>
      <span className="text-blue-100">
        <Cell
          str={row.noteData.toString()}
          defaultDisplayValue="---"
          xPositionInGrid={xPositionInGrid * 9}
          yPositionInGrid={yPositionInGrid}
        />
      </span>
      <span className="text-blue-300">
        <Cell
          str={row.instrument.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 1}
          yPositionInGrid={yPositionInGrid}
        />
        <Cell
          str={row.envelope.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 2}
          yPositionInGrid={yPositionInGrid}
        />
        <Cell
          str={row.ornament.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 3}
          yPositionInGrid={yPositionInGrid}
        />
        <Cell
          str={row.volume.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 4}
          yPositionInGrid={yPositionInGrid}
        />
      </span>
      <span className="text-yellow-200">
        <Cell
          str={row.effect.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 5}
          yPositionInGrid={yPositionInGrid}
        />
        <Cell
          str={row.effectParamX.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 6}
          yPositionInGrid={yPositionInGrid}
        />
        <Cell
          str={row.effectParamY.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 7}
          yPositionInGrid={yPositionInGrid}
        />
        <Cell
          str={row.effectParamZ.toString(16).toUpperCase()}
          defaultDisplayValue="."
          xPositionInGrid={xPositionInGrid * 9 + 8}
          yPositionInGrid={yPositionInGrid}
        />
      </span>
    </div>
  );
}

export default ChannelRow;
