// src/components/Editor/CanvasWorkspace.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useEditor } from "../../context/EditorContext";
import Element from "./Element";
import { 
  Minus, 
  Plus, 
  Grid3X3, 
  Scan,
  Monitor
} from "lucide-react";

// --- STYLES ---
const controlPillClass = "flex items-center gap-1 bg-white/90 backdrop-blur-xl border border-slate-300 shadow-sm rounded-full p-1.5 transition-all hover:shadow-md";
const iconBtnClass = "p-2 rounded-full text-slate-600 hover:text-blue-700 hover:bg-blue-100 transition-colors active:scale-95 active:bg-blue-200";

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

  // --------------------------------------------------------
  // 🔄 Auto-fit Logic
  // --------------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();

      const marginX = container.width * 0.10; 
      const marginY = container.height * 0.15;

      const availableWidth = container.width - marginX;
      const availableHeight = container.height - marginY;

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

  // --------------------------------------------------------
  // ⌨️ Keyboard Shortcuts
  // --------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      const selected = state.elements.find((el) => el.id === state.selectedId);
      const key = e.key.toLowerCase();

      if (e.ctrlKey || e.metaKey) {
        switch (key) {
          case "z": e.preventDefault(); undo(); return;
          case "y": e.preventDefault(); redo(); return;
          case "d": 
            if (selected) {
              e.preventDefault();
              const clone = { ...selected, id: crypto.randomUUID(), x: selected.x + 20, y: selected.y + 20 };
              setElements([...state.elements, clone]);
            }
            return;
          case "+": case "=": e.preventDefault(); setZoom((z) => Math.min(3, z + 0.1)); return;
          case "-": e.preventDefault(); setZoom((z) => Math.max(0.25, z - 0.1)); return;
        }
      }

      if ((key === "delete" || key === "backspace") && state.selectedId) {
        e.preventDefault(); deleteElement(state.selectedId);
      }

      if (selected && ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let { x, y } = selected;
        if (key === "arrowup") y -= step;
        if (key === "arrowdown") y += step;
        if (key === "arrowleft") x -= step;
        if (key === "arrowright") x += step;
        setElements(state.elements.map((el) => el.id === selected.id ? { ...el, x, y } : el));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, undo, redo, deleteElement, setElements]);

  // --------------------------------------------------------
  // 🧭 Guides Logic
  // --------------------------------------------------------
  useEffect(() => {
    if (!state.selectedId) {
      setGuides({ vertical: null, horizontal: null });
      return;
    }
    const selected = state.elements.find((el) => el.id === state.selectedId);
    if (!selected) return;

    let vGuide = null;
    let hGuide = null;

    for (const other of state.elements) {
      if (other.id === selected.id) continue;
      if (Math.abs(selected.x - other.x) < 5) vGuide = other.x;
      if (Math.abs(selected.x + selected.width / 2 - (other.x + other.width / 2)) < 5) vGuide = other.x + other.width / 2;
      if (Math.abs(selected.y - other.y) < 5) hGuide = other.y;
      if (Math.abs(selected.y + selected.height / 2 - (other.y + other.height / 2)) < 5) hGuide = other.y + other.height / 2;
    }
    setGuides({ vertical: vGuide, horizontal: hGuide });
  }, [state.selectedId, state.elements]);

  // --------------------------------------------------------
  // 🧩 Grid Style
  // --------------------------------------------------------
  const gridStyle = showGrid
    ? {
        backgroundSize: `24px 24px`,
        // Use STANDARD RGBA to avoid 'oklab' crash in html2canvas
        backgroundImage:
          "linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
      }
    : {};

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      // Use standard HEX here for the workspace background to be safe
      style={{ backgroundColor: "#e2e8f0" }} 
    >
      {/* 🎨 Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
            backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
        }}
      />

      {/* ================= CANVAS WRAPPER ================= */}
      <div
        className="relative origin-center transition-transform duration-300 ease-out flex items-center justify-center will-change-transform"
        style={{ transform: `scale(${totalZoom})` }}
      >
        {/* Main Canvas Area */}
        {/* CRITICAL FIX: 
            We removed Tailwind shadow/border classes here because they resolve to 'oklab' colors 
            in modern Tailwind configurations. html2canvas crashes on 'oklab'.
            We use standard inline styles for shadow and border instead.
        */}
        <div
          id="canvas-area"
          ref={canvasRef}
          className="relative bg-white overflow-hidden"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            // Hardcoded standard CSS Shadow (RGBA)
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            // Hardcoded standard Border
            border: "1px solid #cbd5e1",
            ...gridStyle,
          }}
        >
          {/* Render Elements */}
          {state.elements.map((el) => (
            <Element key={el.id} element={el} zoom={totalZoom} />
          ))}

          {/* Alignment Guides */}
          {guides.vertical && (
            <div
              className="absolute bg-pink-500 w-[1px] h-full pointer-events-none z-[999]"
              style={{ left: `${guides.vertical}px` }}
            />
          )}
          {guides.horizontal && (
            <div
              className="absolute bg-pink-500 h-[1px] w-full pointer-events-none z-[999]"
              style={{ top: `${guides.horizontal}px` }}
            />
          )}
        </div>
      </div>

      {/* ================= FLOATING BOTTOM DECK ================= */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 z-30 select-none">
        
        {/* Zoom Controls */}
        <div className={controlPillClass}>
            <button onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))} className={iconBtnClass} title="Zoom Out">
                <Minus size={18} />
            </button>
            
            <div className="w-12 text-center text-sm font-bold text-slate-700 tabular-nums">
                {(totalZoom * 100).toFixed(0)}%
            </div>
            
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className={iconBtnClass} title="Zoom In">
                <Plus size={18} />
            </button>
        </div>

        {/* View Options */}
        <div className={controlPillClass}>
            <button 
                onClick={() => setZoom(1)} 
                className={iconBtnClass} 
                title="Fit to Screen"
            >
                <Scan size={18} />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-0.5"></div>
            <button 
                onClick={() => setShowGrid((s) => !s)} 
                className={`${iconBtnClass} ${showGrid ? 'text-blue-600 bg-blue-50' : ''}`}
                title="Toggle Grid"
            >
                <Grid3X3 size={18} />
            </button>
        </div>

        {/* Canvas Info */}
        <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-300 rounded-full px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
             <Monitor size={14} className="text-slate-400" />
             {canvasWidth} × {canvasHeight} px
        </div>
      </div>
    </div>
  );
}