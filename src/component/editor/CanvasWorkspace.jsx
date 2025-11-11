// ----------------------------
// src/components/Editor/CanvasWorkspace.jsx
// ----------------------------
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useEditor } from "../../context/EditorContext";
import Element from "./Element";

export default function CanvasWorkspace() {
  const { state, undo, redo, deleteElement, setElements } = useEditor();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [guides, setGuides] = useState({ vertical: null, horizontal: null });

  const canvasWidth = state?.canvas?.width ?? 1080;
  const canvasHeight = state?.canvas?.height ?? 1080;
  const totalZoom = useMemo(() => fitZoom * zoom, [fitZoom, zoom]);

  // 🔄 Responsive auto-fit for canvas
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();

      const marginX = container.width * 0.04;
      const marginY = container.height * 0.06;

      const availableWidth = container.width - marginX * 2;
      const availableHeight = container.height - marginY * 2;

      const scale = Math.min(
        availableWidth / canvasWidth,
        availableHeight / canvasHeight,
        1
      );

      setFitZoom(scale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasWidth, canvasHeight]);

  // ⌨️ Keyboard Shortcuts (Backspace + Move + Clone + Zoom + Undo/Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const selected = state.elements.find((el) => el.id === state.selectedId);
      const key = e.key.toLowerCase();

      // 🔁 Undo / Redo / Duplicate / Zoom shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (key) {
          case "z":
            e.preventDefault();
            undo();
            return;
          case "y":
            e.preventDefault();
            redo();
            return;
          case "d":
            if (selected) {
              e.preventDefault();
              const clone = {
                ...selected,
                id: crypto.randomUUID(),
                x: selected.x + 20,
                y: selected.y + 20,
              };
              setElements([...state.elements, clone]);
            }
            return;
          case "+":
          case "=":
            e.preventDefault();
            setZoom((z) => Math.min(3, z + 0.1));
            return;
          case "-":
            e.preventDefault();
            setZoom((z) => Math.max(0.25, z - 0.1));
            return;
        }
      }

      // 🗑️ Delete or Backspace removes selected element
      if ((key === "delete" || key === "backspace") && state.selectedId) {
        e.preventDefault();
        deleteElement(state.selectedId);
      }

      // ⬆️⬇️⬅️➡️ Arrow keys move element
      if (selected && ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let { x, y } = selected;
        if (key === "arrowup") y -= step;
        if (key === "arrowdown") y += step;
        if (key === "arrowleft") x -= step;
        if (key === "arrowright") x += step;
        setElements(
          state.elements.map((el) =>
            el.id === selected.id ? { ...el, x, y } : el
          )
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, undo, redo, deleteElement, setElements]);

  // 🧭 Smart Alignment Guides
  useEffect(() => {
    if (!state.selectedId) {
      setGuides({ vertical: null, horizontal: null });
      return;
    }

    const selected = state.elements.find((el) => el.id === state.selectedId);
    if (!selected) return;
    const others = state.elements.filter((el) => el.id !== selected.id);

    let vGuide = null,
      hGuide = null;
    for (const other of others) {
      if (Math.abs(selected.x - other.x) < 5) vGuide = other.x;
      if (
        Math.abs(
          selected.x + selected.width / 2 - (other.x + other.width / 2)
        ) < 5
      )
        vGuide = other.x + other.width / 2;

      if (Math.abs(selected.y - other.y) < 5) hGuide = other.y;
      if (
        Math.abs(
          selected.y + selected.height / 2 - (other.y + other.height / 2)
        ) < 5
      )
        hGuide = other.y + other.height / 2;
    }
    setGuides({ vertical: vGuide, horizontal: hGuide });
  }, [state.selectedId, state.elements]);

  // 🧩 Grid Background
  const gridStyle = showGrid
    ? {
        backgroundSize: `20px 20px`,
        backgroundImage:
          "linear-gradient(to right, #dbeafe 1px, transparent 1px), linear-gradient(to bottom, #dbeafe 1px, transparent 1px)",
      }
    : {};

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-auto bg-gradient-to-b from-blue-50 to-white transition-all"
    >
      {/* Toolbar */}
      <div className="absolute top-3 left-3 flex gap-2 z-20 bg-white/80 backdrop-blur-md px-3 py-2 rounded-lg shadow border border-blue-100">
        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
          className="px-2 py-1 text-sm bg-blue-100 text-black rounded hover:bg-blue-200"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))}
          className="px-2 py-1 text-sm bg-blue-100 text-black rounded hover:bg-blue-200"
        >
          -
        </button>
        <button
          onClick={() => setShowGrid((s) => !s)}
          className="px-2 py-1 text-sm bg-blue-100 text-black rounded hover:bg-blue-200"
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-1 text-sm bg-blue-100 text-black rounded hover:bg-blue-200"
        >
          Reset Zoom
        </button>
      </div>

      {/* Canvas Wrapper */}
      <div
        className="relative origin-center transition-transform duration-300 flex items-center justify-center"
        style={{
          transform: `scale(${totalZoom})`,
        }}
      >
        {/* Canvas Area — Canva-like clipping */}
        <div
          id="canvas-area"
          ref={canvasRef}
          className="relative bg-white border border-blue-200 shadow-[0_8px_30px_rgba(30,58,138,0.25)] transition-all duration-300 rounded-lg overflow-hidden"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            ...gridStyle,
            position: "relative",
            maskImage: "linear-gradient(black, black)",
            WebkitMaskImage: "linear-gradient(black, black)",
          }}
        >
          {state.elements.map((el) => (
            <Element key={el.id} element={el} zoom={totalZoom} />
          ))}

          {/* Alignment Guides */}
          {guides.vertical && (
            <div
              className="absolute bg-blue-500/70 w-[1px] h-full pointer-events-none"
              style={{ left: `${guides.vertical}px`, top: 0 }}
            />
          )}
          {guides.horizontal && (
            <div
              className="absolute bg-blue-500/70 h-[1px] w-full pointer-events-none"
              style={{ top: `${guides.horizontal}px`, left: 0 }}
            />
          )}
        </div>
      </div>

      {/* Overlay Info */}
      <div className="absolute bottom-3 right-3 bg-white/90 text-xs text-black px-2 py-1 rounded shadow-md border border-blue-100">
        {canvasWidth}×{canvasHeight}px • Zoom: {(totalZoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}
