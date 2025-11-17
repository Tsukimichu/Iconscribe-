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
      const newElements = [...state.elements, action.payload];
      return {
        ...state,
        elements: newElements,
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

    case "SET_ELEMENTS": {
      return {
        ...state,
        elements: action.payload,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };
    }

    case "SELECT_ELEMENT":
      return { ...state, selectedId: action.payload };

    case "DELETE_ELEMENT": {
      const remaining = state.elements.filter((el) => el.id !== action.payload);
      return {
        ...state,
        elements: remaining,
        selectedId: null,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      };
    }

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

  // 💾 Auto-save
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
        borderRadius: shapeType === "circle" ? 9999 : overrides.borderRadius ?? 6,
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

  const importFromJSON = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.elements) dispatch({ type: "SET_ELEMENTS", payload: parsed.elements });
      if (parsed.canvas) dispatch({ type: "SET_CANVAS_SIZE", payload: parsed.canvas });
    } catch {
      alert("Invalid JSON file!");
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
