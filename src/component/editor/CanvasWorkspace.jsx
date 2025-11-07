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

  // 🔄 Auto-fit canvas to container (maintain aspect ratio)
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const scale = Math.min(
        (container.width * 0.9) / canvasWidth,
        (container.height * 0.9) / canvasHeight
      );
      setFitZoom(scale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasWidth, canvasHeight]);

  // ⌨️ Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const selected = state.elements.find((el) => el.id === state.selectedId);
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          undo();
        } else if (e.key === "y") {
          e.preventDefault();
          redo();
        } else if (e.key === "d" && selected) {
          e.preventDefault();
          const clone = {
            ...selected,
            id: crypto.randomUUID(),
            x: selected.x + 20,
            y: selected.y + 20,
          };
          setElements([...state.elements, clone]);
        } else if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          setZoom((z) => Math.min(3, z + 0.1));
        } else if (e.key === "-") {
          e.preventDefault();
          setZoom((z) => Math.max(0.25, z - 0.1));
        }
      }
      if (e.key === "Delete" && state.selectedId) {
        e.preventDefault();
        deleteElement(state.selectedId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state]);

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
      // vertical alignment
      if (Math.abs(selected.x - other.x) < 5) vGuide = other.x;
      if (
        Math.abs(
          selected.x + selected.width / 2 - (other.x + other.width / 2)
        ) < 5
      )
        vGuide = other.x + other.width / 2;

      // horizontal alignment
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
        backgroundSize: `${20}px ${20}px`,
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
      }
    : {};

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gray-50"
    >
      {/* Toolbar */}
      <div className="absolute top-2 left-2 flex gap-2 z-20">
        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
          className="px-2 py-1 text-sm bg-blue-200 text-black rounded hover:bg-blue-300"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))}
          className="px-2 py-1 text-sm bg-blue-200 text-black rounded hover:bg-blue-300"
        >
          -
        </button>
        <button
          onClick={() => setShowGrid((s) => !s)}
          className="px-2 py-1 text-sm bg-blue-200 text-black rounded hover:bg-blue-300"
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-1 text-sm bg-blue-200 text-black rounded hover:bg-blue-300"
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
        {/* Canvas Area */}
        <div
          id="canvas-area"
          ref={canvasRef}
          className="relative bg-white border border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            ...gridStyle,
          }}
        >
          {state.elements.map((el) => (
            <Element key={el.id} element={el} zoom={totalZoom} />
          ))}

          {/* Guides */}
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
      <div className="absolute bottom-2 right-2 bg-white/80 text-xs text-black px-2 py-1 rounded shadow">
        {canvasWidth}×{canvasHeight}px • Zoom: {(totalZoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}
