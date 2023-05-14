import { useEffect, useState } from "react";
import Channel from "./Channel.jsx";

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
    <div className="px-4 bg-slate-600 self-center w-full rounded-xl shadow-slate-900 drop-shadow-md max-w-[1080px]">
      <div className="flex py-6 gap-4 text-slate-900 font-mono text-sm">
        <div className="grow">
          <span className="text-slate-400">Title:</span>
          <input
            type="text"
            className="px-2 mt-2 block w-full bg-white rounded-md text-sm shadow-sm"
            value={module.title}
            onChange={changeModuleProp("title")}
          />
        </div>
        <div className="grow">
          <span className="text-slate-400">Author:</span>
          <input
            type="text"
            className="px-2 mt-2 block w-full bg-white rounded-md text-sm shadow-sm"
            value={module.author}
            onChange={changeModuleProp("author")}
          />
        </div>
      </div>
      <div className="flex overflow-auto text-center text-xl shadow-slate-900 font-mono gap-[2px]">
        {module.patterns.map((p, i) =>
          currentPatternIndex === i ? (
            <div
              key={i}
              className="flex-shrink-0 w-8 rounded-sm bg-blue-600 cursor-default text-slate-200 border border-blue-400"
            >
              {p.number}
            </div>
          ) : (
            <div
              key={i}
              onClick={() => changePattern(i)}
              className="flex-shrink-0 w-8 hover:bg-slate-400 rounded-sm cursor-pointer bg-slate-500 text-slate-900 border border-slate-400"
            >
              {p.number}
            </div>
          )
        )}
      </div>
      <div className="flex flex-row justify-evenly grid-rows gap-4 mx-auto my-4 bg-slate-700 drop-shadow-md rounded-lg font-mono text-slate-400 text-xl">
        <div>
          <div className="text-sm text-yellow-200">.</div>
          {currentPattern.patternRows.map((row, i) => (
            <div key={row.id}>{i.toString(16).toUpperCase()}</div>
          ))}
        </div>
        <div>
          <div className="text-sm text-yellow-200">Envelope</div>
          {currentPattern.patternRows.map((row) => (
            <div key={row.id}>{row.envelopeValue}</div>
          ))}
        </div>
        <div>
          <div className="text-sm text-yellow-200">Noise</div>
          {currentPattern.patternRows.map((row) => (
            <div key={row.id}>{row.noiseValue}</div>
          ))}
        </div>
        {currentPattern.channels.map((ch, i) => (
          <Channel
            key={ch.id}
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
