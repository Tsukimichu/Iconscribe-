import { useRef } from "react";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";

const CustomizationPage = () => {
  const editorRef = useRef();

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-semibold mb-2">Image Customization</h2>
      <Toolbar editorRef={editorRef} />
      <CanvasEditor ref={editorRef} />
    </div>
  );
};

export default CustomizationPage;
