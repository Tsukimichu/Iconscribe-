// ----------------------------
// src/components/Editor/Element.jsx
// ----------------------------
import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import ShapeElement from "./ShapeElement";
import { useEditor } from "../../context/EditorContext";

// 🟢 SVG PATH ELEMENT
function PathElement({ element }) {
  return (
    <svg
      width={element.width}
      height={element.height}
      viewBox={`0 0 ${element.width} ${element.height}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none"
      }}
    >
      <path
        d={element.d}
        fill={element.fill}
        stroke={element.stroke || "none"}
        strokeWidth={element.strokeWidth || 0}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// 🟢 CIRCULAR MASKED IMAGE
function ClippedImageElement({ element }) {
  const radius = Math.min(element.width, element.height) / 2;

  return (
    <svg
      width={element.width}
      height={element.height}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none"
      }}
    >
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

export default function Element({ element, zoom = 1, fitZoom = 1 }) {
  const { updateElement, selectElement, state } = useEditor();
  const selected = state.selectedId === element.id;

  const scale = Math.max(0.0001, zoom * fitZoom);

  const safeWidth = Math.max(1, Number(element.width) || 1);
  const safeHeight = Math.max(1, Number(element.height) || 1);

  useEffect(() => {
    if (element.width !== safeWidth || element.height !== safeHeight) {
      updateElement(element.id, { width: safeWidth, height: safeHeight });
    }
  }, []);

  const [rotation, setRotation] = useState(element.rotation || 0);
  const [livePos, setLivePos] = useState({
    x: Number(element.x) || 0,
    y: Number(element.y) || 0,
  });

  const draggingRef = useRef(false);
  const rotateRef = useRef(null);

  useEffect(() => {
    setRotation(Number(element.rotation) || 0);
  }, [element.rotation]);

  useEffect(() => {
    if (!draggingRef.current) {
      setLivePos({
        x: Number(element.x) || 0,
        y: Number(element.y) || 0,
      });
    }
  }, [element.x, element.y]);

  const onDrag = (e, d) => {
    draggingRef.current = true;
    setLivePos({ x: d.x, y: d.y });
  };

  const onDragStop = (e, d) => {
    draggingRef.current = false;
    updateElement(element.id, { x: d.x, y: d.y });
  };

  const onResize = (e, dir, ref, delta, pos) => {
    setLivePos({ x: pos.x, y: pos.y });
  };

  const onResizeStop = (e, dir, ref, delta, pos) => {
    const w = Math.max(1, parseFloat(ref.style.width) || 1);
    const h = Math.max(1, parseFloat(ref.style.height) || 1);

    updateElement(element.id, {
      width: w,
      height: h,
      x: pos.x,
      y: pos.y,
    });
  };

  // ⭐ FIXED ROTATION HANDLER
  const startRotate = (e) => {
    e.stopPropagation();

    const move = (ev) => {
      const rect = rotateRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radians = Math.atan2(ev.clientY - cy, ev.clientX - cx);
      const deg = (radians * 180) / Math.PI;
      setRotation(deg);
    };

    const stop = () => {
      updateElement(element.id, { rotation });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  return (
    <Rnd
      size={{ width: safeWidth, height: safeHeight }}
      position={{ x: livePos.x, y: livePos.y }}
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
        transform: "none",
        transformOrigin: "top left",
        zIndex: element.zIndex ?? 1,
        opacity: element.opacity ?? 1,
        outline: selected ? "2px solid rgba(59,130,246,0.9)" : "none",
        boxShadow: selected
          ? "0 6px 18px rgba(59,130,246,0.08)"
          : undefined,
        touchAction: "none",
        overflow: "visible",
      }}
      enableUserSelectHack={false}
    >
      <div
        ref={rotateRef}
        className="relative w-full h-full"
        style={{
          transform: `
            rotate(${rotation}deg)
            scaleX(${element.scaleX || 1})
            scaleY(${element.scaleY || 1})
          `,
          transformOrigin: "top left",
        }}
      >
        {/* TEXT */}
        {element.type === "text" && <TextElement element={element} />}

        {/* IMAGE */}
        {element.type === "image" && <ImageElement element={element} />}

        {/* SHAPE */}
        {element.type === "shape" && <ShapeElement element={element} />}

        {/* SVG PATH */}
        {element.type === "path" && <PathElement element={element} />}

        {/* MASKED IMAGE */}
        {element.type === "maskedImage" && (
          <ClippedImageElement element={element} />
        )}

        {/* ROTATION HANDLE */}
        {selected && (
          <div
            className="absolute left-1/2 -top-6 w-5 h-5 bg-blue-600 
             rounded-full cursor-grab border border-white shadow-lg"
            style={{ transform: "translateX(-50%)" }}
            onMouseDown={startRotate}
          />
        )}
      </div>
    </Rnd>
  );
}
