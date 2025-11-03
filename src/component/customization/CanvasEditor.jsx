import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import * as fabric from "fabric";

const CanvasEditor = forwardRef((_, ref) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // Initialize Fabric canvas
  useEffect(() => {
    const c = new fabric.Canvas(canvasRef.current, {
      height: 500,
      width: 800,
      backgroundColor: "#f8fafc",
    });
    setCanvas(c);
    return () => c.dispose();
  }, []);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addText: () => {
      if (!canvas) return;
      const text = new fabric.IText("Edit me", {
        left: 100,
        top: 100,
        fill: "#111827",
        fontSize: 24,
      });
      canvas.add(text).setActiveObject(text);
    },
    addShape: () => {
      if (!canvas) return;
      const rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: "#3b82f6",
        left: 150,
        top: 150,
      });
      canvas.add(rect).setActiveObject(rect);
    },
    addImage: (url) => {
      if (!canvas) return;
      fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(300);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
      });
    },
    deleteActive: () => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (active) canvas.remove(active);
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300 rounded-lg shadow-md mt-4"
    />
  );
});

export default CanvasEditor;
