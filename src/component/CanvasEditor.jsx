import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric  from "fabric";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const history = useRef([]);
  const historyIndex = useRef(-1);
  const isRestoring = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // ==================================================
  // 🧠 Initialize Fabric Canvas
  // ==================================================
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#fff",
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const saveIfChanged = () => {
      if (!isRestoring.current) saveHistory();
    };

    // Track relevant user changes
    canvas.on("object:added", saveIfChanged);
    canvas.on("object:modified", saveIfChanged);
    canvas.on("object:removed", saveIfChanged);

    // Save initial blank state
    saveHistory(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // ==================================================
  // 💾 Save History
  // ==================================================
  const saveHistory = useCallback((canvasInstance) => {
    const canvas = canvasInstance || fabricRef.current;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toDatalessJSON(["selectable", "evented"]));

    // Prevent redundant history entries
    if (history.current[historyIndex.current] === json) return;

    // Truncate redo history if we add new action after undo
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }

    history.current.push(json);
    historyIndex.current = history.current.length - 1;

    updateButtonState();
  }, []);

  // ==================================================
  // ⏪ Undo
  // ==================================================
  const handleUndo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || historyIndex.current <= 0) return;

    isRestoring.current = true;
    historyIndex.current -= 1;
    const prevState = history.current[historyIndex.current];

    canvas.loadFromJSON(prevState, () => {
      canvas.backgroundColor = "#fff";
      canvas.renderAll();
      isRestoring.current = false;
      updateButtonState();
    });
  }, []);

  // ==================================================
  // 🔁 Redo
  // ==================================================
  const handleRedo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || historyIndex.current >= history.current.length - 1) return;

    isRestoring.current = true;
    historyIndex.current += 1;
    const nextState = history.current[historyIndex.current];

    canvas.loadFromJSON(nextState, () => {
      canvas.backgroundColor = "#fff";
      canvas.renderAll();
      isRestoring.current = false;
      updateButtonState();
    });
  }, []);

  // ==================================================
  // 🧩 Add Shape
  // ==================================================
  const addShape = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100 + Math.random() * 200,
      top: 100 + Math.random() * 200,
      fill: "#3498db",
      width: 100,
      height: 100,
      rx: 10,
      ry: 10,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    saveHistory(canvas);
  }, [saveHistory]);

  // ==================================================
  // 🔤 Add Text
  // ==================================================
  const addText = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new fabric.IText("Edit me", {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: "#333",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveHistory(canvas);
  }, [saveHistory]);

  // ==================================================
  // 🧭 Update Undo/Redo Buttons
  // ==================================================
  const updateButtonState = () => {
    setCanUndo(historyIndex.current > 0);
    setCanRedo(historyIndex.current < history.current.length - 1);
  };

  // ==================================================
  // 🧹 Clear Canvas
  // ==================================================
  const clearCanvas = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#fff";
    saveHistory(canvas);
  };

  // ==================================================
  // 🖼️ Render
  // ==================================================
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={addShape}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Shape
        </button>
        <button
          onClick={addText}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Text
        </button>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`px-4 py-2 rounded ${
            canUndo ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-500"
          }`}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`px-4 py-2 rounded ${
            canRedo ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-500"
          }`}
        >
          Redo
        </button>
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #ccc",
          borderRadius: "8px",
          display: "block",
          marginTop: "1rem",
        }}
      />
    </div>
  );
};

export default CanvasEditor;
