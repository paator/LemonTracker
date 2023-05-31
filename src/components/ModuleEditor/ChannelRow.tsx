import Cell from "./Cell";
import ChannelRowModel from "../../models/channel-row";
import classNames from "classnames";

type ChannelRowProps = {
  row: ChannelRowModel;
  className?: string;
  yPositionInGrid: number;
  xPositionInGrid: number;
};

function ChannelRow({
  row,
  className,
  yPositionInGrid,
  xPositionInGrid,
}: ChannelRowProps) {
  return (
    <div className={classNames(className, "flex", "gap-2")}>
      <span className="text-blue-100">
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid}
          str={row.noteData.toString()}
          defaultDisplayValue="---"
        />
      </span>
      <span className="text-blue-300">
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 1}
          str={row.instrument.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 2}
          str={row.envelope.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 3}
          str={row.ornament.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 4}
          str={row.volume.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
      </span>
      <span className="text-yellow-200">
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 5}
          str={row.effect.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 6}
          str={row.effectParamX.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 7}
          str={row.effectParamY.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={xPositionInGrid + 8}
          str={row.effectParamZ.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
      </span>
    </div>
  );
}

export default ChannelRow;
