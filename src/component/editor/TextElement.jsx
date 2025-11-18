// ----------------------------
// src/components/Editor/TextElement.jsx
// ----------------------------
import React, { useState, useRef, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";

export default function TextElement({ element }) {
  const { updateElement } = useEditor();

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(element.text);
  const inputRef = useRef(null);

  useEffect(() => setText(element.text), [element.text]);

  // Auto-focus when editing begins
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleDoubleClick = () => setEditing(true);

  const handleBlur = () => {
    setEditing(false);
    updateElement(element.id, { text });
  };

  // -------------------------------------------------------
  // ⭐ FIXED: Top-left aligned text like Fabric.js
  // -------------------------------------------------------
  const style = {
    width: "100%",
    height: "100%",
    padding: "2px",

    fontSize: element.fontSize || 20,
    fontFamily: element.fontFamily || "Arial, sans-serif",
    color: element.color || "#000",
    fontWeight: element.fontWeight || "normal",
    fontStyle: element.fontStyle || "normal",
    lineHeight: element.lineHeight || 1.2,
    letterSpacing: element.letterSpacing || 0,

    // NO MORE flexbox centering → this was breaking your templates
    display: "block",

    textAlign: element.textAlign || "left",

    whiteSpace: "pre-wrap",
    wordBreak: "break-word",

    cursor: "text",
    opacity: element.opacity ?? 1,
    userSelect: "none",

    // DO NOT scale text container — scaling is handled by Element.jsx wrap
    transform: "none",
  };

  // -------------------------------------------------------
  // ⭐ TEXTAREA style (when editing)
  // -------------------------------------------------------
  const editStyle = {
    width: "100%",
    height: "100%",
    resize: "none",
    background: "transparent",
    outline: "none",
    border: "none",

    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight || "normal",
    fontStyle: element.fontStyle || "normal",
    textAlign: element.textAlign || "left",
    lineHeight: element.lineHeight || 1.2,
    letterSpacing: element.letterSpacing || 0,

    overflow: "hidden",
  };

  return (
    <div style={style} onDoubleClick={handleDoubleClick}>
      {editing ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          style={editStyle}
        />
      ) : (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: element.lineHeight || 1.2,
            letterSpacing: element.letterSpacing || 0,
            textAlign: element.textAlign || "left",
          }}
        >
          {element.text}
        </span>
      )}
    </div>
  );
}
