import Cell from "./Cell.jsx";
import { useEffect, useState } from "react";

function CellGroup({ maxLength, radix, value, defaultCellStr }) {
  const [valueWithDefaultPrefix, setValueWithDefaultPrefix] = useState(createValueWithDefaultPrefix);

  function createValueWithDefaultPrefix() {
    const num = value === 0 ? "" : value.toString(radix).toUpperCase();
    let prefix = "";
    if (num.length < maxLength) {
      prefix = defaultCellStr.repeat(maxLength - num.length);
    }

    return prefix + num;
  }

  useEffect(() => {
    setValueWithDefaultPrefix(createValueWithDefaultPrefix());
  }, [value]);

  return (
    <div>
      {valueWithDefaultPrefix.split("").map((char, i) => (
        <Cell defaultDisplayValue={defaultCellStr} key={i} str={char} />
      ))}
    </div>
  );
}

export default CellGroup;
