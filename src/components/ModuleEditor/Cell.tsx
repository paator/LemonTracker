import classNames from "classnames";
import { useBoundStore } from "../../stores";
import classnames from "classnames";

type CellProps = {
  str: string;
  xPositionInGrid?: number | null;
  yPositionInGrid: number;
  defaultDisplayValue?: string;
  allowZero?: boolean;
  className?: string;
};

function Cell({
  str,
  defaultDisplayValue,
  allowZero,
  className,
  xPositionInGrid = null,
  yPositionInGrid,
}: CellProps) {
  const posX = useBoundStore((state) => state.posX);
  const posY = useBoundStore((state) => state.posY);

  const isValueOrDefault =
    (defaultDisplayValue && str === "0" && !allowZero) ||
    str === defaultDisplayValue;

  const cellClasses = classNames(
    {
      "text-blue-300": yPositionInGrid! % 4,
      "text-blue-200": yPositionInGrid % 4 === 0,
      "bg-blue-800": posY === yPositionInGrid,
      "bg-slate-700": yPositionInGrid % 4 === 0 && posY !== yPositionInGrid,
      "text-slate-500": isValueOrDefault,
      "bg-blue-200":
        xPositionInGrid && xPositionInGrid === posX && posY === yPositionInGrid,
    },
    className
  );

  const displayValue = isValueOrDefault ? defaultDisplayValue : str;

  return <span className={cellClasses}>{displayValue}</span>;
}

export default Cell;
