// ----------------------------
// src/components/Editor/ImageElement.jsx
// ----------------------------
import React from "react";

export default function ImageElement({ element }) {
  const src =
    element.src && typeof element.src === "string"
      ? element.src
      : "";

  return (
    <img
      src={src}
      alt={element.name || "image"}
      draggable={false}
      className="absolute inset-0 pointer-events-none select-none"
      style={{
        width: "100%",
        height: "100%",
        objectFit: element.objectFit || "cover", // supports cover, contain, fill
        borderRadius: element.borderRadius ?? 0,
        filter: element.filter || "none",
        opacity: element.opacity ?? 1,
        transform: `
          scaleX(${element.scaleX || 1})
          scaleY(${element.scaleY || 1})
        `,
        transformOrigin: "center center",
      }}
    />
  );
}
