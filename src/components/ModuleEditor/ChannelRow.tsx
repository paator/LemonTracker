import Cell from "./Cell";
import ChannelRowModel from "../../models/channel-row";

type ChannelRowProps = {
  row: ChannelRowModel;
  className?: string;
};

function ChannelRow({ row, className }: ChannelRowProps) {
  return (
    <div className={className + " flex gap-3 px-2"}>
      <span className="text-blue-100">
        <Cell str={row.noteData.toString()} defaultDisplayValue="---" />
      </span>
      <span className="text-blue-300">
        <Cell
          str={row.instrument.toString(32).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          str={row.envelope.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          str={row.ornament.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          str={row.volume.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
      </span>
      <span className="text-yellow-200">
        <Cell
          str={row.effect.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          str={row.effectParamX.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          str={row.effectParamY.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
        <Cell
          str={row.effectParamZ.toString(16).toUpperCase()}
          defaultDisplayValue="."
        />
      </span>
    </div>
  );
}

export default ChannelRow;
