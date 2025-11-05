import React, { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import fabric from "fabric";

const CanvasEditor = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const historyLock = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    canvasEl.id = "design-canvas";
    container.innerHTML = "";
    container.appendChild(canvasEl);

    const canvas = new fabric.Canvas("design-canvas", {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });

    canvasRef.current = canvas;

    const resizeCanvas = () => {
      canvas.setWidth(container.clientWidth - 20);
      canvas.setHeight(container.clientHeight - 20);
      canvas.renderAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const saveState = () => {
      if (historyLock.current) return;
      undoStack.current.push(canvas.toJSON());
      redoStack.current = [];
    };

    canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    canvas.on("object:removed", saveState);

    saveState();

    const handleKeyDown = (e) => {
      const active = canvas.getActiveObjects();

      if (["Delete", "Backspace"].includes(e.key)) {
        if (active.length > 0 && !active.some(o => o.isEditing)) {
          active.forEach(o => canvas.remove(o));
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, []);

  const undo = () => {
    const canvas = canvasRef.current;
    if (undoStack.current.length > 1) {
      historyLock.current = true;
      redoStack.current.push(undoStack.current.pop());
      const prev = undoStack.current[undoStack.current.length - 1];
      canvas.loadFromJSON(prev, () => {
        canvas.renderAll();
        historyLock.current = false;
      });
    }
  };

  const redo = () => {
    const canvas = canvasRef.current;
    if (redoStack.current.length > 0) {
      historyLock.current = true;
      const state = redoStack.current.pop();
      undoStack.current.push(state);
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        historyLock.current = false;
      });
    }
  };

  const saveStateManual = () => undoStack.current.push(canvasRef.current.toJSON());

  useImperativeHandle(ref, () => ({
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
      canvas.add(new fabric.Rect({
        left: 150,
        top: 150,
        width: 120,
        height: 80,
        fill: "#60a5fa",
      }));
      canvas.renderAll();
    },

    addCircle() {
      const canvas = canvasRef.current;
      canvas.add(new fabric.Circle({
        left: 200,
        top: 150,
        radius: 50,
        fill: "#22c55e",
      }));
      canvas.renderAll();
    },

    uploadImage(file) {
      const canvas = canvasRef.current;
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          img.scaleToWidth(300);
          img.set({ left: 100, top: 100 });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    },

    changeColor(color) {
      const canvas = canvasRef.current;
      const obj = canvas.getActiveObject();
      if (obj) {
        obj.set("fill", color);
        canvas.renderAll();
      }
    },

    deleteSelected() {
      const canvas = canvasRef.current;
      canvas.getActiveObjects().forEach(o => canvas.remove(o));
      canvas.discardActiveObject();
      canvas.renderAll();
    },

    exportPNG() {
      const dataURL = canvasRef.current.toDataURL({ format: "png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "design.png";
      link.click();
    },

    undo,
    redo,

    zoomIn() {
      const canvas = canvasRef.current;
      canvas.setZoom(canvas.getZoom() * 1.1);
      canvas.renderAll();
    },

    zoomOut() {
      const canvas = canvasRef.current;
      canvas.setZoom(canvas.getZoom() / 1.1);
      canvas.renderAll();
    },

    resetZoom() {
      const canvas = canvasRef.current;
      canvas.setZoom(1);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.renderAll();
    },
  }));

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center w-full h-full bg-gray-100 overflow-hidden border border-gray-300 rounded-md shadow-inner"
    />
  );
});

export default CanvasEditor;
