import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import {
  Upload,
  Type,
  Shapes,
  Image as ImageIcon,
  Palette,
  Scaling,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import SampleImg from "../assets/Book.png";

const Customization = () => {
  const [text, setText] = useState("Your text here");
  const [activePanel, setActivePanel] = useState(null);
  const [selectedObj, setSelectedObj] = useState(null);
  const [selectedSize, setSelectedSize] = useState({ width: 100, height: 100 });

  const [zoom, setZoom] = useState(1);
  const [font, setFont] = useState("Arial");
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const initialBgRef = useRef("#f9fafb");

  // history stacks
  const history = useRef([]);
  const redoStack = useRef([]);

  const saveHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      try {
        const json = canvas.toJSON();
        const last = history.current[history.current.length - 1];
        if (JSON.stringify(last) !== JSON.stringify(json)) {
          history.current.push(json);
          if (history.current.length > 50) history.current.shift();
          redoStack.current = [];
        }
      } catch (err) {
        // ignore serialization errors
      }
    }
  };

  // helper to rescale background image to cover canvas
  const rescaleBackground = (canvas) => {
    if (!canvas) return;
    const bg = canvas.backgroundImage;
    if (!bg) return;
    // bg is a fabric.Image instance
    const scale = Math.max(canvas.getWidth() / bg.width, canvas.getHeight() / bg.height);
    bg.set({ originX: "left", originY: "top", left: 0, top: 0, selectable: false });
    bg.scale(scale);
    canvas.renderAll();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 700,
      height: 400,
      backgroundColor: initialBgRef.current,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Initial text
    const textObj = new fabric.Textbox(text, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "black",
      fontFamily: "Arial",
    });
    canvas.add(textObj);

    saveHistory();

    // Record changes
    canvas.on("object:added", saveHistory);
    canvas.on("object:modified", () => {
      saveHistory();
      const obj = canvas.getActiveObject();
      if (obj) {
        setSelectedSize({
          width: Math.round(obj.getScaledWidth()),
          height: Math.round(obj.getScaledHeight()),
        });
      }
    });
    canvas.on("object:removed", saveHistory);

    // Track selection
    const updateSelection = (e) => {
      const obj = (e && (e.selected?.[0] || e.target)) || canvas.getActiveObject();
      setSelectedObj(obj || null);

      if (obj) {
        if (obj.type === "textbox") {
          setFont(obj.fontFamily || "Arial");
        }
        // use getScaledWidth/getScaledHeight to account for scaling
        setSelectedSize({
          width: Math.round(obj.getScaledWidth()),
          height: Math.round(obj.getScaledHeight()),
        });
      } else {
        setSelectedSize({ width: 100, height: 100 });
      }
    };

    canvas.on("selection:created", updateSelection);
    canvas.on("selection:updated", updateSelection);
    canvas.on("selection:cleared", updateSelection);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedObj?.type === "textbox") {
      selectedObj.text = text;
      fabricCanvasRef.current?.renderAll();
    }
  }, [text, selectedObj]);

  // --- IMAGE UPLOAD (adds an image object) ---
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(150);
      img.set({ left: 200, top: 150 });
      fabricCanvasRef.current.add(img).setActiveObject(img);
      fabricCanvasRef.current.renderAll();
      // clean up object URL
      URL.revokeObjectURL(url);
    });
  };

  // --- BACKGROUND IMAGE UPLOAD (set as canvas background, scaled to cover) ---
  const handleBackgroundUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Use setBackgroundImage with url, and in callback scale it to cover canvas
    canvas.setBackgroundImage(
      url,
      (img) => {
        // img is fabric.Image instance
        img.set({ originX: "left", originY: "top", left: 0, top: 0, selectable: false });
        const scale = Math.max(canvas.getWidth() / img.width, canvas.getHeight() / img.height);
        img.scale(scale);
        canvas.renderAll();
        // revoke the blob url (image data already loaded into fabric)
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          // ignore
        }
      },
      {
        crossOrigin: "anonymous",
      }
    );
  };

  // --- SHAPES ---
  const addShape = (type) => {
    let shape;
    if (type === "rect") {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "#3b82f6",
        width: 100,
        height: 100,
      });
    } else if (type === "circle") {
      shape = new fabric.Circle({
        left: 150,
        top: 100,
        fill: "#22c55e",
        radius: 50,
      });
    } else if (type === "triangle") {
      shape = new fabric.Triangle({
        left: 200,
        top: 100,
        fill: "#f97316",
        width: 100,
        height: 100,
      });
    }
    fabricCanvasRef.current.add(shape).setActiveObject(shape);
  };

  // --- SAVE IMAGE ---
  const handleSave = (type = "png") => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: type,
      quality: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `design.${type}`;
    link.click();
  };

  // --- UNDO/REDO ---
  const handleUndo = () => {
    if (history.current.length > 1) {
      const currentState = history.current.pop();
      redoStack.current.push(currentState);
      const prevState = history.current[history.current.length - 1];
      fabricCanvasRef.current.loadFromJSON(prevState, () =>
        fabricCanvasRef.current.renderAll()
      );
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length > 0) {
      const state = redoStack.current.pop();
      history.current.push(state);
      fabricCanvasRef.current.loadFromJSON(state, () =>
        fabricCanvasRef.current.renderAll()
      );
    }
  };

  // --- HANDLE FONT CHANGE ---
  const handleFontChange = (value) => {
    setFont(value);
    if (selectedObj?.type === "textbox") {
      selectedObj.set("fontFamily", value);
      fabricCanvasRef.current.renderAll();
    }
  };

  // --- HANDLE RESIZE (numeric inputs W/H) ---
  const handleResize = (dimension, value) => {
    if (!selectedObj || !fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // ensure value is number
    const v = Number(value) || 0;
    if (v <= 0) return;

    // For textbox, we might treat width as box width; but preserving your behavior:
    if (selectedObj.type === "textbox" && dimension === "width") {
      // adjust textbox width (not scale)
      selectedObj.set("width", v);
    } else {
      // for images/shapes, use scaleToWidth/Height
      if (dimension === "width") {
        if (typeof selectedObj.scaleToWidth === "function") {
          selectedObj.scaleToWidth(v);
        } else {
          selectedObj.set({ scaleX: v / (selectedObj.width || 1) });
        }
      } else {
        if (typeof selectedObj.scaleToHeight === "function") {
          selectedObj.scaleToHeight(v);
        } else {
          selectedObj.set({ scaleY: v / (selectedObj.height || 1) });
        }
      }
    }

    // update selected size state
    setSelectedSize({
      width: Math.round(selectedObj.getScaledWidth ? selectedObj.getScaledWidth() : (selectedObj.width || 0)),
      height: Math.round(selectedObj.getScaledHeight ? selectedObj.getScaledHeight() : (selectedObj.height || 0)),
    });

    canvas.renderAll();
  };

  // --- HANDLE BACKGROUND COLOR CHANGE ---
  const handleBackgroundColorChange = (color) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.setBackgroundColor(color, () => {
      canvas.renderAll();
    });
  };

  // --- HANDLE ZOOM ---
  const handleZoom = (factor) => {
    let newZoom = zoom * factor;
    if (newZoom < 0.2) newZoom = 0.2;
    if (newZoom > 3) newZoom = 3;
    setZoom(newZoom);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.setZoom(newZoom);
    canvas.renderAll();
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
          { key: "canvasSize", icon: <Scaling className="w-6 h-6" /> },
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
          {/* Upload */}
          {activePanel === "upload" && (
            <div>
              <h2 className="font-semibold mb-2">Upload</h2>
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl text-center">
                <Upload className="w-10 h-10 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag & drop or choose a file
                </p>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="text-sm text-blue-700 cursor-pointer"
                />
              </div>

              {/* Sample image button */}
              <div className="mt-4">
                <button
                  onClick={() =>
                    fabric.Image.fromURL(SampleImg, (img) => {
                      img.scaleToWidth(150);
                      img.set({ left: 200, top: 150 });
                      fabricCanvasRef.current.add(img).setActiveObject(img);
                    })
                  }
                  className="w-full px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg shadow mt-2"
                >
                  Add Sample Image
                </button>
              </div>
            </div>
          )}

          {/* Text */}
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
                    fabricCanvasRef.current.add(header).setActiveObject(header);
                  }}
                  className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow text-lg font-bold"
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
                    fabricCanvasRef.current
                      .add(subHeader)
                      .setActiveObject(subHeader);
                  }}
                  className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow text-base font-semibold"
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
                    fabricCanvasRef.current
                      .add(bodyText)
                      .setActiveObject(bodyText);
                  }}
                  className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow text-sm"
                >
                  Add Body Text
                </button>
              </div>

              {selectedObj?.type === "textbox" && (
                <>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Edit selected text..."
                  />
                  <input
                    type="color"
                    onChange={(e) => {
                      selectedObj.set("fill", e.target.value);
                      fabricCanvasRef.current.renderAll();
                    }}
                    className="w-full mb-2"
                  />
                </>
              )}
            </div>
          )}

          {/* Shapes */}
          {activePanel === "shapes" && (
            <div>
              <h2 className="font-semibold mb-2">Shapes</h2>
              <div className="flex flex-col gap-2 mb-4">
                <button
                  onClick={() => addShape("rect")}
                  className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg shadow"
                >
                  Rectangle
                </button>
                <button
                  onClick={() => addShape("circle")}
                  className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg shadow"
                >
                  Circle
                </button>
                <button
                  onClick={() => addShape("triangle")}
                  className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg shadow"
                >
                  Triangle
                </button>
              </div>
            </div>
          )}

          {/* Background */}
          {activePanel === "background" && (
            <div>
              <h2 className="font-semibold mb-2">Background</h2>

              {/* Solid Color Picker */}
              <label className="block text-sm mb-1">Background Color</label>
              <input
                type="color"
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-full h-10 cursor-pointer rounded mb-3"
              />

              {/* Image Upload */}
              <label className="block text-sm mb-1">Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="w-full text-sm"
              />

              {/* Reset Background */}
              <button
                onClick={() => {
                  const canvas = fabricCanvasRef.current;
                  if (!canvas) return;
                  canvas.setBackgroundImage(null, () => canvas.renderAll());
                  canvas.setBackgroundColor(initialBgRef.current, () =>
                    canvas.renderAll()
                  );
                }}
                className="w-full mt-3 px-3 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow"
              >
                Reset Background
              </button>
            </div>
          )}

          {/* Canvas Size */}
          {activePanel === "canvasSize" && (
            <div>
              <h2 className="font-semibold mb-2">Canvas Size</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const canvas = fabricCanvasRef.current;
                    if (!canvas) return;
                    canvas.setWidth(800);
                    canvas.setHeight(1200);
                    rescaleBackground(canvas);
                    canvas.renderAll();
                  }}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow"
                >
                  Poster (800 × 1200)
                </button>
                <button
                  onClick={() => {
                    const canvas = fabricCanvasRef.current;
                    if (!canvas) return;
                    canvas.setWidth(1000);
                    canvas.setHeight(700);
                    rescaleBackground(canvas);
                    canvas.renderAll();
                  }}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow"
                >
                  Brochure (1000 × 700)
                </button>
                <button
                  onClick={() => {
                    const canvas = fabricCanvasRef.current;
                    if (!canvas) return;
                    canvas.setWidth(350);
                    canvas.setHeight(200);
                    rescaleBackground(canvas);
                    canvas.renderAll();
                  }}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow"
                >
                  Calling Card (350 × 200)
                </button>

                {/* Custom size */}
                <div className="mt-3">
                  <label className="block text-sm mb-1">Custom Size</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Width"
                      className="w-1/2 border rounded p-1"
                      onChange={(e) => {
                        const canvas = fabricCanvasRef.current;
                        if (!canvas) return;
                        const w = parseInt(e.target.value) || canvas.getWidth();
                        canvas.setWidth(w);
                        rescaleBackground(canvas);
                        canvas.renderAll();
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Height"
                      className="w-1/2 border rounded p-1"
                      onChange={(e) => {
                        const canvas = fabricCanvasRef.current;
                        if (!canvas) return;
                        const h = parseInt(e.target.value) || canvas.getHeight();
                        canvas.setHeight(h);
                        rescaleBackground(canvas);
                        canvas.renderAll();
                      }}
                    />
                  </div>
                </div>
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
              onClick={() => handleSave("png")}
              className="px-3 md:px-4 py-1 md:py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg shadow"
            >
              Save PNG
            </button>
          </div>

          {/* Text Tools (always visible, but disabled if no textbox selected) */}
          <div className="flex items-center gap-1">
            <select
              disabled={!selectedObj || selectedObj.type !== "textbox"}
              value={selectedObj?.fontFamily || "Arial"}
              onChange={(e) => {
                if (selectedObj && selectedObj.type === "textbox") {
                  selectedObj.set("fontFamily", e.target.value);
                  fabricCanvasRef.current.renderAll();
                }
              }}
              className="px-2 py-1 border rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Poppin">Poppin</option>
            </select>
          </div>

          {/* Object Resize (Width / Height inputs) */}
          <div className="flex items-center gap-1">
            <label className="text-sm">W</label>
            <input
              type="number"
              min="20"
              max="2000"
              disabled={!selectedObj}
              value={selectedSize.width}
              onChange={(e) => handleResize("width", parseInt(e.target.value))}
              className="w-20 px-2 py-1 border rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
            />
            <label className="text-sm">H</label>
            <input
              type="number"
              min="20"
              max="2000"
              disabled={!selectedObj}
              value={selectedSize.height}
              onChange={(e) => handleResize("height", parseInt(e.target.value))}
              className="w-20 px-2 py-1 border rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
            />
          </div>

          <button className="px-4 md:px-5 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
            Confirm Design
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center bg-white rounded-2xl shadow-md overflow-auto relative">
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg shadow mt-2 mb-2">
            <button
              onClick={() => handleZoom(0.9)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <ZoomOut />
            </button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => handleZoom(1.1)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <ZoomIn />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;
