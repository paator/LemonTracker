function Cell({ str, defaultDisplayValue, id }) {
  function displayValueOrDefault(obj) {
    if (obj === null || obj === undefined || obj === "") {
      return defaultDisplayValue;
    }

    return obj;
  }

  return <span key={id}>{displayValueOrDefault(str)}</span>;
}

export default Cell;
