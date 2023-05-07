function Button({ onClick, isDisabled, children }) {
  return (
    <button
      className="shadow-slate-900 drop-shadow-md bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-lg font-mono text-sm"
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

export default Button;
