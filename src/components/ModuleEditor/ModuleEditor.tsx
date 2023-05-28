import PatternEditor from "./PatternEditor";
import { useBoundStore } from "../../stores";
import React from "react";

function ModuleEditor() {
  const { module, setModule, setPattern, currentPatternIndex, setPosition } =
    useBoundStore((state) => ({
      module: state.module,
      setModule: state.setModule,
      setPattern: state.setPattern,
      setPosition: state.setPosition,
      currentPatternIndex: state.currentPatternIndex,
    }));

  function switchPattern(index: number) {
    setPattern(index);
    setPosition(0, 0);
  }

  function changeModuleProp(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setModule({ ...module, [field]: e.target.value });
    };
  }

  return (
    <div className="w-full min-h-0 self-center rounded-xl bg-slate-600 px-4 shadow-slate-900 drop-shadow-md max-w-[1080px] flex flex-col">
      <div className="flex gap-4 py-6 font-mono text-sm text-slate-900">
        <div className="grow">
          <span className="text-slate-400">Title:</span>
          <input
            type="text"
            className="mt-2 block w-full rounded-md bg-white px-2 text-sm shadow-sm"
            value={module.title}
            onChange={changeModuleProp("title")}
          />
        </div>
        <div className="grow">
          <span className="text-slate-400">Author:</span>
          <input
            type="text"
            className="mt-2 block w-full rounded-md bg-white px-2 text-sm shadow-sm"
            value={module.author}
            onChange={changeModuleProp("author")}
          />
        </div>
      </div>
      <div className="flex flex-shrink-0 overflow-auto text-center font-mono text-xl shadow-slate-900 gap-[2px] select-none">
        {module.patterns.map((p, i) =>
          currentPatternIndex === i ? (
            <div
              key={i}
              className="w-8 flex-shrink-0 cursor-default rounded-sm border border-blue-400 bg-blue-600 text-slate-200"
            >
              {p.number}
            </div>
          ) : (
            <div
              key={i}
              onClick={() => switchPattern(i)}
              className="w-8 flex-shrink-0 cursor-pointer rounded-sm border border-slate-400 bg-slate-500 text-slate-900 hover:bg-slate-400"
            >
              {p.number}
            </div>
          )
        )}
      </div>
      <PatternEditor />
    </div>
  );
}

export default ModuleEditor;
