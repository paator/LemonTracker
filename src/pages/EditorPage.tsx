import EditorButton from "../components/EditorMenu/EditorButton";
import EditorMenu from "../components/EditorMenu/EditorMenu";
import { useRef, ChangeEvent } from "react";
import Module from "../models/module";
import VortexModuleConverter from "../services/vt-converter";
import ModuleEditor from "../components/ModuleEditor/ModuleEditor";
import { useBoundStore } from "../stores";
import classNames from "classnames";

function EditorPage() {
  const { setModule, setPattern } = useBoundStore((state) => ({
    setModule: state.setModule,
    setPattern: state.setPattern,
  }));

  const fileLoaderInput = useRef<HTMLInputElement>(null);

  function newModule() {
    setModule(new Module());
    setPattern(0);
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

    setModule(lemonModule);
    setPattern(0);
  }

  const classes = classNames({});

  return (
    <>
      <div className="flex flex-col gap-4 min-h-0">
        <EditorMenu>
          <EditorButton onClick={newModule}>New Track</EditorButton>
          <EditorButton onClick={loadModule}>Load Module</EditorButton>
        </EditorMenu>
        <ModuleEditor />
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
