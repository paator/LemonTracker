import classNames from "classnames";

type CellProps = {
  str: string;
  defaultDisplayValue?: string;
  allowZero?: boolean;
  className?: string;
  isSelected?: boolean;
};

function Cell({
  str,
  defaultDisplayValue,
  allowZero,
  className,
  isSelected,
}: CellProps) {
  const isValueOrDefault =
    (defaultDisplayValue && str === "0" && !allowZero) ||
    str === defaultDisplayValue;

  const cellClasses = classNames(
    { "text-slate-500": isValueOrDefault },
    {
      "bg-blue-100 text-black animate-[pulse_1s_ease-in-out_infinite]":
        isSelected,
    },
    className
  );

  const displayValue = isValueOrDefault ? defaultDisplayValue : str;

  return <span className={cellClasses}>{displayValue}</span>;
}

export default Cell;
