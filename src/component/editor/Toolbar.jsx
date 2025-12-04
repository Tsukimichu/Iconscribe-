import React, { useRef, useState } from "react";
import { useEditor } from "../../context/EditorContext";
import {
  exportCanvasAsPng,
  exportCanvasAsJpg,
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

import { useToast } from "../ui/ToastProvider.jsx";

export default function Toolbar({ onElementsClick, onSave }) {
  const { addText, addShape, addImage, undo, redo } = useEditor();
  const { showToast } = useToast();

  const fileRef = useRef(null);

  const [exportOpen, setExportOpen] = useState(false);

  const onUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    addImage(url);
    e.target.value = null;
  };

  const handleExport = async (type) => {
    const container = document.getElementById("canvas-area");
    if (!container) {
      alert("Canvas not found.");
      return;
    }

    try {
      if (type === "png") {
        const dataUrl = await exportCanvasAsPng(container);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "canvas.png";
        a.click();
      } else if (type === "jpg") {
        const dataUrl = await exportCanvasAsJpg(container);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "canvas.jpg";
        a.click();
      } else if (type === "pdf") {
        await exportCanvasAsPdf(container, "canvas.pdf");
      }

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
    <div
      className="
        flex flex-wrap items-center justify-between gap-2
        w-full max-w-[1400px] mx-auto
        px-4 sm:px-6 py-3 select-none
        border-b border-blue-400/40 shadow-lg
        bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600
        text-white backdrop-blur-xl relative z-[999] rounded-4xl
      "
    >

      {/* LEFT SECTION */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1 min-w-[250px] flex-shrink-0">

        <div className="bg-blue-500/30 border border-blue-300/40 rounded-xl px-2 py-1 shadow-inner hover:bg-blue-500/40 transition">
          <AspectRatioSelector />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-l border-white/30 pl-3 sm:pl-4">
          <button
            onClick={() => addText()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition text-sm sm:text-base"
          >
            <Type className="w-4 h-4" /> Text
          </button>

          {[{ type: "rectangle", icon: <Square className="w-4 h-4" /> },
          { type: "circle", icon: <Circle className="w-4 h-4" /> },
          { type: "line", icon: <Minus className="w-4 h-4" /> }].map((shape) => (
            <button
              key={shape.type}
              onClick={() => addShape(shape.type)}
              className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition"
            >
              {shape.icon}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-l border-white/30 pl-3 sm:pl-4">
          <input
            ref={fileRef}
            onChange={onUpload}
            type="file"
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileRef.current.click()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500 border border-blue-300/30 hover:bg-yellow-400 hover:shadow transition text-sm sm:text-base"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>

          <button
            onClick={addImageFromUrl}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition text-sm sm:text-base"
          >
            <ImageIcon className="w-4 h-4" /> From URL
          </button>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="flex items-center gap-2 px-2 sm:px-4 border-t sm:border-none border-white/30 w-full sm:w-auto pt-2 sm:pt-0 justify-start sm:justify-center flex-shrink-0">
        <button
          onClick={undo}
          className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative mt-2 sm:mt-0 flex-shrink-0">
        <div className="flex items-center gap-2">

          {/* My Designs Button */}
          <button
            onClick={() => window.location.href = "/my-designs"}
            className="flex items-center gap-1 bg-purple-500 px-4 py-1.5 rounded-lg shadow-md hover:bg-purple-600 transition text-sm sm:text-base"
          >
            My Designs
          </button>

          {/* SAVE */}
          <button
            onClick={onSave}
            className="flex items-center gap-1 bg-green-500 px-4 py-1.5 rounded-lg shadow-md hover:bg-green-600 transition text-sm sm:text-base"
          >
            Save
          </button>

          {/* EXPORT */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-1 bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-50 hover:shadow transition text-sm sm:text-base"
            >
              <Download className="w-4 h-4" /> Export
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-blue-200 rounded-xl shadow-xl z-[900] overflow-hidden">
                {["png", "jpg", "pdf"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleExport(type)}
                    className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition capitalize"
                  >
                    Export as {type.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
