import EditorButton from "../components/EditorMenu/EditorButton";
import EditorMenu from "../components/EditorMenu/EditorMenu";
import { useRef, useState, ChangeEvent } from "react";
import Module from "../models/module";
import VortexModuleConverter from "../services/vt-converter";
import ModuleEditor from "../components/ModuleEditor/ModuleEditor";
import file from "../assets/2019MmcMftnqNEStleforears.vt2";

function EditorPage() {
  const fileLoaderInput = useRef<HTMLInputElement>(null);
  const [currentModule, updateCurrentModule] = useState(new Module());

  useState(async () => {
    const loadFile = async () => {
      fetch(file)
        .then((response) => response.blob())
        .then(async (blob) => {
          const converter = new VortexModuleConverter();
          const lemonModule = await converter.convertToLemonModule(blob);

          updateCurrentModule(lemonModule);
        });
    };

    await loadFile();
  });

  function newModule() {
    updateCurrentModule(new Module());
  }

  function loadModule() {
    if (fileLoaderInput.current) {
      fileLoaderInput.current.click();
    }
  }

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const converter = new VortexModuleConverter();

    const lemonModule = await converter.convertToLemonModule(
      new Blob([file], { type: file.type })
    );

    updateCurrentModule(lemonModule);
  }

  return (
    <>
      <div className="flex flex-col gap-4 min-h-0">
        <EditorMenu>
          <EditorButton onClick={newModule}>New Track</EditorButton>
          <EditorButton onClick={loadModule}>Load Module</EditorButton>
        </EditorMenu>
        <ModuleEditor currentModule={currentModule} />
      </div>
      <input
        ref={fileLoaderInput}
        hidden
        type="file"
        accept=".vt2,.pt3"
        onChange={handleFileSelect}
      />
    </>
  );
}

export default EditorPage;
