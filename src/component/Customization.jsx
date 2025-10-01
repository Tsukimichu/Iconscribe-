import React, { useState, useEffect, useRef } from "react";
import * as fabric  from "fabric";
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

const Customization = () => {
  const [text, setText] = useState("Your text here");
  const [activePanel, setActivePanel] = useState(null);
  const [selectedObj, setSelectedObj] = useState(null);
  const [selectedSize, setSelectedSize] = useState({ width: 100, height: 100 });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const initialBgRef = useRef("#f9fafb");

  // --- history stacks ---
  const history = useRef([]);
  const redoStack = useRef([]);
  const isRestoring = useRef(false);

  const saveHistory = () => {
    if (isRestoring.current) return; // skip if restoring

    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const json = canvas.toDatalessJSON(); // smaller history size
      const last = history.current[history.current.length - 1];

      if (JSON.stringify(last) !== JSON.stringify(json)) {
        history.current.push(json);
        if (history.current.length > 50) history.current.shift(); // cap history size
        redoStack.current = []; // clear redo on new action
      }
    }
  };

  // --- useEffect for fabric canvas ---
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

    saveHistory(); // first snapshot

    // Record changes safely
    canvas.on("object:added", () => {
      if (!isRestoring.current) saveHistory();
    });

    canvas.on("object:modified", () => {
      if (!isRestoring.current) saveHistory();
      const obj = canvas.getActiveObject();
      if (obj) {
        setSelectedSize({
          width: Math.round(obj.getScaledWidth()),
          height: Math.round(obj.getScaledHeight()),
        });
      }
    });

    canvas.on("object:removed", () => {
      if (!isRestoring.current) saveHistory();
    });

    // Track selection
    const updateSelection = (e) => {
      const obj =
        (e && (e.selected?.[0] || e.target)) || canvas.getActiveObject();
      setSelectedObj(obj || null);

      if (obj) {
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

  // --- UNDO ---
  const handleUndo = () => {
    if (history.current.length > 1) {
      const currentState = history.current.pop();
      redoStack.current.push(currentState);

      const prevState = history.current[history.current.length - 1];
      isRestoring.current = true;
      fabricCanvasRef.current.loadFromJSON(prevState, () => {
        fabricCanvasRef.current.renderAll();
        isRestoring.current = false;
      });
    }
  };

  // --- REDO ---
  const handleRedo = () => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop();
      history.current.push(nextState);

      isRestoring.current = true;
      fabricCanvasRef.current.loadFromJSON(nextState, () => {
        fabricCanvasRef.current.renderAll();
        isRestoring.current = false;
      });
    }
  };

  // helper to rescale background image to cover canvas
  const rescaleBackground = (canvas) => {
    if (!canvas) return;
    const bg = canvas.backgroundImage;
    if (!bg) return;
    const scale = Math.max(
      canvas.getWidth() / bg.width,
      canvas.getHeight() / bg.height
    );
    bg.set({
      originX: "left",
      originY: "top",
      left: 0,
      top: 0,
      selectable: false,
    });
    bg.scale(scale);
    canvas.renderAll();
  };

  useEffect(() => {
    if (selectedObj?.type === "textbox") {
      selectedObj.text = text;
      fabricCanvasRef.current?.renderAll();
    }
  }, [text, selectedObj]);

  // --- IMAGE UPLOAD (adds an image object) ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map((file) => {
      const url = URL.createObjectURL(file);

      // Add image to Fabric canvas
      fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(150);
        img.set({ left: 200, top: 150 });
        fabricCanvasRef.current.add(img).setActiveObject(img);
        fabricCanvasRef.current.renderAll();
      });

      return url;
    });

    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  // --- BACKGROUND IMAGE UPLOAD (set as canvas background, scaled to cover) ---
  const handleBackgroundUpload = (e) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, (img) => {
        img.set({
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
          selectable: false,
        });

        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        img.scale(scale);

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    };
    reader.readAsDataURL(file);
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

  // --- HANDLE FONT CHANGE ---
  const handleFontChange = (value) => {
    if (selectedObj?.type === "textbox") {
      selectedObj.set("fontFamily", value);
      fabricCanvasRef.current.renderAll();
    }
  };

  // --- HANDLE RESIZE (numeric inputs W/H) ---
  const handleResize = (dimension, value) => {
    if (!selectedObj || !fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    const v = Number(value) || 0;
    if (v <= 0) return;

    if (selectedObj.type === "textbox" && dimension === "width") {
      selectedObj.set("width", v);
    } else {
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

    setSelectedSize({
      width: Math.round(
        selectedObj.getScaledWidth
          ? selectedObj.getScaledWidth()
          : selectedObj.width || 0
      ),
      height: Math.round(
        selectedObj.getScaledHeight
          ? selectedObj.getScaledHeight()
          : selectedObj.height || 0
      ),
    });

    canvas.renderAll();
  };

  // --- HANDLE BACKGROUND COLOR CHANGE ---
  const handleBackgroundColorChange = (color) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setBackgroundImage(null, () => {
      canvas.setBackgroundColor(color, () => {
        canvas.renderAll();
        saveHistory();
      });
    });
  };

  // --- RESET BACKGROUND ---
  const handleResetBackground = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
    canvas.setBackgroundColor(initialBgRef.current, () => {
      canvas.renderAll();
      saveHistory();
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

  // --- Canvas Size Change Helper ---
  const setCanvasSize = (width, height) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvasRef.current) return;
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    rescaleBackground(canvas);
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 p-3 md:p-6">
      {/* Sidebar */}
      <div className="flex md:flex-col w-full md:w-20 bg-blue-600 rounded-2xl shadow-md items-center justify-between md:justify-start py-2 md:py-6 space-x-4 md:space-x-0 md:space-y-8">
       { [{
          key: "upload",
          icon: <Upload className="w-6 h-6" />,
        },
        {
          key: "images",
          icon: <ImageIcon className="w-6 h-6" />,
        },
        {
          key: "text",
          icon: <Type className="w-6 h-6" />,
        },
        {
          key: "shapes",
          icon: <Shapes className="w-6 h-6" />,
        },
        {
          key: "background",
          icon: <Palette className="w-6 h-6" />,
        },
        {
          key: "canvasSize",
          icon: <Scaling className="w-6 h-6" />,
        },
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
          activePanel ? "w-full md:w-72 md:ml-4 mt-4 md:mt-0" : "w-0 md:w-0"
        }`}
      >
        <div className="h-full bg-white border border-gray-200 p-5 rounded-2xl shadow-lg">
          {/* Upload */}
          {activePanel === "upload" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">
                Upload
              </h2>
              <div
                onClick={() =>
                  document.getElementById("fileUploadInput").click()
                }
                className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition"
              >
                <Upload className="w-10 h-10 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <input
                  id="fileUploadInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="w-full aspect-square border rounded-lg overflow-hidden shadow"
                    >
                      <img
                        src={url}
                        alt={`Uploaded Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Text */}
          {activePanel === "text" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">
                Text Tools
              </h2>
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
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">
                Shapes
              </h2>
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
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">
                Background
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Choose a Background Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#ffffff",
                    "#f87171",
                    "#60a5fa",
                    "#34d399",
                    "#facc15",
                    "#f472b6",
                  ].map((color, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-8 h-8 rounded-md border shadow-sm focus:outline-none"
                      style={{ backgroundColor: color }}
                      onClick={() => handleBackgroundColorChange(color)}
                    />
                  ))}
                  <input
                    type="color"
                    onChange={(e) =>
                      handleBackgroundColorChange(e.target.value)
                    }
                    className="w-10 h-10 rounded-md cursor-pointer border"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Upload a Background Image
                </label>
                <div
                  onClick={() =>
                    document.getElementById("bgUploadInput").click()
                  }
                  className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition"
                >
                  <ImageIcon className="w-8 h-8 text-gray-500 mb-1" />
                  <p className="text-sm text-gray-600">
                    Click to upload background
                  </p>
                  <input
                    id="bgUploadInput"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <button
                onClick={handleResetBackground}
                className="w-full mt-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow"
              >
                Reset Background
              </button>
            </div>
          )}

          {/* Canvas Size */}
          {activePanel === "canvasSize" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">
                Canvas Size
              </h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCanvasSize(800, 1200)}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow"
                >
                  Poster (800 × 1200)
                </button>
                <button
                  onClick={() => setCanvasSize(1000, 700)}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow"
                >
                  Brochure (1000 × 700)
                </button>
                <button
                  onClick={() => setCanvasSize(350, 200)}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow"
                >
                  Calling Card (350 × 200)
                </button>
                <div className="mt-3">
                  <label className="block text-sm mb-1">Custom Size</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Width"
                      className="w-1/2 border rounded p-1"
                      onChange={(e) => {
                        const w = parseInt(e.target.value);
                        if (w > 0) setCanvasSize(w, fabricCanvasRef.current.getHeight());
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Height"
                      className="w-1/2 border rounded p-1"
                      onChange={(e) => {
                        const h = parseInt(e.target.value);
                        if (h > 0) setCanvasSize(fabricCanvasRef.current.getWidth(), h);
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
              onChange={(e) => handleFontChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Poppins">Poppins</option>
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
            <canvas
              ref={canvasRef}
              className="relative w-full max-w-3xl overflow-hidden group shadow-2xl rounded-2xl"
            />
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
