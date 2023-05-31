import Cell from "./Cell";
import { useCallback, useEffect, useState } from "react";

type CellGroupProps = {
  maxLength: number;
  radix: number;
  value: number;
  defaultCellStr: string;
  allowZero?: boolean;
  yPositionInGrid: number;
  xPositionInGrid: number;
};

function CellGroup({
  maxLength,
  radix,
  value,
  defaultCellStr,
  allowZero,
  yPositionInGrid,
  xPositionInGrid,
}: CellGroupProps) {
  const createValueWithDefaultPrefix = useCallback(() => {
    const num = value === 0 ? "" : value.toString(radix).toUpperCase();
    return num.padStart(maxLength, defaultCellStr);
  }, [value, radix, maxLength, defaultCellStr]);

  const [valueWithDefaultPrefix, setValueWithDefaultPrefix] = useState(
    createValueWithDefaultPrefix
  );

  useEffect(() => {
    setValueWithDefaultPrefix(createValueWithDefaultPrefix());
  }, [value, createValueWithDefaultPrefix]);

  return (
    <>
      {valueWithDefaultPrefix.split("").map((char, i) => (
        <Cell
          yPositionInGrid={yPositionInGrid}
          xPositionInGrid={i + xPositionInGrid}
          defaultDisplayValue={defaultCellStr}
          key={i}
          str={char}
          allowZero={allowZero}
        />
      ))}
    </>
  );
}

export default CellGroup;
