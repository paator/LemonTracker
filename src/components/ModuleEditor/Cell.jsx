function Cell({ str, defaultDisplayValue }) {
  return <span className={str === defaultDisplayValue ? "text-slate-500" : ""}>{str}</span>;
}

export default Cell;
