import React from "react";
import {
  Undo,
  Redo,
  Download,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
} from "lucide-react";

export default function TopToolbar({ editorRef }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <div className="font-semibold text-gray-700 text-lg">ICONScribe Editor</div>

      <div className="flex items-center gap-2">
        <button onClick={() => editorRef.current.undo()} className="p-2 hover:bg-gray-100 rounded-md">
          <Undo />
        </button>
        <button onClick={() => editorRef.current.redo()} className="p-2 hover:bg-gray-100 rounded-md">
          <Redo />
        </button>
        <button onClick={() => editorRef.current.exportPNG()} className="p-2 hover:bg-gray-100 rounded-md">
          <Download />
        </button>
        <button onClick={() => editorRef.current.zoomIn()} className="p-2 hover:bg-gray-100 rounded-md">
          <ZoomIn />
        </button>
        <button onClick={() => editorRef.current.zoomOut()} className="p-2 hover:bg-gray-100 rounded-md">
          <ZoomOut />
        </button>
        <button onClick={() => editorRef.current.resetZoom()} className="p-2 hover:bg-gray-100 rounded-md">
          <RefreshCcw />
        </button>
      </div>
    </div>
  );
}
