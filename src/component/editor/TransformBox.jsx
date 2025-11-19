import React, { useState } from "react";

export default function TransformBox({
  element,
  zoom,
  selected,
  children,
  onUpdate,
  onSelect,
}) {
  const [action, setAction] = useState(null);

  const startDrag = (e) => {
    e.stopPropagation();
    onSelect(element.id);
    setAction({
      type: "move",
      startX: e.clientX,
      startY: e.clientY,
      originX: element.x,
      originY: element.y,
    });
  };

  const startResize = (direction, e) => {
    e.stopPropagation();
    onSelect(element.id);

    setAction({
      type: "resize",
      dir: direction,
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...element },
    });
  };

  const onMouseMove = (e) => {
    if (!action) return;

    const dx = (e.clientX - action.startX) / zoom;
    const dy = (e.clientY - action.startY) / zoom;

    if (action.type === "move") {
      onUpdate({
        ...element,
        x: action.originX + dx,
        y: action.originY + dy,
      });
    }

    if (action.type === "resize") {
      const updated = { ...element };

      if (action.dir.includes("e")) updated.width = action.origin.width + dx;
      if (action.dir.includes("s")) updated.height = action.origin.height + dy;
      if (action.dir.includes("w")) {
        updated.width = action.origin.width - dx;
        updated.x = action.origin.x + dx;
      }
      if (action.dir.includes("n")) {
        updated.height = action.origin.height - dy;
        updated.y = action.origin.y + dy;
      }

      onUpdate(updated);
    }
  };

  const stopAction = () => setAction(null);

  return (
    <div
      style={{
        position: "absolute",
        top: element.y,
        left: element.x,
        width: element.width,
        height: element.height,
        transform: `scale(1)`,
        transformOrigin: "top left",
      }}
      onMouseMove={onMouseMove}
      onMouseUp={stopAction}
      onMouseLeave={stopAction}
      onMouseDown={(e) => onSelect(element.id)}
    >
      {/* Main Element (drag zone) */}
      <div
        className={`w-full h-full relative ${
          selected ? "outline outline-2 outline-blue-400" : ""
        }`}
        onMouseDown={startDrag}
      >
        {children}
      </div>

      {/* Resize Handles (Canva-style) */}
      {selected && (
        <>
          {["nw", "ne", "sw", "se"].map((dir) => (
            <div
              key={dir}
              onMouseDown={(e) => startResize(dir, e)}
              className="absolute w-3 h-3 bg-white border border-blue-600 rounded-full"
              style={{
                top: dir.includes("n") ? -6 : "auto",
                bottom: dir.includes("s") ? -6 : "auto",
                left: dir.includes("w") ? -6 : "auto",
                right: dir.includes("e") ? -6 : "auto",
                cursor: `${dir}-resize`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
