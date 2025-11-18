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

  // ⭐ ABSOLUTE SAFETY CHECKS — prevent react-rnd crash
  const safeWidth = Number(element.width) > 0 ? Number(element.width) : 1;
  const safeHeight = Number(element.height) > 0 ? Number(element.height) : 1;

  const scale = Math.max(0.0001, zoom * fitZoom);
  const [rotation, setRotation] = useState(element.rotation || 0);
  const [livePos, setLivePos] = useState({
    x: Number(element.x) || 0,
    y: Number(element.y) || 0,
  });

  const draggingRef = useRef(false);
  const rotateRef = useRef(null);

  useEffect(() => {
    if (!draggingRef.current) {
      setLivePos({
        x: Number(element.x) || 0,
        y: Number(element.y) || 0,
      });
    }
  }, [element.x, element.y]);

  // Sync rotation
  useEffect(() => setRotation(element.rotation ?? 0), [element.rotation]);

  // ---------------- DRAGGING ----------------
  const onDrag = (e, d) => {
    draggingRef.current = true;
    setLivePos({ x: d.x, y: d.y });
  };

  const onDragStop = (e, d) => {
    draggingRef.current = false;
    updateElement(element.id, {
      x: Number(d.x),
      y: Number(d.y),
    });
  };

  // ---------------- RESIZING ----------------
  const onResize = (e, dir, ref, delta, pos) => {
    setLivePos({
      x: Number(pos.x),
      y: Number(pos.y),
    });
  };

  const onResizeStop = (e, dir, ref, delta, pos) => {
    let newW = Number(ref.style.width);
    let newH = Number(ref.style.height);

    // Safe fallback
    if (!newW || newW <= 0) newW = 1;
    if (!newH || newH <= 0) newH = 1;

    updateElement(element.id, {
      width: newW,
      height: newH,
      x: Number(pos.x),
      y: Number(pos.y),
    });
  };

  // ---------------- ROTATION ----------------
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

  return (
    <Rnd
      size={{
        width: safeWidth,   // SAFE
        height: safeHeight, // SAFE
      }}
      position={{
        x: Number(livePos.x) || 0,
        y: Number(livePos.y) || 0,
      }}
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
      style={{
        zIndex: element.zIndex ?? 1,
        opacity: element.opacity ?? 1,
        outline: selected ? "2px solid rgba(59,130,246,0.9)" : "none",
        boxShadow: selected ? "0 6px 18px rgba(59,130,246,0.08)" : undefined,
        touchAction: "none",
        overflow: "visible",
      }}
    >
      <div
        ref={rotateRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
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
          />
        )}
      </div>
    </Rnd>
  );
}
