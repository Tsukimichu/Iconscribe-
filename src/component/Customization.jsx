import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import {
  Upload,
  Type,
  Shapes,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

const Customization = () => {
  const [text, setText] = useState("Your text here");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 700,
      height: 400,
      backgroundColor: "#f9fafb",
    });

    fabricCanvasRef.current = canvas;

    const textObj = new fabric.Textbox(text, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "black",
    });
    canvas.add(textObj);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      const textObj = canvas.getObjects("textbox")[0];
      if (textObj) {
        textObj.text = text;
        canvas.renderAll();
      }
    }
  }, [text]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);

      fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(150);
        img.set({ left: 200, top: 150 });
        fabricCanvasRef.current.add(img);
      });
    }
  };

  const handleSave = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
      });
      console.log("Saved Image:", dataURL);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4 md:p-6">
      {/* Sidebar */}
      <div className="w-16 md:w-20 bg-blue-600 rounded-2xl shadow-md flex flex-col items-center py-4 md:py-6 space-y-6 md:space-y-8">
        {[
          { key: "upload", icon: <Upload className="w-6 h-6" /> },
          { key: "images", icon: <ImageIcon className="w-6 h-6" /> },
          { key: "text", icon: <Type className="w-6 h-6" /> },
          { key: "shapes", icon: <Shapes className="w-6 h-6" /> },
          { key: "background", icon: <Palette className="w-6 h-6" /> },
        ].map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setActivePanel(activePanel === key ? null : key)}
            className={`p-3 rounded-xl transition ${
              activePanel === key
                ? "bg-yellow-400 text-black shadow"
                : "hover:bg-blue-500 text-white"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

{/* Slide-out Panel */}
<div
  className={`transition-all duration-300 overflow-hidden ${
    activePanel ? "w-64 ml-4" : "w-0 ml-0"
  }`}
>
  <div className="h-full bg-gray-200 p-4 rounded-2xl shadow-md">
    {activePanel === "upload" && (
      <div>
        <h2 className="font-semibold mb-2">Upload</h2>
        <input type="file" onChange={handleImageUpload} />
      </div>
    )}

    {activePanel === "images" && (
      <div>
        <h2 className="font-semibold mb-2">Images</h2>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-full h-20 bg-gray-300 flex items-center justify-center rounded"
            >
              <ImageIcon className="w-8 h-8 text-gray-500" />
            </div>
          ))}
        </div>
      </div>
    )}

    {activePanel === "text" && (
      <div>
        <h2 className="font-semibold mb-2">Text Tools</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
    )}

    {activePanel === "shapes" && (
      <div>
        <h2 className="font-semibold mb-2">Shapes</h2>
        <button
          onClick={() => {
            const rect = new fabric.Rect({
              left: 100,
              top: 100,
              fill: "lightblue",
              width: 80,
              height: 80,
            });
            fabricCanvasRef.current.add(rect);
          }}
          className="px-3 py-1 bg-white border rounded shadow"
        >
          Add Rectangle
        </button>
      </div>
    )}

    {activePanel === "background" && (
      <div>
        <h2 className="font-semibold mb-2">Background</h2>
        <div className="flex gap-2">
          {["white", "lightgray", "lightyellow", "lightblue"].map((color) => (
            <div
              key={color}
              onClick={() =>
                fabricCanvasRef.current.setBackgroundColor(
                  color,
                  fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current)
                )
              }
              className="w-8 h-8 rounded cursor-pointer border"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>




      {/* Main Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-4 mt-4 md:mt-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-2 md:p-3 mb-4">
          <div className="space-x-2">
            <button className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm">
              Undo
            </button>
            <button className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm">
              Redo
            </button>
            <button
              onClick={handleSave}
              className="px-3 md:px-4 py-1 md:py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg shadow"
            >
              Save
            </button>
          </div>
          <button className="px-4 md:px-5 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
            Confirm Design
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex justify-center items-center bg-white rounded-2xl shadow-md overflow-auto">
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Customization;
