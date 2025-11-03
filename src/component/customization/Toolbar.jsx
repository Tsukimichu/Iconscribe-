import { Button } from "@/components/ui/button";
import UploadButton from "./UploadButton";

const Toolbar = ({ editorRef }) => {
  return (
    <div className="flex gap-3 flex-wrap justify-center mb-4">
      <Button onClick={() => editorRef.current.addText()}>Add Text</Button>
      <Button onClick={() => editorRef.current.addShape()}>Add Shape</Button>
      <UploadButton onUpload={(url) => editorRef.current.addImage(url)} />
      <Button variant="destructive" onClick={() => editorRef.current.deleteActive()}>
        Delete
      </Button>
    </div>
  );
};

export default Toolbar;
