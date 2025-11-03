import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { jsPDF } from "jspdf"; 
import { useLocation } from "react-router-dom";


const Customization = () => {
  const [text, setText] = useState("Your text here");
  const [activePanel, setActivePanel] = useState(null);
  const [selectedObj, SET_SELECTED_OBJ] = useState(null);
  const [selectedSize, setSelectedSize] = useState({ width: 100, height: 100 });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState(null);
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const location = useLocation();
  const [canvases, setCanvases] = useState([{ id: 1 }]);


  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const initialBgRef = useRef("#f9fafb");

  

  // --- NEW: History using snapshots (persistent)
  const history = useRef([]);
  const historyIndex = useRef(-1);
  const HISTORY_LIMIT = 50;


  const showToast = (msg, ms = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  const saveState = (canvas, overwrite = false) => {
    if (!canvas) return;
    // Exclude controls/selection or not? We'll save full JSON for simplicity
    const json = canvas.toJSON([
      // include properties we might need for objects
      "selectable",
      "evented",
    ]);

    if (overwrite && historyIndex.current >= 0) {
      history.current[historyIndex.current] = json;
    } else {
      if (historyIndex.current < history.current.length - 1) {
        history.current = history.current.slice(0, historyIndex.current + 1);
      }
      history.current.push(json);
      historyIndex.current++;
    }

    if (history.current.length > HISTORY_LIMIT) {
      history.current.shift();
      historyIndex.current--;
    }

    try {
      localStorage.setItem("canvasHistory", JSON.stringify(history.current));
      localStorage.setItem("canvasHistoryIndex", historyIndex.current);
    } catch (err) {
      // localStorage might fail if snapshot too large — ignore but notify
      console.warn("Unable to save history to localStorage", err);
    }
  };

  // helper to rescale background image to cover canvas
  const rescaleBackground = (canvas) => {
    if (!canvas) return;
    const bg = canvas.backgroundImage;
    if (!bg) return;
    const scale = Math.max(canvas.getWidth() / bg.width, canvas.getHeight() / bg.height);
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

  // --- UNDO / REDO functions ---
  // --- UNDO ---
  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    if (historyIndex.current <= 0) {
      showToast("No more undo");
      return;
    }
    historyIndex.current--;
    canvas.discardActiveObject();
    canvas.loadFromJSON(history.current[historyIndex.current], () => {
      rescaleBackground(canvas);
      safeRender(canvas);
      canvas.discardActiveObject();
      localStorage.setItem("canvasHistoryIndex", historyIndex.current);
      showToast("Undone");
    });
  }, []);

  // --- REDO ---
  const handleRedo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    if (historyIndex.current >= history.current.length - 1) {
      showToast("No more redo");
      return;
    }
    historyIndex.current++;
    canvas.discardActiveObject();
    canvas.loadFromJSON(history.current[historyIndex.current], () => {
      rescaleBackground(canvas);
      safeRender(canvas);
      canvas.discardActiveObject();
      localStorage.setItem("canvasHistoryIndex", historyIndex.current);
      showToast("Redone");
    });
  }, []);

  // --- useEffect for fabric canvas init + event wiring ---
  useEffect(() => {
    // Make sure the <canvas> exists in the DOM
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      console.warn("Canvas element not yet available");
      return;
    }

    // Initialize Fabric only once
    const canvas = new fabric.Canvas(canvasEl, {
      width: 700,
      height: 500,
      backgroundColor: "#fff",
      preserveObjectStacking: true,
    });
    fabricCanvasRef.current = canvas;

    let isMounted = true; // Flag to prevent updates after unmount

    const templateParamRaw = new URLSearchParams(window.location.search).get("template");

    if (templateParamRaw) {
      const templateParam = templateParamRaw.startsWith("/")
        ? templateParamRaw
        : `/${templateParamRaw}`;

      console.log(" Fetching template:", templateParam);

      fetch(templateParam)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((jsonData) => {
          if (!isMounted) return; // Prevent running after unmount

          try {
            canvas.loadFromJSON(jsonData, () => {
              if (!isMounted) return;
              canvas.renderAll();
              console.log("✅ Template loaded:", templateParam);
            });
          } catch (err) {
            console.error("❌ Error loading JSON into Fabric:", err);
          }
        })
        .catch((err) => {
          console.error("❌ Template fetch/load error:", err);
        });
    }

    // Cleanup safely
    return () => {
      isMounted = false;
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        } catch (err) {
          console.warn("⚠️ Error disposing canvas:", err);
        }
      }
    };
  }, [handleRedo, handleUndo]);


  // --- Keyboard Shortcuts: Undo/Redo/Delete/Nudge/Duplicate/SelectAll/Escape ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // If input fields are focused, avoid interfering (except Ctrl combos)
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isTextInputFocused = activeTag === "input" || activeTag === "textarea";

      // Undo (Ctrl/Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicate (Ctrl/Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          activeObj.clone((cloned) => {
            cloned.set({
              left: activeObj.left + 20,
              top: activeObj.top + 20,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
            saveState(canvas);
          });
        }
        return;
      }

      // Select All (Ctrl/Cmd+A)
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        canvas.discardActiveObject();
        const sel = new fabric.ActiveSelection(canvas.getObjects(), { canvas });
        canvas.setActiveObject(sel);
        canvas.requestRenderAll();
        return;
      }

      // Delete / Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && !isTextInputFocused) {
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          canvas.remove(activeObj);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          saveState(canvas);
        }
        return;
      }

      // Arrow nudge (not when typing)
      if (!isTextInputFocused && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          if (e.key === "ArrowUp") activeObj.top -= step;
          if (e.key === "ArrowDown") activeObj.top += step;
          if (e.key === "ArrowLeft") activeObj.left -= step;
          if (e.key === "ArrowRight") activeObj.left += step;
          activeObj.setCoords();
          canvas.requestRenderAll();
          saveState(canvas, true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRedo, handleUndo]);
  
  // --- TEMPLATE LOADING from query param ---
    const GET_TEMPLATE_FROM_URL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("template");
  };

    
  // Safe render to prevent clearRect error
