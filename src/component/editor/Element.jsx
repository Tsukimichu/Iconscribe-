// ----------------------------
// src/components/Editor/Element.jsx
// ----------------------------
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import ShapeElement from "./ShapeElement";
import { useEditor } from "../../context/EditorContext";

export default function Element({ element, zoom = 1, fitZoom = 1 }) {
  const { updateElement, selectElement, state } = useEditor();
  const selected = state.selectedId === element.id;

  // combined visual scale used by CSS transform on the canvas wrapper
  const scale = Math.max(0.0001, zoom * fitZoom);

  // local states for UX (rotation, live drag pos)
  const [rotation, setRotation] = useState(element.rotation || 0);
  const [livePos, setLivePos] = useState({ x: element.x, y: element.y });
  const draggingRef = useRef(false);
  const rotateRef = useRef(null);

  // keep local rotation synced when external state changes (undo/redo, load)
  useEffect(() => setRotation(element.rotation ?? 0), [element.rotation]);

  // keep local livePos in sync unless user is currently dragging
  useEffect(() => {
    if (!draggingRef.current) setLivePos({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  // keyboard: Shift+R rotate 15°
  useEffect(() => {
    const onKey = (e) => {
      if (!selected) return;
      if (e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        const newRotation = (rotation + 15) % 360;
        updateElement(element.id, { rotation: newRotation });
        setRotation(newRotation);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, rotation, element.id, updateElement]);

  // ---------- Drag Handlers ----------
  // IMPORTANT: We're passing *unscaled* position/size to Rnd.
  // When `scale` prop is provided to Rnd, its callback d.x/d.y are also unscaled,
  // so we can use them directly as canvas coordinates.
  const onDrag = (e, d) => {
    // visual live update while dragging
    draggingRef.current = true;
    setLivePos({ x: d.x, y: d.y });
  };

  const onDragStop = (e, d) => {
    draggingRef.current = false;
    // d.x/d.y are unscaled canvas coords when `scale` prop is set to the visual scale
    updateElement(element.id, { x: Math.max(0, d.x), y: Math.max(0, d.y) });
  };

  // ---------- Resize Handlers ----------
  const onResize = (e, dir, ref, delta, pos) => {
    // live preview
    const w = parseFloat(ref.style.width) || element.width;
    const h = parseFloat(ref.style.height) || element.height;
    setLivePos({ x: pos.x, y: pos.y });
    // optionally show a live size somewhere if you like
  };

  const onResizeStop = (e, dir, ref, delta, pos) => {
    // ref.style.width/height are in px (unscaled) when Rnd has scale prop set
    const w = parseFloat(ref.style.width) || element.width;
    const h = parseFloat(ref.style.height) || element.height;
    updateElement(element.id, {
      width: Math.max(1, w),
      height: Math.max(1, h),
      x: Math.max(0, pos.x),
      y: Math.max(0, pos.y),
    });
  };

  // ---------- Rotation handle ----------
  const startRotate = (e) => {
    e.stopPropagation();
    const move = (ev) => {
      const rect = rotateRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radians = Math.atan2(ev.clientY - cy, ev.clientX - cx);
      const deg = (radians * 180) / Math.PI;
      setRotation(Math.round(deg));
    };
    const stop = () => {
      updateElement(element.id, { rotation });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseup", stop, { passive: true });
  };

  // visible position (live while dragging, otherwise from element)
  const visiblePos = {
    x: livePos.x,
    y: livePos.y,
  };

  return (
    <Rnd
      // Give Rnd the *unscaled* values. React-Rnd will handle the pointer math
      // correctly because we're telling it what the current scale is.
      bounds="#canvas-area"
      size={{ width: element.width, height: element.height }}
      position={visiblePos}
      scale={scale} // <-- critical: match the CSS visual scale (fitZoom*zoom)
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResize={onResize}
      onResizeStop={onResizeStop}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      enableResizing={{
        bottomRight: true,
        bottomLeft: true,
        topRight: true,
        topLeft: true,
      }}
      // small Rnd niceties
      dragHandleClassName={selected ? undefined : undefined}
      style={{
        zIndex: element.zIndex ?? 1,
        opacity: element.opacity ?? 1,
        outline: selected ? "2px solid rgba(59,130,246,0.9)" : "none",
        boxShadow: selected ? "0 6px 18px rgba(59,130,246,0.08)" : undefined,
        touchAction: "none", // helps mobile/pointer interactions
      }}
      // performance: avoid extra transforms by letting Rnd position normally
      enableUserSelectHack={false}
    >
      <div
        ref={rotateRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
          transition: draggingRef.current ? "none" : "transform 0.08s linear",
        }}
      >
        {element.type === "text" && <TextElement element={element} />}
        {element.type === "image" && <ImageElement element={element} />}
        {element.type === "shape" && <ShapeElement element={element} />}

        {selected && (
          <div
            className="absolute left-1/2 -top-6 w-5 h-5 bg-blue-600 rounded-full cursor-grab border border-white shadow-lg flex items-center justify-center"
            style={{ transform: "translateX(-50%)" }}
            onMouseDown={startRotate}
            onTouchStart={(e) => {
              // for touch: prevent default and start rotate like mouse
              e.preventDefault();
              startRotate(e);
            }}
            aria-hidden
          />
        )}
      </div>
    </Rnd>
  );
}
