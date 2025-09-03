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
  const [activePanel, setActivePanel] = useState(null); // 👈 tracks which panel is open
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 700,
      height: 400,
      backgroundColor: "#f0f0f0",
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 bg-gray-900 text-white flex flex-col items-center py-6 space-y-8">
        <button onClick={() => setActivePanel("upload")}>
          <Upload className="w-7 h-7" />
        </button>
        <button onClick={() => setActivePanel("images")}>
          <ImageIcon className="w-7 h-7" />
        </button>
        <button onClick={() => setActivePanel("text")}>
          <Type className="w-7 h-7" />
        </button>
        <button onClick={() => setActivePanel("shapes")}>
          <Shapes className="w-7 h-7" />
        </button>
        <button onClick={() => setActivePanel("background")}>
          <Palette className="w-7 h-7" />
        </button>
      </div>

      {/* Slide-out Panel */}
      {activePanel && (
        <div className="w-64 bg-gray-200 p-4 border-r transition-all duration-300">
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
                    className="w-full h-20 bg-gray-300 flex items-center justify-center"
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
                {["white", "lightgray", "lightyellow", "lightblue"].map(
                  (color) => (
                    <div
                      key={color}
                      onClick={() =>
                        fabricCanvasRef.current.setBackgroundColor(
                          color,
                          fabricCanvasRef.current.renderAll.bind(
                            fabricCanvasRef.current
                          )
                        )
                      }
                      className="w-8 h-8 rounded cursor-pointer border"
                      style={{ backgroundColor: color }}
                    ></div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center bg-gray-200 p-2 space-x-2">
          <button className="px-3 py-1 bg-white rounded border">Undo</button>
          <button className="px-3 py-1 bg-white rounded border">Redo</button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-white rounded border"
          >
            Save
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            Confirm Design
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex justify-center items-center bg-white">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default Customization;
