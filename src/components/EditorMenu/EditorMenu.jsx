function EditorMenu({ children }) {
  return (
    <div className="flex gap-4 bg-zinc-700 drop-shadow-md rounded-lg p-4">
      {children}
    </div>
  );
}

export default EditorMenu;
