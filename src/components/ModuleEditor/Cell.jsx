function Cell({ str, defaultDisplayValue, id }) {
  function displayValueOrDefault(obj) {
    if (obj === null) {
      return defaultDisplayValue;
    }

    return obj;
  }

  return <span key={id}>{displayValueOrDefault(str)}</span>;
}

export default Cell;
