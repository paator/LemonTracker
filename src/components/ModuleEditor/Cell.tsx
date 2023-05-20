type CellProps = {
  str: string;
  defaultDisplayValue: string;
};

function Cell({ str, defaultDisplayValue }: CellProps) {
  return (
    <span className={str === defaultDisplayValue || str === "0" ? "text-slate-500" : ""}>
      {str === "0" ? defaultDisplayValue : str}
    </span>
  );
}

export default Cell;
