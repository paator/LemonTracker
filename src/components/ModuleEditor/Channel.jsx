function Channel({ channelName, channelRows, index }) {
  const letters = ["A", "B", "C"];
  const letter = letters[index % 3];

  return (
    <div>
      <div className="text-sm text-yellow-200">{channelName + " " + letter}</div>
      {channelRows.map((row) => (
        <div key={row.id}>row.noteData</div>
      ))}
    </div>
  );
}

export default Channel;
