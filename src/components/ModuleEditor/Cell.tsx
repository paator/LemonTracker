type CellProps = {
  str: string;
  defaultDisplayValue?: string;
  allowZero?: boolean;
  className?: string;
};

function Cell({ str, defaultDisplayValue, allowZero, className }: CellProps) {
  function ValueOrDefault() {
    return (
      (defaultDisplayValue && str === "0" && !allowZero) ||
      str === defaultDisplayValue
    );
  }

  return (
    <span className={(ValueOrDefault() ? "text-slate-500 " : "") + className}>
      {ValueOrDefault() ? defaultDisplayValue : str}
    </span>
  );
}

export default Cell;
