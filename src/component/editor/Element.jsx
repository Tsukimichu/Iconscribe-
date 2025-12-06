// ----------------------------
// src/components/Editor/Element.jsx
// ----------------------------
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useEditor } from "../../context/EditorContext";
import { RotateCw } from "lucide-react";

// ==============================================
// 🎨 SUB-COMPONENT RENDERERS
// ==============================================

// 1. SVG PATHS (Waves, Blobs, Icons)
function PathRenderer({ element }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${element.width} ${element.height}`}
      style={{ overflow: "visible" }}
    >
      <path
        d={element.pathData || element.d} // Support both keys
        fill={element.fill}
        stroke={element.stroke || "none"}
        strokeWidth={element.strokeWidth || 0}
        // REMOVED: opacity={element.opacity} (Applied at container level now)
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// 2. SHAPES (Rectangles, Circles)
function ShapeRenderer({ element }) {
  if (element.type === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: element.fill,
          borderRadius: "50%",
          border: element.stroke ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
          // REMOVED: opacity (Applied at container level now)
        }}
      />
    );
  }

  // Default to Rectangle
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: element.fill,
        borderRadius: element.borderRadius || element.rx || 0,
        border: element.stroke ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
        // REMOVED: opacity (Applied at container level now)
      }}
    />
  );
}

// 3. TEXT (Textbox)
function TextRenderer({ element }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start", // Text usually starts at top-left
        justifyContent: element.textAlign === "center" ? "center" : 
                        element.textAlign === "right" ? "flex-end" : "flex-start",
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight || "normal",
        fontStyle: element.fontStyle || "normal",
        color: element.fill,
        lineHeight: element.lineHeight || 1.2,
        whiteSpace: "pre-wrap", // Preserves newlines
        userSelect: "none", // Prevents highlighting text while dragging element
      }}
    >
      {element.text}
    </div>
  );
}

// 4. IMAGES (Standard & Masked)
function ImageRenderer({ element }) {
  if (element.type === "maskedImage") {
    const radius = Math.min(element.width, element.height) / 2;
    return (
      <svg width="100%" height="100%" style={{ overflow: "hidden" }}>
        <defs>
          <clipPath id={`clip-${element.id}`}>
            <circle cx={element.width / 2} cy={element.height / 2} r={radius} />
          </clipPath>
        </defs>
        <image
          href={element.src}
          width="100%"
          height="100%"
          clipPath={`url(#clip-${element.id})`}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    );
  }

  // Standard Image
  return (
    <img
      src={element.src}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: element.borderRadius || 0,
        pointerEvents: "none", // Let clicks pass through to container
      }}
      draggable={false}
    />
  );
}

// ==============================================
// 📦 MAIN WRAPPER COMPONENT
// ==============================================

export default function Element({ element, zoom = 1, fitZoom = 1 }) {
  const { updateElement, selectElement, state } = useEditor();
  const selected = state.selectedId === element.id;

  // Calculate actual scale based on zoom levels
  const totalScale = Math.max(0.0001, zoom * fitZoom);

  // Safety checks for dimensions
  const safeWidth = Math.max(1, Number(element.width) || 100);
  const safeHeight = Math.max(1, Number(element.height) || 100);

  // Local state for smooth dragging (bypassing React render lag)
  const [livePos, setLivePos] = useState({
    x: Number(element.x) || 0,
    y: Number(element.y) || 0,
  });

  const [rotation, setRotation] = useState(Number(element.rotation) || 0);
  const draggingRef = useRef(false);
  const rotateRef = useRef(null);

  // Sync with global state when not dragging
  useEffect(() => {
    if (!draggingRef.current) {
      setLivePos({ x: Number(element.x) || 0, y: Number(element.y) || 0 });
    }
  }, [element.x, element.y]);

  useEffect(() => {
    setRotation(Number(element.rotation) || 0);
  }, [element.rotation]);

  // --- HANDLERS ---

  const onDragStart = () => {
    draggingRef.current = true;
    selectElement(element.id);
  };

  const onDrag = (e, d) => {
    setLivePos({ x: d.x, y: d.y });
  };

  const onDragStop = (e, d) => {
    draggingRef.current = false;
    // Only update DB/Context on stop to save performance
    updateElement(element.id, { x: d.x, y: d.y });
  };

  const onResizeStop = (e, dir, ref, delta, pos) => {
    updateElement(element.id, {
      width: parseFloat(ref.style.width),
      height: parseFloat(ref.style.height),
      ...pos,
    });
  };

  // Rotation Logic
  const startRotate = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const rect = rotateRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const onMove = (ev) => {
      const radians = Math.atan2(ev.clientY - cy, ev.clientX - cx);
      // Add 90deg because 0deg is usually 3 o'clock in Math.atan2, but we want 12 o'clock
      const deg = (radians * 180) / Math.PI + 90; 
      setRotation(deg);
    };

    const onUp = () => {
      updateElement(element.id, { rotation });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <Rnd
      size={{ width: safeWidth, height: safeHeight }}
      position={{ x: livePos.x, y: livePos.y }}
      scale={totalScale}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      // Only show resize handles when selected
      disableDragging={element.selectable === false || element.locked}
      enableResizing={
        selected && !element.locked && element.selectable !== false
          ? {
              bottomRight: true,
              bottomLeft: true,
              topRight: true,
              topLeft: true,
            }
          : false
      }
      style={{
        zIndex: element.zIndex ?? 1,
        // Allow clicks to pass through if not selectable (for backgrounds)
        pointerEvents: element.selectable === false ? "none" : "auto",
        touchAction: "none",
      }}
      // Custom Handle Classes for Professional Look
      resizeHandleClasses={{
        bottomRight: "w-3 h-3 bg-white border border-blue-500 rounded-full shadow-sm",
        bottomLeft: "w-3 h-3 bg-white border border-blue-500 rounded-full shadow-sm",
        topRight: "w-3 h-3 bg-white border border-blue-500 rounded-full shadow-sm",
        topLeft: "w-3 h-3 bg-white border border-blue-500 rounded-full shadow-sm",
      }}
    >
      <div
        ref={rotateRef}
        className="relative w-full h-full group"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
          // Visual selection indicator
          outline: selected ? "2px solid #3b82f6" : "none",
          
          // ⭐ FIXED: Apply opacity here to the main container
          opacity: element.opacity ?? 1, 
        }}
      >
        {/* === RENDER CONTENT BASED ON TYPE === */}
        
        {element.type === "path" && <PathRenderer element={element} />}
        
        {(element.type === "rect" || element.type === "circle" || element.type === "line") && (
          <ShapeRenderer element={element} />
        )}
        
        {(element.type === "text" || element.type === "textbox") && (
           <TextRenderer element={element} />
        )}

        {(element.type === "image" || element.type === "maskedImage") && (
           <ImageRenderer element={element} />
        )}

        {/* === ROTATION HANDLE (Only when selected) === */}
        {selected && !element.locked && (
          <div
            className="absolute left-1/2 -top-10 -translate-x-1/2 cursor-grab active:cursor-grabbing group"
            onMouseDown={startRotate}
          >
            <div className="p-1.5 bg-white border border-blue-200 rounded-full shadow-md text-blue-500 hover:bg-blue-50 transition-colors">
               <RotateCw size={14} />
            </div>
            {/* Connector Line */}
            <div className="w-px h-4 bg-blue-400 absolute left-1/2 top-full -translate-x-1/2"></div>
          </div>
        )}
      </div>
    </Rnd>
  );
}