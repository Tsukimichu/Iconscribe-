import React, { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import * as fabric from "fabric";

const CanvasEditor = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas element dynamically
    const canvasElement = document.createElement("canvas");
    canvasElement.id = "design-canvas";
    container.innerHTML = "";
    container.appendChild(canvasElement);

    // Initialize Fabric.js
    const canvas = new fabric.Canvas("design-canvas", {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });

    // Dynamic resizing
    const resizeCanvas = () => {
      canvas.setWidth(container.clientWidth - 20);
      canvas.setHeight(container.clientHeight - 20);
      canvas.renderAll();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvasRef.current = canvas;

    // --- Undo/Redo tracking ---
    const saveState = () => {
      const json = canvas.toJSON();
      undoStack.current.push(json);
      redoStack.current = [];
    };

    canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    saveState();

    // --- Keyboard shortcuts ---
    const handleKeyDown = (e) => {
      const activeObjs = canvas.getActiveObjects();

      // Delete selected (Backspace/Delete)
      if (["Delete", "Backspace"].includes(e.key)) {
        if (activeObjs.length > 0 && !activeObjs.some(o => o.isEditing)) {
          activeObjs.forEach((o) => canvas.remove(o));
          canvas.discardActiveObject();
          canvas.renderAll();
          saveState();
        }
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (undoStack.current.length > 1) {
          redoStack.current.push(undoStack.current.pop());
          const prev = undoStack.current[undoStack.current.length - 1];
          canvas.loadFromJSON(prev, () => canvas.renderAll());
        }
      }

      // Redo (Ctrl+Y)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (redoStack.current.length > 0) {
          const state = redoStack.current.pop();
          undoStack.current.push(state);
          canvas.loadFromJSON(state, () => canvas.renderAll());
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, []);

  // --- Public methods exposed to parent ---
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,

    addText() {
      const canvas = canvasRef.current;
      const text = new fabric.Textbox("Double-click to edit", {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: "#000",
      });
      canvas.add(text).setActiveObject(text);
      canvas.renderAll();
    },

    addRect() {
      const canvas = canvasRef.current;
      const rect = new fabric.Rect({
        left: 150,
        top: 150,
        width: 120,
        height: 80,
        fill: "#60a5fa",
      });
      canvas.add(rect).setActiveObject(rect);
      canvas.renderAll();
    },

    addCircle() {
      const canvas = canvasRef.current;
      const circle = new fabric.Circle({
        left: 200,
        top: 150,
        radius: 50,
        fill: "#22c55e",
      });
      canvas.add(circle).setActiveObject(circle);
      canvas.renderAll();
    },

    uploadImage(file) {
      const canvas = canvasRef.current;
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          img.scaleToWidth(300);
          img.set({ left: 100, top: 100 });
          canvas.add(img).setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    },

    changeColor(color) {
      const canvas = canvasRef.current;
      const obj = canvas.getActiveObject();
      if (obj && obj.set) {
        obj.set("fill", color);
        canvas.renderAll();
      }
    },

    deleteSelected() {
      const canvas = canvasRef.current;
      const objs = canvas.getActiveObjects();
      if (objs.length > 0) {
        objs.forEach(o => canvas.remove(o));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    },

    exportPNG() {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL({ format: "png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "design.png";
      link.click();
    },

    undo() {
      const canvas = canvasRef.current;
      if (undoStack.current.length > 1) {
        redoStack.current.push(undoStack.current.pop());
        const prev = undoStack.current[undoStack.current.length - 1];
        canvas.loadFromJSON(prev, () => canvas.renderAll());
      }
    },

    redo() {
      const canvas = canvasRef.current;
      if (redoStack.current.length > 0) {
        const next = redoStack.current.pop();
        undoStack.current.push(next);
        canvas.loadFromJSON(next, () => canvas.renderAll());
      }
    },

    zoomIn() {
      const canvas = canvasRef.current;
      canvas.setZoom(canvas.getZoom() * 1.1);
    },

    zoomOut() {
      const canvas = canvasRef.current;
      canvas.setZoom(canvas.getZoom() / 1.1);
    },

    resetZoom() {
      const canvas = canvasRef.current;
      canvas.setZoom(1);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    },
  }));

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center w-full h-full bg-gray-100 overflow-hidden border border-gray-300 rounded-md shadow-inner"
    >
      <div className="absolute text-gray-400 text-sm top-2 right-3 select-none">
        Canvas Editor
      </div>
    </div>
  );
});

export default CanvasEditor;
