import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import {
  Upload,
  Type,
  Shapes,
  Image as ImageIcon,
  Palette,
  Undo2,
  Redo2,
} from "lucide-react";

const Customization = () => {
  const [text, setText] = useState("Your text here");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // history stacks
  const history = useRef([]);
  const redoStack = useRef([]);

  const saveHistory = () => {
    if (fabricCanvasRef.current) {
      const json = fabricCanvasRef.current.toJSON();
      history.current.push(json);
      if (history.current.length > 50) {
        history.current.shift(); // keep only last 50 steps
      }
      redoStack.current = []; // clear redo stack when new action
    }
  };

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

    // save initial state
    saveHistory();

    // record every change as a step
    canvas.on("object:added", saveHistory);
    canvas.on("object:modified", saveHistory);
    canvas.on("object:removed", saveHistory);

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

  const handleUndo = () => {
    if (history.current.length > 1) {
      const currentState = history.current.pop();
      redoStack.current.push(currentState);

      const prevState = history.current[history.current.length - 1];
      fabricCanvasRef.current.loadFromJSON(prevState, () => {
        fabricCanvasRef.current.renderAll();
      });
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length > 0) {
      const state = redoStack.current.pop();
      history.current.push(state);

      fabricCanvasRef.current.loadFromJSON(state, () => {
        fabricCanvasRef.current.renderAll();
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 p-3 md:p-6">
      {/* Sidebar */}
      <div className="flex md:flex-col w-full md:w-20 bg-blue-600 rounded-2xl shadow-md items-center justify-between md:justify-start py-2 md:py-6 space-x-4 md:space-x-0 md:space-y-8">
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
            className={`p-2 md:p-3 rounded-xl transition ${
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
          activePanel ? "w-full md:w-64 md:ml-4 mt-4 md:mt-0" : "w-0 md:w-0"
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

              <div className="flex flex-col gap-2 mb-4">
                <button
                  onClick={() => {
                    const header = new fabric.Textbox("Add a Heading", {
                      left: 100,
                      top: 100,
                      fontSize: 32,
                      fontWeight: "bold",
                      fill: "black",
                    });
                    fabricCanvasRef.current.add(header);
                  }}
                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-lg font-bold"
                >
                  Add Heading
                </button>

                <button
                  onClick={() => {
                    const subHeader = new fabric.Textbox("Add a Subheading", {
                      left: 100,
                      top: 150,
                      fontSize: 24,
                      fontWeight: "600",
                      fill: "black",
                    });
                    fabricCanvasRef.current.add(subHeader);
                  }}
                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-base font-semibold"
                >
                  Add Subheading
                </button>

                <button
                  onClick={() => {
                    const bodyText = new fabric.Textbox("Add body text", {
                      left: 100,
                      top: 200,
                      fontSize: 16,
                      fontWeight: "normal",
                      fill: "black",
                      width: 300,
                    });
                    fabricCanvasRef.current.add(bodyText);
                  }}
                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-sm"
                >
                  Add Body Text
                </button>
              </div>

              {/* Editable Input */}
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Edit selected text..."
              />
            </div>
          )}

          {activePanel === "shapes" && (
            <div>
              <h2 className="font-semibold mb-2">Shapes</h2>
              <div className="flex gap-2">
                {/* Rectangle */}
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
                  className="w-10 h-10 bg-blue-300 rounded-sm shadow"
                ></button>

                {/* Circle */}
                <button
                  onClick={() => {
                    const circle = new fabric.Circle({
                      left: 150,
                      top: 100,
                      fill: "lightgreen",
                      radius: 40,
                    });
                    fabricCanvasRef.current.add(circle);
                  }}
                  className="w-10 h-10 bg-green-300 rounded-full shadow"
                ></button>

                {/* Triangle */}
                <button
                  onClick={() => {
                    const triangle = new fabric.Triangle({
                      left: 200,
                      top: 100,
                      fill: "lightcoral",
                      width: 80,
                      height: 80,
                    });
                    fabricCanvasRef.current.add(triangle);
                  }}
                  className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] 
                            border-l-transparent border-r-transparent border-b-red-400 
                            bg-transparent shadow-none outline-none"
                ></button>

                {/* Line */}
                <button
                  onClick={() => {
                    const line = new fabric.Line([50, 100, 200, 100], {
                      left: 250,
                      top: 100,
                      stroke: "black",
                      strokeWidth: 3,
                    });
                    fabricCanvasRef.current.add(line);
                  }}
                  className="w-10 h-1 bg-black shadow self-center"
                ></button>
              </div>
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
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col mt-4 md:mt-0 md:ml-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-2xl shadow-md p-2 md:p-3 mb-4">
          <div className="space-x-2">
            <button
              onClick={handleUndo}
              className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm"
            >
              <Undo2 />
            </button>
            <button
              onClick={handleRedo}
              className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm"
            >
              <Redo2 />
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
