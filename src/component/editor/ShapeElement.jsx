// ----------------------------
// src/components/Editor/ShapeElement.jsx
// ----------------------------
import React from "react";

export default function ShapeElement({ element }) {
  const {
    shape = "rect",
    background = "#000000",
    borderColor = "#000000",
    borderWidth = 0,
    borderRadius = 0,
    opacity = 1,
    scaleX = 1,
    scaleY = 1,
  } = element;

  // Base style applied to all shapes
  const baseStyle = {
    width: "100%",
    height: "100%",
    opacity,
    background:
      shape === "line"
        ? "none"
        : background || "#000000",
    border:
      borderWidth > 0
        ? `${borderWidth}px solid ${borderColor}`
        : "none",
    transform: `
      scaleX(${scaleX})
      scaleY(${scaleY})
    `,
    transformOrigin: "center center",
  };

  // ------------------------------
  // ⭐ CIRCLE
  // ------------------------------
  if (shape === "circle") {
    return (
      <div
        style={{
          ...baseStyle,
          borderRadius: "50%",
        }}
      />
    );
  }

  // ------------------------------
  // ⭐ TRIANGLE
  // ------------------------------
  if (shape === "triangle") {
    return (
      <div
        style={{
          width: "0px",
          height: "0px",
          borderLeft: `${50 * scaleX}% solid transparent`,
          borderRight: `${50 * scaleX}% solid transparent`,
          borderBottom: `${100 * scaleY}% solid ${background}`,
          opacity,
          transform: `
            scale(${scaleX}, ${scaleY})
          `,
          transformOrigin: "center center",
        }}
      />
    );
  }

  // ------------------------------
  // ⭐ LINE
  // ------------------------------
  if (shape === "line") {
    return (
      <div
        style={{
          width: "100%",
          height: `${borderWidth || 2}px`,
          background: borderColor,
          opacity,
          transform: `
            scaleY(${scaleY})
            scaleX(${scaleX})
          `,
          transformOrigin: "center center",
        }}
      />
    );
  }

  // ------------------------------
  // ⭐ RECTANGLE (DEFAULT)
  // ------------------------------
  return (
    <div
      style={{
        ...baseStyle,
        borderRadius,
      }}
    />
  );
}
