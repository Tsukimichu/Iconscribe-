import React, { useRef, useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { exportCanvasAsPng, exportCanvasAsJpg, exportCanvasAsSvg, exportCanvasAsPdf } from "../../utils/exportUtils";
import AspectRatioSelector from '../AspectRatioSelector';

export default function Toolbar() {
  const { addText, addShape, addImage, undo, redo, updateElement, state } = useEditor();
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex justify-between items-center p-3 border-b bg-gray-50">
        <AspectRatioSelector />
        {/* ...other buttons like export, undo, redo... */}
      </div>
      {/* Add Elements */}
      <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={() => addText()}>
        Add Text
      </button>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => addShape("rectangle")}>
          Rectangle
        </button>
        <button className="px-3 py-1 rounded bg-green-500 text-white" onClick={() => addShape("circle")}>
          Circle
        </button>
        <button className="px-3 py-1 rounded bg-green-400 text-white" onClick={() => addShape("line")}>
          Line
        </button>
      </div>

      {/* Image Upload */}
      <input ref={fileRef} onChange={onUpload} type="file" accept="image/*" className="hidden" />
      <button
        className="px-3 py-1 rounded bg-yellow-500 text-white"
        onClick={() => fileRef.current && fileRef.current.click()}
      >
        Upload Image
      </button>
      <button className="px-3 py-1 rounded bg-amber-500 text-white" onClick={addImageFromUrl}>
        Image from URL
      </button>

      {/* Undo / Redo */}
      <div className="ml-4">
        <button onClick={undo} className="px-2 py-1 border rounded mr-2">
          Undo
        </button>
        <button onClick={redo} className="px-2 py-1 border rounded">
          Redo
        </button>
      </div>

      {/* --- Dynamic Controls --- */}
      {selected && (
        <div className="ml-6 flex items-center gap-4 border-l pl-4">
          {/* Shape Controls */}
          {selected.type === "shape" && (
            <>
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600">Fill</label>
                <input
                  type="color"
                  value={selected.background || "#000000"}
                  onChange={(e) => updateElement(selected.id, { background: e.target.value })}
                  className="w-8 h-8 border rounded"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600">Border</label>
                <input
                  type="color"
                  value={selected.borderColor || "#000000"}
                  onChange={(e) => updateElement(selected.id, { borderColor: e.target.value })}
                  className="w-8 h-8 border rounded"
                />
              </div>
              <div className="flex flex-col items-center w-24">
                <label className="text-xs text-gray-600">Border Width</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={selected.borderWidth ?? 0}
                  onChange={(e) => updateElement(selected.id, { borderWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Text Controls */}
          {selected.type === "text" && (
            <>
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600">Color</label>
                <input
                  type="color"
                  value={selected.color || "#000000"}
                  onChange={(e) => updateElement(selected.id, { color: e.target.value })}
                  className="w-8 h-8 border rounded"
                />
              </div>
              <div className="flex flex-col items-center w-24">
                <label className="text-xs text-gray-600">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={selected.fontSize ?? 24}
                  onChange={(e) => updateElement(selected.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Export Dropdown --- */}
      <div className="ml-auto relative">
        <button
          onClick={() => setExportOpen(!exportOpen)}
          className="px-3 py-1 rounded bg-slate-800 text-white"
        >
          Export
        </button>

        {exportOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={() => handleExport("png")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as PNG
            </button>
            <button
              onClick={() => handleExport("jpg")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as JPG
            </button>
            <button
              onClick={() => handleExport("svg")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as SVG
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
            >
              Export as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
