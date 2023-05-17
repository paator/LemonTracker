function Cell({ str, defaultDisplayValue }) {
  function displayValueOrDefault(obj) {
    if (obj === null || obj === undefined || obj === "") {
      return defaultDisplayValue;
    }

    return obj;
  }

  return <span className={str === defaultDisplayValue ? "text-slate-500" : ""}>{displayValueOrDefault(str)}</span>;
}

export default Cell;
