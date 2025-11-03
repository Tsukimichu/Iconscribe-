import UploadButton from "./UploadButton";

const Button = ({ children, onClick, variant = "default" }) => {
  const baseStyle =
    "px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md";
  const variants = {
    default:
      "bg-blue-600 hover:bg-blue-700 text-white",
    destructive:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const Toolbar = ({ editorRef }) => {
  return (
    <div className="flex gap-3 flex-wrap justify-center mb-4">
      <Button onClick={() => editorRef.current.addText()}>Add Text</Button>
      <Button onClick={() => editorRef.current.addShape()}>Add Shape</Button>
      <UploadButton onUpload={(url) => editorRef.current.addImage(url)} />
      <Button
        variant="destructive"
        onClick={() => editorRef.current.deleteActive()}
      >
        Delete
      </Button>
    </div>
  );
};

export default Toolbar;
