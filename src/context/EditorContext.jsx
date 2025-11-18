// ----------------------------
// src/context/EditorContext.jsx
// ----------------------------
import React, {
  createContext,
  useReducer,
  useContext,
  useRef,
  useEffect,
} from "react";
import { v4 as uuid } from "uuid";
import html2canvas from "html2canvas";

const EditorContext = createContext();

// 🧩 Initial State
const initialState = {
  elements: [],
  selectedId: null,
  history: [],
  future: [],
  isElementsPanelOpen: false,
  canvas: {
    width: 1080,
    height: 1080,
    aspect: "1:1",
    zoom: 1,
  },
};

// ------------------------------------------------------
// 🧠 Reducer
// ------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case "ADD_ELEMENT":
      return {
        ...state,
        elements: [...state.elements, action.payload],
        selectedId: action.payload.id,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };

    case "UPDATE_ELEMENT": {
      const updated = state.elements.map((el) =>
        el.id === action.payload.id
          ? { ...el, ...action.payload.updates }
          : el
      );
      return {
        ...state,
        elements: updated,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };
    }

    case "SET_ELEMENTS":
      return {
        ...state,
        elements: action.payload,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };

    case "SELECT_ELEMENT":
      return { ...state, selectedId: action.payload };

    case "DELETE_ELEMENT":
      return {
        ...state,
        elements: state.elements.filter((el) => el.id !== action.payload),
        selectedId: null,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };

    case "REORDER_ELEMENTS":
      return {
        ...state,
        elements: action.payload,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };

    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...state,
        elements: prev,
        history: state.history.slice(0, -1),
        future: [state.elements, ...state.future],
        selectedId: null,
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        elements: next,
        history: [...state.history.slice(-30), state.elements],
        future: state.future.slice(1),
        selectedId: null,
      };
    }

    case "SET_CANVAS_SIZE":
      return { ...state, canvas: action.payload };

    case "TOGGLE_ELEMENTS_PANEL":
      return { ...state, isElementsPanelOpen: !state.isElementsPanelOpen };

    default:
      return state;
  }
}