const safeRender = (canvas) => {
  if (canvas && canvas.contextContainer) {
    try {
      canvas.renderAll();
    } catch (e) {
      console.warn("Skipped render due to missing context:", e);
    }
  }
};

  // --- IMAGE UPLOAD (adds an image object) ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map((file) => {
      const url = URL.createObjectURL(file);

      // Add image to Fabric canvas
      fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(150);
        img.set({ left: 200, top: 150, selectable: true });
        fabricCanvasRef.current.add(img).setActiveObject(img);
        fabricCanvasRef.current.requestRenderAll();
        saveState(fabricCanvasRef.current);
      });

      return url;
    });

    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };


  // --- BACKGROUND IMAGE UPLOAD  ---
  function handleBackgroundUpload(e) {
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
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        img.scale(scale);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        saveState(canvas);
      });
    };
    reader.readAsDataURL(file);
  }

  // --- SHAPES ---
const addShape = (type) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

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

  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.requestRenderAll();
  saveState(canvas);
};

  // --- SAVE / EXPORT: PNG, JPG, SVG, PDF ---
  const handleSave = async (type = "png") => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const format = type.toLowerCase();
    if (format === "png" || format === "jpeg") {
      const dataURL = canvas.toDataURL({ format: format === "jpeg" ? "jpeg" : "png", quality: 1, multiplier: 1 });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `design.${format === "jpeg" ? "jpg" : "png"}`;
      link.click();
      showToast(`Saved ${format.toUpperCase()}`);
    } else if (format === "svg") {
      const svg = canvas.toSVG();
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "design.svg";
      link.click();
      URL.revokeObjectURL(url);
      showToast("Saved SVG");
    } else if (format === "pdf") {
      try {
        // Render as PNG then embed into PDF (jsPDF required)
        const dataURL = canvas.toDataURL({ format: "png", quality: 1 });
        const imgProps = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.src = dataURL;
        });
        const pdf = new jsPDF({
          orientation: imgProps.width > imgProps.height ? "landscape" : "portrait",
          unit: "pt",
          format: [imgProps.width, imgProps.height],
        });
        pdf.addImage(dataURL, "PNG", 0, 0, imgProps.width, imgProps.height);
        pdf.save("design.pdf");
        showToast("Saved PDF");
      } catch (err) {
        console.error("PDF export error", err);
        showToast("PDF export failed (see console)");
      }
    }
  };

  // --- HANDLE FONT CHANGE ---
  const handleFontChange = (value) => {
    if (selectedObj?.type === "textbox") {
      selectedObj.set("fontFamily", value);
      fabricCanvasRef.current.requestRenderAll();
      saveState(fabricCanvasRef.current);
    }
  };

  // --- Text styling helpers ---
  const setTextStyle = (styleKey, value) => {
    if (!selectedObj || selectedObj.type !== "textbox") return;
    const obj = selectedObj;
    if (styleKey === "fontSize") {
      obj.set("fontSize", value);
    } else if (styleKey === "fontWeight") {
      obj.set("fontWeight", value ? "bold" : "normal");
    } else if (styleKey === "fontStyle") {
      obj.set("fontStyle", value ? "italic" : "normal");
    } else if (styleKey === "underline") {
      obj.set("underline", !!value);
    } else if (styleKey === "textAlign") {
      obj.set("textAlign", value);
    } else if (styleKey === "lineHeight") {
      obj.set("lineHeight", value);
    } else if (styleKey === "fill") {
      obj.set("fill", value);
    }
    fabricCanvasRef.current.requestRenderAll();
    saveState(fabricCanvasRef.current);
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
      width: Math.round(selectedObj.getScaledWidth ? selectedObj.getScaledWidth() : selectedObj.width || 0),
      height: Math.round(selectedObj.getScaledHeight ? selectedObj.getScaledHeight() : selectedObj.height || 0),
    });

    canvas.requestRenderAll();
    saveState(canvas, true);
  };

  // --- HANDLE OBJECT FILL/STROKE/LOCK/UNLOCK/DELETE ---
  const setObjectFill = (color) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    if (obj.type === "textbox") {
      obj.set("fill", color);
    } else {
      obj.set("fill", color);
    }
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const setObjectStroke = (color, width = 1) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set({ stroke: color, strokeWidth: width });
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const toggleLock = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    const locked = !!obj.lockMovementX;
    obj.set({
      lockMovementX: !locked,
      lockMovementY: !locked,
      hasControls: locked, // invert controls
      selectable: locked,
    });
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    saveState(canvas);
  };

  // --- BACKGROUND color reset (with confirmation) ---
  function handleResetBackground() {
    setConfirmResetVisible(true);
  }

  const confirmReset = (doReset) => {
    setConfirmResetVisible(false);
    if (!doReset) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
    canvas.setBackgroundColor(initialBgRef.current, () => {
      canvas.requestRenderAll();
      saveState(canvas);
      showToast("Background reset");
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
    canvas.requestRenderAll();
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
    canvas.requestRenderAll();
    saveState(canvas);
  };

  // Keep controlled selected text content in sync (typing updates)
  useEffect(() => {
    if (selectedObj?.type === "textbox") {
      selectedObj.text = text;
      fabricCanvasRef.current?.requestRenderAll();
    }
  }, [text, selectedObj]);

  // --- JSX UI: same structure but with expanded tools ---
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 p-3 md:p-6">
      {/* Sidebar */}
      <div className="flex md:flex-col w-full md:w-20 bg-blue-600 rounded-2xl shadow-md items-center justify-between md:justify-start py-2 md:py-6 space-x-4 md:space-x-0 md:space-y-8">
        {[
          { key: "upload", icon: <Upload className="w-6 h-6" /> },
          { key: "templates", icon: <ImageIcon className="w-6 h-6" /> },
          { key: "text", icon: <Type className="w-6 h-6" /> },
          { key: "shapes", icon: <Shapes className="w-6 h-6" /> },
          { key: "background", icon: <Palette className="w-6 h-6" /> },
          { key: "canvasSize", icon: <Scaling className="w-6 h-6" /> },
        ].map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setActivePanel(activePanel === key ? null : key)}
            className={`p-2 md:p-3 rounded-xl transition ${
              activePanel === key ? "bg-yellow-400 text-black shadow" : "hover:bg-blue-500 text-white"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Slide-out Panel */}
      <div className={`transition-all duration-300 overflow-hidden ${activePanel ? "w-full md:w-72 md:ml-4 mt-4 md:mt-0" : "w-0 md:w-0"}`}>
        <div className="h-full bg-white border border-gray-200 p-5 rounded-2xl shadow-lg">
          {/* Upload */}
          {activePanel === "upload" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">Upload</h2>
              <div
                onClick={() => document.getElementById("fileUploadInput").click()}
                className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition"
              >
                <Upload className="w-10 h-10 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <input id="fileUploadInput" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </div>
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="w-full aspect-square border rounded-lg overflow-hidden shadow">
                      <img src={url} alt={`Uploaded Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Images tools */}
            {activePanel === "templates" && (
              <div>
                <h2 className="font-semibold text-gray-800 mb-3 capitalize">Templates</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Template 1", url: "/templates/business-card/business-card1.jpg" },
                    { name: "Template 2", url: "/templates/business-card/business-card2.jpg" },
                    { name: "Template 3", url: "/templates/business-card/business-card3.jpg" },
                  ].map((tpl, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        fabric.Image.fromURL(tpl.url, (img) => {
                          const canvas = fabricCanvasRef.current;
                          img.scaleToWidth(canvas.width);
                          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                          saveState(canvas);
                        });
                      }}
                      className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <img src={tpl.url} alt={tpl.name} className="w-full h-28 object-cover" />
                      <p className="text-center text-sm py-1">{tpl.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Text */}
          {activePanel === "text" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">Text Tools</h2>
              <div className="flex flex-col gap-2 mb-4">
                <button
                  onClick={() => {
                    const header = new fabric.Textbox("Add a Heading", { left: 100, top: 100, fontSize: 32, fontWeight: "bold", fill: "black" });
                    fabricCanvasRef.current.add(header).setActiveObject(header);
                    saveState(fabricCanvasRef.current);
                  }}
                  className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow text-lg font-bold"
                >
                  Add Heading
                </button>
                <button
                  onClick={() => {
                    const subHeader = new fabric.Textbox("Add a Subheading", { left: 100, top: 150, fontSize: 24, fontWeight: "600", fill: "black" });
                    fabricCanvasRef.current.add(subHeader).setActiveObject(subHeader);
                    saveState(fabricCanvasRef.current);
                  }}
                  className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow text-base font-semibold"
                >
                  Add Subheading
                </button>
                <button
                  onClick={() => {
                    const bodyText = new fabric.Textbox("Add body text", { left: 100, top: 200, fontSize: 16, fontWeight: "normal", fill: "black", width: 300 });
                    fabricCanvasRef.current.add(bodyText).setActiveObject(bodyText);
                    saveState(fabricCanvasRef.current);
                  }}
                  className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow text-sm"
                >
                  Add Body Text
                </button>
              </div>

              {selectedObj?.type === "textbox" && (
                <>
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="Edit selected text..." />
                  <div className="flex gap-2 mb-2">
                    <input type="color" onChange={(e) => setTextStyle("fill", e.target.value)} className="w-10 h-10 rounded-md" />
                    <input type="number" min="8" max="200" defaultValue={selectedObj.fontSize || 16} onBlur={(e) => setTextStyle("fontSize", parseInt(e.target.value, 10))} className="border p-1 rounded w-20" />
                    <button onClick={() => setTextStyle("fontWeight", !(selectedObj.fontWeight === "bold"))} className="px-2 py-1 bg-gray-100 rounded">B</button>
                    <button onClick={() => setTextStyle("fontStyle", selectedObj.fontStyle !== "italic")} className="px-2 py-1 bg-gray-100 rounded">I</button>
                    <button onClick={() => setTextStyle("underline", !selectedObj.underline)} className="px-2 py-1 bg-gray-100 rounded">U</button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="text-sm">Align:</label>
                    <button onClick={() => setTextStyle("textAlign", "left")} className="px-2 py-1 bg-gray-100 rounded">L</button>
                    <button onClick={() => setTextStyle("textAlign", "center")} className="px-2 py-1 bg-gray-100 rounded">C</button>
                    <button onClick={() => setTextStyle("textAlign", "right")} className="px-2 py-1 bg-gray-100 rounded">R</button>
                    <label className="ml-2 text-sm">Line:</label>
                    <input type="number" step="0.1" min="0.5" max="3" defaultValue={selectedObj?.lineHeight || 1.2} onBlur={(e) => setTextStyle("lineHeight", parseFloat(e.target.value))} className="w-20 border p-1 rounded" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Shapes */}
          {activePanel === "shapes" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">Shapes</h2>
              <div className="flex flex-col gap-2 mb-4">
                <button onClick={() => addShape("rect")} className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg shadow">Rectangle</button>
                <button onClick={() => addShape("circle")} className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg shadow">Circle</button>
                <button onClick={() => addShape("triangle")} className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg shadow">Triangle</button>
              </div>

              <div className="mt-2">
                <label className="block text-sm mb-1">Fill color</label>
                <input type="color" onChange={(e) => setObjectFill(e.target.value)} />
              </div>
              <div className="mt-2">
                <label className="block text-sm mb-1">Stroke color</label>
                <input type="color" onChange={(e) => setObjectStroke(e.target.value, 2)} />
              </div>
              <div className="mt-2 flex gap-2">
                <button onClick={toggleLock} className="px-3 py-2 bg-gray-100 rounded">Lock/Unlock</button>
                <button onClick={deleteSelected} className="px-3 py-2 bg-red-100 rounded">Delete</button>
              </div>
            </div>
          )}

          {/* Background */}
          {activePanel === "background" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">Background</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Choose a Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {["#ffffff", "#f87171", "#60a5fa", "#34d399", "#facc15", "#f472b6"].map((color, i) => (
                    <button key={i} type="button" className="w-8 h-8 rounded-md border shadow-sm focus:outline-none" style={{ backgroundColor: color }} onClick={() => {
                      const canvas = fabricCanvasRef.current;
                      canvas.setBackgroundImage(null, () => {
                        canvas.setBackgroundColor(color, () => {
                          canvas.requestRenderAll();
                          saveState(canvas);
                        });
                      });
                    }} />
                  ))}
                  <input type="color" onChange={(e) => {
                    const canvas = fabricCanvasRef.current;
                    canvas.setBackgroundImage(null, () => {
                      canvas.setBackgroundColor(e.target.value, () => {
                        canvas.requestRenderAll();
                        saveState(canvas);
                      });
                    });
                  }} className="w-10 h-10 rounded-md cursor-pointer border" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Upload a Background Image</label>
                <div onClick={() => document.getElementById("bgUploadInput").click()} className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition">
                  <ImageIcon className="w-8 h-8 text-gray-500 mb-1" />
                  <p className="text-sm text-gray-600">Click to upload background</p>
                  <input id="bgUploadInput" type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
                </div>
              </div>
              <button onClick={() => handleResetBackground()} className="w-full mt-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow">Reset Background</button>
            </div>
          )}

          {/* Canvas Size */}
          {activePanel === "canvasSize" && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 capitalize">Canvas Size</h2>
              <div className="flex flex-col gap-2">
                <button onClick={() => setCanvasSize(800, 1200)} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow">Poster (800 × 1200)</button>
                <button onClick={() => setCanvasSize(1000, 700)} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow">Brochure (1000 × 700)</button>
                <button onClick={() => setCanvasSize(350, 200)} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow">Calling Card (350 × 200)</button>
                <div className="mt-3">
                  <label className="block text-sm mb-1">Custom Size</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Width" className="w-1/2 border rounded p-1" onChange={(e) => {
                      const w = parseInt(e.target.value, 10);
                      if (w > 0) setCanvasSize(w, fabricCanvasRef.current.getHeight());
                    }} />
                    <input type="number" placeholder="Height" className="w-1/2 border rounded p-1" onChange={(e) => {
                      const h = parseInt(e.target.value, 10);
                      if (h > 0) setCanvasSize(fabricCanvasRef.current.getWidth(), h);
                    }} />
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
        <div className="flex flex-wrap items-center justify-between gap-1 bg-white rounded-2xl shadow-md p-2 md:p-3 mb-4">
          <div className="space-x-2">
            <button onClick={handleUndo} className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm"><Undo2 /></button>
            <button onClick={handleRedo} className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm"><Redo2 /></button>
            <div className="inline-block">
              <button onClick={() => handleSave("png")} className="px-3 md:px-4 py-1 md:py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg shadow mr-2">Save PNG</button>
              <button onClick={() => handleSave("jpeg")} className="px-3 md:px-4 py-1 md:py-2 bg-yellow-200 hover:bg-yellow-300 text-black font-medium rounded-lg shadow mr-2">Save JPG</button>
              <button onClick={() => handleSave("svg")} className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow mr-2">Save SVG</button>
              <button onClick={() => handleSave("pdf")} className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow">Save PDF</button> 
            </div>
          </div>

          {/* Text Tools (always visible, but disabled if no textbox selected) */}
          <div className="flex items-center gap-1">
            <select disabled={!selectedObj || selectedObj.type !== "textbox"} value={selectedObj?.fontFamily || "Arial"} onChange={(e) => handleFontChange(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
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
            <input type="number" min="20" max="2000" disabled={!selectedObj} value={selectedSize.width} onChange={(e) => handleResize("width", parseInt(e.target.value, 10))} className="w-20 px-2 py-1 border rounded-lg disabled:bg-gray-200 disabled:text-gray-400" />
            <label className="text-sm">H</label>
            <input type="number" min="20" max="2000" disabled={!selectedObj} value={selectedSize.height} onChange={(e) => handleResize("height", parseInt(e.target.value, 10))} className="w-20 px-2 py-1 border rounded-lg disabled:bg-gray-200 disabled:text-gray-400" />
          </div>

          <button className="px-4 md:px-5 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">Confirm Design</button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center bg-white rounded-2xl shadow-md overflow-auto relative">
         <div className="flex flex-col gap-4 mt-4 items-center">
                {/* Render all canvases stacked vertically */}
                {canvases.map((c, index) => (
                  <div
                    key={c.id}
                    className="border rounded-lg bg-white p-2 shadow-md"
                  >
                    <canvas
                      id={`canvas-${c.id}`}
                      ref={index === 0 ? canvasRef : null} 
                      width={700}
                      height={500}
                      className="rounded-lg"
                    />
                  </div>
                ))}

                {/* Add Canvas button at the bottom */}
                <button
                  onClick={() => setCanvases((prev) => [...prev, { id: prev.length + 1 }])}
                  className="px-4 py-2 bg-gray-200 text-black-200 rounded-lg shadow hover:bg-gray-400"
                >
                  +
                </button>
              </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg shadow mt-2 mb-2">
            <button onClick={() => handleZoom(0.9)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"><ZoomOut /></button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <button onClick={() => handleZoom(1.1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"><ZoomIn /></button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      {/* Confirm modal (simple) */}
      {confirmResetVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setConfirmResetVisible(false)} />
          <div className="bg-white p-6 rounded shadow-lg z-50 w-80">
            <h3 className="font-semibold mb-2">Reset Background?</h3>
            <p className="text-sm mb-4">This will clear the background image and revert to the default color.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => confirmReset(false)} className="px-3 py-1 rounded bg-gray-100">Cancel</button>
              <button onClick={() => confirmReset(true)} className="px-3 py-1 rounded bg-red-500 text-white">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customization;
