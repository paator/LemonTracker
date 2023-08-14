import EditorButton from "../components/EditorMenu/EditorButton";
import EditorMenu from "../components/EditorMenu/EditorMenu";
import { useRef, ChangeEvent, useCallback } from "react";
import Module from "../models/module";
import VortexModuleConverter from "../services/vt-converter";
import ModuleEditor from "../components/ModuleEditor/ModuleEditor";
import { useBoundStore } from "../stores";

function EditorPage() {
  const setModule = useBoundStore((state) => state.setModule);

  const fileLoaderInput = useRef<HTMLInputElement>(null);

  const newModule = useCallback(() => {
    setModule(new Module());
    useBoundStore.getState().setPattern(0);
  }, [setModule]);

  const loadModule = useCallback(() => {
    if (fileLoaderInput.current) {
      fileLoaderInput.current.click();
    }
  }, [fileLoaderInput]);

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const converter = new VortexModuleConverter();

    const lemonModule = await converter.convertToLemonModule(
      new Blob([file], { type: file.type })
    );

    setModule(lemonModule);
    useBoundStore.getState().setPattern(0);
  }

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
