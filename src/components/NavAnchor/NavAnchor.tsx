import React from "react";

type NavAnchorProps = {
  href: string,
  onClick: React.MouseEventHandler<HTMLAnchorElement>,
  children: React.ReactNode
}

function NavAnchor({ href, onClick, children } : NavAnchorProps) {
  return (
    <a
      href={href}
      className="shadow-slate-900 drop-shadow-md bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default NavAnchor;
