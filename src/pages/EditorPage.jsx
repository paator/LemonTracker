import EditorButton from "../components/EditorMenu/EditorButton";
import EditorMenu from "../components/EditorMenu/EditorMenu";
import { useRef } from "react";
import VortexModuleConverter from "../services/vt-converter";

function EditorPage() {
  const fileLoaderInput = useRef(null);

  function loadModule() {
    fileLoaderInput.current.click();
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    const converter = new VortexModuleConverter();

    const lemonModule = converter.convertToLemonModule(file);

    console.log(lemonModule.title);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <EditorMenu>
          <EditorButton>New Track</EditorButton>
          <EditorButton onClick={loadModule}>Load Module</EditorButton>
        </EditorMenu>
        <div>ModuleEditor</div>
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
