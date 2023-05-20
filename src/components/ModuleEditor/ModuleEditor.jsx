import { useEffect, useState } from "react";
import Channel from "./Channel.jsx";
import Cell from "./Cell.jsx";
import CellGroup from "./CellGroup.jsx";

function ModuleEditor({ currentModule }) {
  const [module, setModule] = useState({ ...currentModule });
  const [currentPattern, setCurrentPattern] = useState(
    currentModule.patterns[0]
  );
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);

  useEffect(() => {
    setModule({ ...currentModule });
    changePattern(0);
  }, [currentModule]);

  function changePattern(index) {
    setCurrentPattern(currentModule.patterns[index]);
    setCurrentPatternIndex(index);
  }

  function changeModuleProp(field) {
    return (e) => {
      setModule({ ...module, [field]: e.target.value });
    };
  }

  return (
    <div className="w-full self-center rounded-xl bg-slate-600 px-4 shadow-slate-900 drop-shadow-md max-w-[1080px]">
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
      <div className="flex overflow-auto text-center font-mono text-xl shadow-slate-900 gap-[2px]">
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
              onClick={() => changePattern(i)}
              className="w-8 flex-shrink-0 cursor-pointer rounded-sm border border-slate-400 bg-slate-500 text-slate-900 hover:bg-slate-400"
            >
              {p.number}
            </div>
          )
        )}
      </div>
      <div
        className="divide-x-2 divide-slate-900 max-w-fit
          [&>div>div:first-child]:py-2
          mx-auto flex my-4 bg-slate-800 drop-shadow-md rounded-xl font-mono text-slate-400 text-lg text-center"
      >
        <div className="[&>*:nth-child(4n+2)]:bg-slate-700 [&>*:nth-child(4n-2)]:text-blue-200">
          <div className="text-sm text-yellow-200 ">.</div>
          {currentPattern.patternRows.map((row, i) => (
            <div className="text-blue-300 px-2" key={i}>
              {i.toString(16).padStart(2, "0").toUpperCase()}
            </div>
          ))}
        </div>
        <div className="[&>*:nth-child(4n+2)]:bg-slate-700">
          <div className="text-sm text-yellow-200">Envelope</div>
          {currentPattern.patternRows.map((row, i) => (
            <CellGroup
              className="px-4"
              key={i}
              maxLength={4}
              radix={16}
              value={row.envelopeValue}
              defaultCellStr="."
            />
          ))}
        </div>
        <div className="[&>*:nth-child(4n+2)]:bg-slate-700">
          <div className="text-sm text-yellow-200">Noise</div>
          {currentPattern.patternRows.map((row, i) => (
            <CellGroup
              className="px-4"
              key={i}
              maxLength={2}
              radix={16}
              value={row.noiseValue}
              defaultCellStr="."
            />
          ))}
        </div>
        {currentPattern.channels.map((ch, i) => (
          <Channel
            key={i}
            channelRows={ch.channelRows}
            channelName={"Channel"}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export default ModuleEditor;
