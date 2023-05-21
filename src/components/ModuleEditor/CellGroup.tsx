import Cell from "./Cell";
import { useEffect, useState } from "react";

type CellGroupProps = {
  maxLength: number;
  radix: number;
  value: number;
  defaultCellStr: string;
  className?: string;
  allowZero?: boolean;
};

function CellGroup({
  maxLength,
  radix,
  value,
  defaultCellStr,
  className,
  allowZero,
}: CellGroupProps) {
  const [valueWithDefaultPrefix, setValueWithDefaultPrefix] = useState(
    createValueWithDefaultPrefix
  );

  function createValueWithDefaultPrefix() {
    const num = value === 0 ? "" : value.toString(radix).toUpperCase();
    return num.padStart(maxLength, defaultCellStr);
  }

  useEffect(() => {
    setValueWithDefaultPrefix(createValueWithDefaultPrefix());
  }, [value]);

  return (
    <div className={className}>
      {valueWithDefaultPrefix.split("").map((char, i) => (
        <Cell
          defaultDisplayValue={defaultCellStr}
          key={i}
          str={char}
          allowZero={allowZero}
        />
      ))}
    </div>
  );
}

export default CellGroup;
