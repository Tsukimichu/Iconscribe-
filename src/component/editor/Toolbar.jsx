import React, { useRef, useState } from "react";
import { useEditor } from "../../context/EditorContext";
import {
  exportCanvasAsPng,
  exportCanvasAsJpg,
  exportCanvasAsSvg,
  exportCanvasAsPdf,
} from "../../utils/exportUtils";
import AspectRatioSelector from "../AspectRatioSelector";
import {
  Type,
  Square,
  Circle,
  Minus,
  Undo2,
  Redo2,
  Upload,
  Image as ImageIcon,
  Download,
} from "lucide-react";

export default function Toolbar() {
  const { addText, addShape, addImage, undo, redo, updateElement, state } =
    useEditor();
  const fileRef = useRef(null);
  const [exportOpen, setExportOpen] = useState(false);
  const selected = state.elements.find((el) => el.id === state.selectedId);

  const onUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    addImage(url);
    e.target.value = null;
  };

  const handleExport = async (type) => {
    const container = document.getElementById("editor-canvas");
    try {
      let dataUrl, fileName;

      switch (type) {
        case "png":
          dataUrl = await exportCanvasAsPng(container);
          fileName = "canvas.png";
          break;
        case "jpg":
          dataUrl = await exportCanvasAsJpg(container);
          fileName = "canvas.jpg";
          break;
        case "svg":
          dataUrl = await exportCanvasAsSvg(container);
          fileName = "canvas.svg";
          break;
        case "pdf":
          dataUrl = await exportCanvasAsPdf(container);
          fileName = "canvas.pdf";
          break;
        default:
          return;
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = fileName;
      a.click();
      setExportOpen(false);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  const addImageFromUrl = () => {
    const url = prompt("Image URL");
    if (url) addImage(url);
  };

  return (
    <div className="flex items-center justify-between w-full px-6 py-3 select-none border-b border-blue-400/40 shadow-lg bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white backdrop-blur-xl relative z-50">
      {/* Left section — aspect ratio + add elements */}
      <div className="flex items-center gap-4">
        {/* Aspect Ratio Selector */}
        <div className="bg-blue-500/30 border border-blue-300/40 rounded-xl px-2 py-1 shadow-inner hover:bg-blue-500/40 transition">
          <AspectRatioSelector />
        </div>

        {/* Add Elements */}
        <div className="flex items-center gap-2 border-l border-white/30 pl-4">
          <button
            onClick={() => addText()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow-[0_0_8px_rgba(96,165,250,0.8)] transition"
            title="Add Text"
          >
            <Type className="w-4 h-4" /> Text
          </button>

          {[
            { type: "rectangle", icon: <Square className="w-4 h-4" /> },
            { type: "circle", icon: <Circle className="w-4 h-4" /> },
            { type: "line", icon: <Minus className="w-4 h-4" /> },
          ].map((shape) => (
            <button
              key={shape.type}
              onClick={() => addShape(shape.type)}
              className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow-[0_0_6px_rgba(96,165,250,0.8)] transition"
              title={shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}
            >
              {shape.icon}
            </button>
          ))}
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-2 border-l border-white/30 pl-4">
          <input
            ref={fileRef}
            onChange={onUpload}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500 border border-blue-300/30 hover:bg-yellow-400 hover:shadow-[0_0_8px_rgba(96,165,250,0.8)] transition"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
          <button
            onClick={addImageFromUrl}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow-[0_0_8px_rgba(96,165,250,0.8)] transition"
          >
            <ImageIcon className="w-4 h-4" /> From URL
          </button>
        </div>
      </div>

      {/* Middle section — undo/redo */}
      <div className="flex items-center gap-2 border-x border-white/30 px-4">
        <button
          onClick={undo}
          className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow-[0_0_6px_rgba(96,165,250,0.8)] transition"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow-[0_0_6px_rgba(96,165,250,0.8)] transition"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right section — export */}
      <div className="relative">
        <button
          onClick={() => setExportOpen(!exportOpen)}
          className="flex items-center gap-1 bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-[0_0_8px_rgba(96,165,250,0.6)] transition"
        >
          <Download className="w-4 h-4" /> Export
        </button>

        {exportOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {["png", "jpg", "svg", "pdf"].map((type) => (
              <button
                key={type}
                onClick={() => handleExport(type)}
                className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-blue-800 capitalize transition"
              >
                Export as {type.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
