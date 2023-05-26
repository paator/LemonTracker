import Cell from "./Cell";
import { useCallback, useEffect, useState } from "react";

type CellGroupProps = {
  maxLength: number;
  radix: number;
  value: number;
  defaultCellStr: string;
  className?: string;
  allowZero?: boolean;
  isSelected?: boolean;
  selectedXIndex?: number;
};

function CellGroup({
  maxLength,
  radix,
  value,
  defaultCellStr,
  className,
  allowZero,
  isSelected,
  selectedXIndex = 0,
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
    <div className={className}>
      {valueWithDefaultPrefix.split("").map((char, i) => (
        <Cell
          defaultDisplayValue={defaultCellStr}
          key={i}
          str={char}
          allowZero={allowZero}
          isSelected={selectedXIndex === i && isSelected}
        />
      ))}
    </div>
  );
}

export default CellGroup;
