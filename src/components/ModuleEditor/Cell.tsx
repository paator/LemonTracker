type CellProps = {
  str: string;
  defaultDisplayValue: string;
  allowZero?: boolean;
};

function Cell({ str, defaultDisplayValue, allowZero}: CellProps) {

  function ValueOrDefault() {
    return (str === "0" && !allowZero) || str === defaultDisplayValue
  }

  return (
    <span className={ValueOrDefault() ? "text-slate-500" : ""}>
      {ValueOrDefault() ? defaultDisplayValue : str}
    </span>
  );
}

export default Cell;
