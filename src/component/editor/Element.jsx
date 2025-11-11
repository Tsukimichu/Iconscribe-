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

  const scale = Math.max(0.0001, zoom * fitZoom);
  const [rotation, setRotation] = useState(element.rotation || 0);
  const [livePos, setLivePos] = useState({ x: element.x, y: element.y });
  const draggingRef = useRef(false);
  const rotateRef = useRef(null);

  useEffect(() => setRotation(element.rotation ?? 0), [element.rotation]);

  useEffect(() => {
    if (!draggingRef.current) setLivePos({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  // Keyboard shortcut: Shift + R = rotate 15°
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

  // ---------------- Dragging ----------------
  const onDrag = (e, d) => {
    draggingRef.current = true;
    setLivePos({ x: d.x, y: d.y });
  };

  const onDragStop = (e, d) => {
    draggingRef.current = false;
    // ❌ remove Math.max(0, d.x/y) so element can move beyond canvas
    updateElement(element.id, { x: d.x, y: d.y });
  };

  // ---------------- Resizing ----------------
  const onResize = (e, dir, ref, delta, pos) => {
    const w = parseFloat(ref.style.width) || element.width;
    const h = parseFloat(ref.style.height) || element.height;
    setLivePos({ x: pos.x, y: pos.y });
  };

  const onResizeStop = (e, dir, ref, delta, pos) => {
    const w = parseFloat(ref.style.width) || element.width;
    const h = parseFloat(ref.style.height) || element.height;
    // ❌ remove Math.max(0, pos.x/y) to allow positioning beyond canvas
    updateElement(element.id, {
      width: Math.max(1, w),
      height: Math.max(1, h),
      x: pos.x,
      y: pos.y,
    });
  };

  // ---------------- Rotation ----------------
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

  const visiblePos = { x: livePos.x, y: livePos.y };

  return (
    <Rnd
      // ❌ remove bounds — allow free movement
      size={{ width: element.width, height: element.height }}
      position={visiblePos}
      scale={scale}
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
      dragHandleClassName={selected ? undefined : undefined}
      style={{
        zIndex: element.zIndex ?? 1,
        opacity: element.opacity ?? 1,
        outline: selected ? "2px solid rgba(59,130,246,0.9)" : "none",
        boxShadow: selected ? "0 6px 18px rgba(59,130,246,0.08)" : undefined,
        touchAction: "none",
        overflow: "visible", // allows rotation handle and selection ring outside
      }}
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

        {/* rotation handle (still visible outside clipping area) */}
        {selected && (
          <div
            className="absolute left-1/2 -top-6 w-5 h-5 bg-blue-600 rounded-full cursor-grab border border-white shadow-lg flex items-center justify-center"
            style={{ transform: "translateX(-50%)" }}
            onMouseDown={startRotate}
            onTouchStart={(e) => {
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
