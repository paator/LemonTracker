function Cell({ str, defaultDisplayValue }) {
  function displayValueOrDefault(obj) {
    if (obj === null || obj === undefined || obj === "") {
      return defaultDisplayValue;
    }

    return obj;
  }

  return <span>{displayValueOrDefault(str)}</span>;
}

export default Cell;
