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
        <>
          <Cell defaultDisplayValue="---" key={row.noteData.id} id={row.noteData.id}>
            {row.noteData.toString()}
          </Cell>
          <Cell defaultDisplayValue="." key={row.id}>

          </Cell>
        </>
      ))}
    </div>
  );
}

export default Channel;
