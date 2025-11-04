import React from "react";
import {
  Image,
  Type,
  Square,
  Circle,
  Upload,
  Trash2,
  Layers,
} from "lucide-react";

export default function LeftSidebar({ editorRef }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-3 space-y-4">
      <h2 className="text-gray-800 font-semibold text-lg px-2">Tools</h2>

      <div className="flex flex-col space-y-2">
        <button
          onClick={() => editorRef.current.addText()}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
        >
          <Type size={18} /> <span>Add Text</span>
        </button>

        <button
          onClick={() => editorRef.current.addRect()}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
        >
          <Square size={18} /> <span>Add Rectangle</span>
        </button>

        <button
          onClick={() => editorRef.current.addCircle()}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
        >
          <Circle size={18} /> <span>Add Circle</span>
        </button>

        <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <Upload size={18} /> <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files[0] && editorRef.current.uploadImage(e.target.files[0])
            }
          />
        </label>

        <button
          onClick={() => editorRef.current.deleteSelected()}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
        >
          <Trash2 size={18} /> <span>Delete</span>
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-gray-800 font-semibold text-sm px-2 mb-2">
          Background
        </h3>
        <input
          type="color"
          className="w-full h-10 cursor-pointer rounded-md border border-gray-300"
          onChange={(e) => editorRef.current.changeColor(e.target.value)}
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-gray-800 font-semibold text-sm px-2 mb-2">
          Layers
        </h3>
        <div className="flex items-center justify-center text-gray-400 py-6">
          <Layers className="w-5 h-5 mr-1" /> No layer panel yet
        </div>
      </div>
    </div>
  );
}
