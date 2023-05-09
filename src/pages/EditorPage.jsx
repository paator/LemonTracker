import EditorButton from "../components/EditorMenu/EditorButton";
import EditorMenu from "../components/EditorMenu/EditorMenu";
import { useRef } from "react";
import VortexModuleConverter from "../services/vt-converter";

function EditorPage() {
  const fileLoaderInput = useRef(null);

  function loadModule() {
    fileLoaderInput.current.click();
  }

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    const converter = new VortexModuleConverter();

    const lemonModule = await converter.convertToLemonModule(new Blob([file], {type: file.type}));
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
