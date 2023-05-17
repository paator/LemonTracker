import Cell from "./Cell.jsx";
import { useEffect, useState } from "react";

function CellGroup({ id, maxLength, radix, str, defaultCellStr }) {
  const [valueWithDefaultPrefix, setValueWithDefaultPrefix] = useState("");

  useEffect(() => {
    let num = Number(str).toString(radix).toUpperCase();
    let prefix = "";
    if (num.length < maxLength) {
      prefix = defaultCellStr.repeat(maxLength - num.length);
    }

    setValueWithDefaultPrefix(prefix + num);
  }, [str]);

  return (
    <div>
      {valueWithDefaultPrefix.split("").map((char) => (
        <Cell defaultDisplayValue={defaultCellStr} key={id} id={id} str={char} />
      ))}
    </div>
  );
}

export default CellGroup;
