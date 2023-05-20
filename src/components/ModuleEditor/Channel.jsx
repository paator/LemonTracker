import Cell from "./Cell.jsx";

function Channel({ channelName, channelRows, index }) {
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
            <Cell
              str={row.noteData.toString()}
              defaultDisplayValue="---"
            />
          </div>
          <div className="text-blue-300">
            <Cell
              str={row.instrument.toString()}
              defaultDisplayValue="."
            />
            <Cell
              str={row.envelope.toString()}
              defaultDisplayValue="."
            />
            <Cell
              str={row.ornament.toString()}
              defaultDisplayValue="."
            />
            <Cell
              str={row.volume.toString()}
              defaultDisplayValue="."
            />
          </div>
          <div className="text-yellow-200">
            <Cell
              str={row.effect.toString()}
              defaultDisplayValue="."
            />
            <Cell
              str={row.effectParamX.toString()}
              defaultDisplayValue="."
            />
            <Cell
              str={row.effectParamY.toString()}
              defaultDisplayValue="."
            />
            <Cell
              str={row.effectParamZ.toString()}
              defaultDisplayValue="."
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Channel;
