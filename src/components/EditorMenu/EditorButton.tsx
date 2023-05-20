import React from "react";

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  children: React.ReactNode;
};

function Button({ onClick, children,  isDisabled, }: ButtonProps) {
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
