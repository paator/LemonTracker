import Cell from "./Cell";
import ChannelRow from "../../models/channel-row";

type ChannelProps = {
  channelName: string;
  channelRows: Array<ChannelRow>;
  index: number;
};

function Channel({ channelName, channelRows, index }: ChannelProps) {
  const letters = ["A", "B", "C"];
  const letter = letters[index % 3];

  return (
    <div className="[&>*:nth-child(4n-2)]:bg-slate-700">
      <div className="text-sm text-yellow-200">
        {channelName + " " + letter}
      </div>
      {channelRows.map((row, i) => (
        <div key={i} className="flex justify-evenly gap-4 px-2">
          <div className="text-blue-100">
            <Cell str={row.noteData.toString()} defaultDisplayValue="---" />
          </div>
          <div className="text-blue-300">
            <Cell str={row.instrument.toString(16).toUpperCase()} defaultDisplayValue="." />
            <Cell str={row.envelope.toString(16).toUpperCase()} defaultDisplayValue="." />
            <Cell str={row.ornament.toString(16).toUpperCase()} defaultDisplayValue="." />
            <Cell str={row.volume.toString(16).toUpperCase()} defaultDisplayValue="." />
          </div>
          <div className="text-yellow-200">
            <Cell str={row.effect.toString(16).toUpperCase()} defaultDisplayValue="." />
            <Cell str={row.effectParamX.toString(16).toUpperCase()} defaultDisplayValue="." />
            <Cell str={row.effectParamY.toString(16).toUpperCase()} defaultDisplayValue="." />
            <Cell str={row.effectParamZ.toString(16).toUpperCase()} defaultDisplayValue="." />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Channel;