// ------------------------------------------------------
// 🧭 Provider
// ------------------------------------------------------
export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem("editor-state");
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  const canvasRef = useRef(null);

  // 💾 Auto-save design
  useEffect(() => {
    localStorage.setItem("editor-state", JSON.stringify(state));
  }, [state]);

  // ------------------------------------------------------
  // Helpers
  // ------------------------------------------------------
  const getCanvasCenter = () => {
    const { width, height } = state.canvas;
    return { x: width / 2, y: height / 2 };
  };

  // ------------------------------------------------------
  // ELEMENT CREATION
  // ------------------------------------------------------

  const addText = (overrides = {}) => {
    const { x, y } = getCanvasCenter();
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        id: uuid(),
        type: "text",
        name: overrides.name ?? "New Text",
        x: x - 100,
        y: y - 40,
        width: 200,
        height: 80,
        text: overrides.text ?? "Double-click to edit",
        fontSize: overrides.fontSize ?? 20,
        fontFamily: overrides.fontFamily ?? "Arial",
        color: overrides.color ?? "#111827",
        opacity: overrides.opacity ?? 1,
        ...overrides,
      },
    });
  };

  const addShape = (shapeType = "rect", overrides = {}) => {
    const { x, y } = getCanvasCenter();
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        id: uuid(),
        type: "shape",
        name: overrides.name ?? `New ${shapeType}`,
        shape: shapeType,
        x: x - 75,
        y: y - 50,
        width: 150,
        height: 100,
        background: overrides.background ?? "#ef4444",
        borderRadius:
          shapeType === "circle" ? 9999 : overrides.borderRadius ?? 6,
        opacity: overrides.opacity ?? 1,
        ...overrides,
      },
    });
  };

  const addImage = (src, overrides = {}) => {
    const { x, y } = getCanvasCenter();
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        id: uuid(),
        type: "image",
        name: overrides.name ?? "New Image",
        src,
        x: x - 120,
        y: y - 80,
        width: 240,
        height: 160,
        opacity: overrides.opacity ?? 1,
        ...overrides,
      },
    });
  };

  // ⭐ NEW — SVG PATH
  const addPath = (d, overrides = {}) => {
    const { x, y } = getCanvasCenter();
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        id: uuid(),
        type: "path",
        name: overrides.name ?? "SVG Path",
        d,
        x: x - 150,
        y: y - 80,
        width: overrides.width ?? 300,
        height: overrides.height ?? 200,
        fill: overrides.fill ?? "#3B82F6",
        opacity: overrides.opacity ?? 1,
        rotation: overrides.rotation ?? 0,
        ...overrides,
      },
    });
  };

  // ⭐ NEW — Masked (Circle) Image
  const addMaskedImage = (src, overrides = {}) => {
    const { x, y } = getCanvasCenter();
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        id: uuid(),
        type: "maskedImage",
        name: overrides.name ?? "Masked Image",
        src,
        x: x - 100,
        y: y - 100,
        width: 200,
        height: 200,
        opacity: overrides.opacity ?? 1,
        rotation: overrides.rotation ?? 0,
        ...overrides,
      },
    });
  };

  // ------------------------------------------------------
  // ELEMENT CONTROLS
  // ------------------------------------------------------

  const renameElement = (id, newName) =>
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: { id, updates: { name: newName } },
    });

  const updateElement = (id, updates) =>
    dispatch({ type: "UPDATE_ELEMENT", payload: { id, updates } });

  const selectElement = (id) =>
    dispatch({ type: "SELECT_ELEMENT", payload: id });

  const deleteElement = (id) =>
    dispatch({ type: "DELETE_ELEMENT", payload: id });

  const reorderElements = (list) =>
    dispatch({ type: "REORDER_ELEMENTS", payload: list });

  const undo = () => dispatch({ type: "UNDO" });
  const redo = () => dispatch({ type: "REDO" });

  const setElements = (list) =>
    dispatch({ type: "SET_ELEMENTS", payload: list });

  const toggleElementsPanel = () =>
    dispatch({ type: "TOGGLE_ELEMENTS_PANEL" });

  // ------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------

  const exportAsImage = async (format = "png") => {
    const canvasEl = document.querySelector("#canvas-area");
    if (!canvasEl) return alert("No canvas found!");

    const canvas = await html2canvas(canvasEl, {
      backgroundColor: null,
      useCORS: true,
      scale: 2,
      width: state.canvas.width,
      height: state.canvas.height,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `design.${format}`;
    link.click();
  };

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "design.json";
    link.click();
  };

  // ------------------------------------------------------
  // ⭐ UPDATED TEMPLATE IMPORT (supports paths + maskedImage)
// ------------------------------------------------------
  const importFromJSON = (jsonData) => {
    try {
      const parsed =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      // 1) Your own saved format (from exportAsJSON)
      if (Array.isArray(parsed.elements)) {
        dispatch({ type: "SET_ELEMENTS", payload: parsed.elements });
        if (parsed.canvas) {
          dispatch({ type: "SET_CANVAS_SIZE", payload: parsed.canvas });
        }
        return;
      }

      // 2) Fabric-style / external JSON with `objects`
      let elements = [];
      let maxRight = 0;
      let maxBottom = 0;

      if (Array.isArray(parsed.objects)) {
        elements = parsed.objects.map((o, index) => {
          const scaleX = o.scaleX ?? 1;
          const scaleY = o.scaleY ?? 1;

          const baseWidth =
            o.width ??
            (o.radius ? o.radius * 2 : o.rx ? o.rx * 2 : 100);
          const baseHeight =
            o.height ??
            (o.radius ? o.radius * 2 : o.ry ? o.ry * 2 : 100);

          const width = baseWidth * scaleX;
          const height = baseHeight * scaleY;

          const x = o.left ?? 0;
          const y = o.top ?? 0;

          maxRight = Math.max(maxRight, x + width);
          maxBottom = Math.max(maxBottom, y + height);

          const base = {
            id: uuid(),
            name: o.name || `${o.type} ${index + 1}`,
            x,
            y,
            width,
            height,
            rotation: o.angle ?? 0,
            opacity: o.opacity ?? 1,
            zIndex: index + 1,
          };

          // --- PATH (curves / waves) ---
          if (o.type === "path") {
            let d = "";
            if (Array.isArray(o.path)) {
              d = o.path.map((cmd) => cmd.join(" ")).join(" ");
            } else {
              d = o.d || "";
            }
            return {
              ...base,
              type: "path",
              d,
              fill: o.fill || "#000000",
              stroke: o.stroke || null,
              strokeWidth: o.strokeWidth || 0,
            };
          }

          // --- Masked image (if ever present) ---
          if (o.type === "maskedImage") {
            return {
              ...base,
              type: "maskedImage",
              src: o.src || "",
            };
          }

          // --- TEXT ---
          if (
            o.type === "textbox" ||
            o.type === "text" ||
            o.type === "i-text"
          ) {
            return {
              ...base,
              type: "text",
              text: o.text || "",
              fontSize: o.fontSize || 20,
              fontFamily: o.fontFamily || "Arial",
              color: o.fill || "#000",
              textAlign: o.textAlign || "left",
              lineHeight: o.lineHeight || 1.2,
            };
          }

          // --- IMAGE ---
          if (o.type === "image") {
            return {
              ...base,
              type: "image",
              src: o.src || o.url || "",
            };
          }

          // --- CIRCLE / ELLIPSE (map to shape: circle) ---
          if (o.type === "circle" || o.type === "ellipse") {
            return {
              ...base,
              type: "shape",
              shape: "circle",
              background: o.fill || "#000000",
              borderColor: o.stroke || "#000000",
              borderWidth: o.strokeWidth || 0,
              borderRadius: Math.max(width, height) / 2,
            };
          }

          // --- DEFAULT: RECT / OTHER SHAPES ---
          return {
            ...base,
            type: "shape",
            shape: "rect",
            background: o.fill || "#000000",
            borderColor: o.stroke || "#000000",
            borderWidth: o.strokeWidth || 0,
            borderRadius:
              o.rx || o.ry || (o.type === "circle" ? width / 2 : 0),
          };
        });
      }

      dispatch({ type: "SET_ELEMENTS", payload: elements });

      // Canvas auto-size if external JSON
      dispatch({
        type: "SET_CANVAS_SIZE",
        payload: {
          width: parsed.width || maxRight || state.canvas.width,
          height: parsed.height || maxBottom || state.canvas.height,
          aspect: "custom",
          zoom: state.canvas.zoom,
        },
      });
    } catch (err) {
      console.error("IMPORT FAILED:", err);
      alert("Invalid template format.");
    }
  };

  const setCanvasSize = (w, h, aspect = "custom") =>
    dispatch({
      type: "SET_CANVAS_SIZE",
      payload: { width: w, height: h, aspect, zoom: state.canvas.zoom },
    });

  // ------------------------------------------------------
  // EXPORTED API
  // ------------------------------------------------------
  const api = {
    state,
    canvasRef,

    addText,
    addShape,
    addImage,

    // ⭐ NEW
    addPath,
    addMaskedImage,

    renameElement,
    updateElement,
    selectElement,
    deleteElement,
    reorderElements,

    undo,
    redo,
    setElements,

    exportAsImage,
    exportAsJSON,
    importFromJSON,

    setCanvasSize,

    toggleElementsPanel,
    isElementsPanelOpen: state.isElementsPanelOpen,
  };

  return (
    <EditorContext.Provider value={api}>
      {children}
    </EditorContext.Provider>
  );
}

// 🪄 Hook
export function useEditor() {
  return useContext(EditorContext);
}
