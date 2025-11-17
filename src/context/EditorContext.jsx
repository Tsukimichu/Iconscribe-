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
    case "ADD_ELEMENT": {
      return {
        ...state,
        elements: [...state.elements, action.payload],
        selectedId: action.payload.id,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };
    }

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
  // Element Creation
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
        fontFamily: overrides.fontFamily ?? "Arial, sans-serif",
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

  // ------------------------------------------------------
  // Element Controls
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
  // Export
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
  // ⭐ UPDATED TEMPLATE IMPORT
  // ------------------------------------------------------
  const importFromJSON = (jsonData) => {
    try {
      // Accept raw string or object
      const parsed =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      // Support two template formats:
      // 1) Our internal format: { elements: [...], canvas: {...} }
      // 2) Fabric-style format used by template JSONs: { objects: [...], background }

      let elements = [];

      if (Array.isArray(parsed.elements)) {
        elements = parsed.elements;
      } else if (Array.isArray(parsed.objects)) {
        // Map Fabric-style objects -> editor elements
        elements = parsed.objects.map((o) => {
          const base = {
            id: uuid(),
            x: o.left ?? 0,
            y: o.top ?? 0,
            width:
              o.width ?? (o.radius ? o.radius * 2 : o.scaleX ? 100 * o.scaleX : 100),
            height:
              o.height ?? (o.radius ? o.radius * 2 : o.scaleY ? 100 * o.scaleY : 100),
            opacity: o.opacity ?? 1,
            rotation: o.angle ?? o.rotation ?? 0,
          };

          // Text
          if (o.type === "textbox" || o.type === "i-text" || o.type === "text") {
            return {
              ...base,
              type: "text",
              text: o.text || o.text || "",
              fontSize: o.fontSize || 20,
              fontFamily: o.fontFamily || "Arial, sans-serif",
              color: o.fill || o.fillRule || "#000000",
            };
          }

          // Image
          if (o.type === "image") {
            return {
              ...base,
              type: "image",
              src: o.src || o.url || o.fill || "",
            };
          }

          // Shapes (rect, circle, triangle, path)
          if (o.type === "rect" || o.type === "circle" || o.type === "triangle" || o.type === "path") {
            return {
              ...base,
              type: "shape",
              shape: o.type === "rect" ? "rect" : o.type,
              background: o.fill || o.stroke || "#000000",
            };
          }

          // Fallback: keep as generic shape/text
          return {
            ...base,
            type: "shape",
            background: o.fill || "#ffffff",
          };
        });
      }

      // Load elements into state
      dispatch({
        type: "SET_ELEMENTS",
        payload: elements,
      });

      // Load canvas settings (if provided in template)
      if (parsed.canvas) {
        dispatch({
          type: "SET_CANVAS_SIZE",
          payload: parsed.canvas,
        });
      } else if (parsed.width && parsed.height) {
        dispatch({
          type: "SET_CANVAS_SIZE",
          payload: { width: parsed.width, height: parsed.height, aspect: "custom", zoom: state.canvas.zoom },
        });
      }
    } catch (err) {
      console.error("Failed to import template:", err);
      alert("Invalid template format.");
    }
  };

  const setCanvasSize = (w, h, aspect = "custom") =>
    dispatch({
      type: "SET_CANVAS_SIZE",
      payload: { width: w, height: h, aspect, zoom: state.canvas.zoom },
    });

  // ------------------------------------------------------
  // Expose API
  // ------------------------------------------------------
  const api = {
    state,
    canvasRef,

    addText,
    addShape,
    addImage,

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
    <EditorContext.Provider value={api}>{children}</EditorContext.Provider>
  );
}

// 🪄 Hook
export function useEditor() {
  return useContext(EditorContext);
}
