import Cell from "./Cell.jsx";
import { useEffect, useState } from "react";

function CellGroup({ id, maxLength, radix, str, defaultCellStr }) {
  let [valueWithDefaultPrefix, setValueWithDefaultPrefix] = useState("");

  useEffect(() => {
    let prefix = "";
    if (str.length < maxLength) {
      prefix = defaultCellStr.repeat(maxLength - str.length);
    }

    setValueWithDefaultPrefix(prefix + str.toString(radix));
  });

  return (
    <div>
      {valueWithDefaultPrefix.split("").map((char) => (
        <Cell defaultDisplayValue={defaultCellStr} id={id} str={char} />
      ))}
    </div>
  );
}

export default CellGroup;
