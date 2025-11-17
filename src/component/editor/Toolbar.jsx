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
  Shapes,
  Palette,
  Star,
  Triangle,
} from "lucide-react";

export default function Toolbar() {
  const { addText, addShape, addImage, undo, redo } = useEditor();

  const fileRef = useRef(null);
  const elementFileRef = useRef(null);

  const [exportOpen, setExportOpen] = useState(false);
  const [elementsOpen, setElementsOpen] = useState(false);

  // --- Upload image ---
  const onUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    addImage(url);
    e.target.value = null;
  };

  // --- Upload custom element (SVG/PNG) ---
  const onUploadElement = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    addImage(url); // treat custom element as image
    e.target.value = null;
    setElementsOpen(false);
  };

  // --- Export Handler ---
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
    <div className="flex flex-wrap items-center justify-between w-full px-4 sm:px-6 py-3 select-none border-b border-blue-400/40 shadow-lg bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white backdrop-blur-xl relative z-50 rounded-4xl">

      {/* Left section */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">

        {/* Aspect Ratio */}
        <div className="bg-blue-500/30 border border-blue-300/40 rounded-xl px-2 py-1 shadow-inner hover:bg-blue-500/40 transition">
          <AspectRatioSelector />
        </div>

        {/* Basic Add Elements */}
        <div className="flex flex-wrap items-center gap-2 border-l border-white/30 pl-3 sm:pl-4">
          
          {/* Add Text */}
          <button
            onClick={() => addText()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition text-sm sm:text-base"
            title="Add Text"
          >
            <Type className="w-4 h-4" /> Text
          </button>

          {/* Shapes */}
          {[
            { type: "rectangle", icon: <Square className="w-4 h-4" /> },
            { type: "circle", icon: <Circle className="w-4 h-4" /> },
            { type: "line", icon: <Minus className="w-4 h-4" /> },
          ].map((shape) => (
            <button
              key={shape.type}
              onClick={() => addShape(shape.type)}
              className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 hover:bg-blue-400/40 hover:shadow transition"
              title={shape.type}
            >
              {shape.icon}
            </button>
          ))}

          {/* === NEW ELEMENTS BUTTON (DROPDOWN) === */}
          <div className="relative">
            <button
              onClick={() => {
                setElementsOpen(!elementsOpen);
                setExportOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/30 border border-purple-300/40 hover:bg-purple-400/40 hover:shadow transition text-sm sm:text-base"
            >
              <Shapes className="w-4 h-4" /> Elements
            </button>

            {elementsOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-blue-700 border border-blue-200 rounded-xl shadow-xl z-50 overflow-hidden">

                {/* Simple Graphics */}
                <div className="px-4 py-2 text-xs font-bold bg-blue-50 border-b border-blue-100">
                  Quick Elements
                </div>

                <button
                  onClick={() => { addShape("triangle"); setElementsOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition text-sm"
                >
                  <Triangle className="w-4 h-4" /> Triangle
                </button>

                <button
                  onClick={() => { addShape("star"); setElementsOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition text-sm"
                >
                  <Star className="w-4 h-4" /> Star
                </button>

                <button
                  onClick={() => { addShape("blob"); setElementsOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition text-sm"
                >
                  <Palette className="w-4 h-4" /> Blob Shape
                </button>

                {/* Divider */}
                <div className="border-t my-1"></div>

                {/* Upload Element */}
                <div className="px-4 py-2 text-xs font-bold bg-blue-50 border-b border-blue-100">
                  Custom
                </div>

                <input
                  ref={elementFileRef}
                  onChange={onUploadElement}
                  type="file"
                  accept="image/*, .svg"
                  className="hidden"
                />

                <button
                  onClick={() => elementFileRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition text-sm"
                >
                  <Upload className="w-4 h-4" /> Upload Element
                </button>

                <button
                  onClick={() => {
                    const url = prompt("Element URL");
                    if (url) addImage(url);
                    setElementsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition text-sm"
                >
                  <ImageIcon className="w-4 h-4" /> Import From URL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
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

      {/* Undo / Redo */}
      <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-x border-white/30 px-2 sm:px-4 mt-2 sm:mt-0">
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

      {/* Export */}
      <div className="relative mt-2 sm:mt-0">
        <button
          onClick={() => {
            setExportOpen(!exportOpen);
            setElementsOpen(false);
          }}
          className="flex items-center gap-1 bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-50 hover:shadow transition text-sm sm:text-base"
        >
          <Download className="w-4 h-4" /> Export
        </button>

        {exportOpen && (
          <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-blue-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {["png", "jpg", "svg", "pdf"].map((type) => (
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
  );
}
