import Cell from "./Cell.jsx";

function Channel({ channelName, channelRows, index }) {
  const letters = ["A", "B", "C"];
  const letter = letters[index % 3];

  return (
    <div>
      <div className="text-sm text-yellow-200">
        {channelName + " " + letter}
      </div>
      {channelRows.map((row) => (
        <div className="flex gap-4">
          <Cell
            str={row.noteData.toString()}
            defaultDisplayValue="---"
            key={row.noteData.id}
            id={row.noteData.id}
          />
          <div>
            <Cell
              str={row.instrument.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
            <Cell
              str={row.envelope.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
            <Cell
              str={row.ornament.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
            <Cell
              str={row.volume.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
          </div>
          <div>
            <Cell
              str={row.effect.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
            <Cell
              str={row.effectParamX.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
            <Cell
              str={row.effectParamY.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
            <Cell
              str={row.effectParamZ.toString()}
              defaultDisplayValue="."
              key={row.noteData.id}
              id={row.noteData.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Channel;
