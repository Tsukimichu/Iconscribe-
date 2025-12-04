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
import axios from "axios";
import { API_URL } from "../api";

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
        el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
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

  // 💾 Auto-save editor state
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
    dispatch({ type: "UPDATE_ELEMENT", payload: { id, updates: { name: newName } } });

  const updateElement = (id, updates) =>
    dispatch({ type: "UPDATE_ELEMENT", payload: { id, updates } });

  const selectElement = (id) => dispatch({ type: "SELECT_ELEMENT", payload: id });

  const deleteElement = (id) => dispatch({ type: "DELETE_ELEMENT", payload: id });

  const reorderElements = (list) => dispatch({ type: "REORDER_ELEMENTS", payload: list });

  const undo = () => dispatch({ type: "UNDO" });
  const redo = () => dispatch({ type: "REDO" });

  const setElements = (list) => dispatch({ type: "SET_ELEMENTS", payload: list });

  const toggleElementsPanel = () =>
    dispatch({ type: "TOGGLE_ELEMENTS_PANEL" });

  // ------------------------------------------------------
  // EXPORT FUNCTIONS
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
  // IMPORT TEMPLATE / JSON
  // ------------------------------------------------------
  const importFromJSON = (jsonData, persist = false) => {
    try {
      const parsed =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      // Local saved format
      if (Array.isArray(parsed.elements)) {
        dispatch({ type: "SET_ELEMENTS", payload: parsed.elements });
        if (parsed.canvas) {
          dispatch({ type: "SET_CANVAS_SIZE", payload: parsed.canvas });
        }

        if (persist) {
          const saved = {
            ...initialState,
            elements: parsed.elements,
            canvas: parsed.canvas || state.canvas,
          };
          localStorage.setItem("editor-state", JSON.stringify(saved));
        }

        return;
      }

      // Fabric-style format
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
              fill: o.fill || "#000",
              stroke: o.stroke || null,
              strokeWidth: o.strokeWidth || 0,
            };
          }

          if (o.type === "maskedImage") {
            return {
              ...base,
              type: "maskedImage",
              src: o.src || "",
            };
          }

          if (o.type === "textbox" || o.type === "text" || o.type === "i-text") {
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

          if (o.type === "image") {
            return {
              ...base,
              type: "image",
              src: o.src || o.url || "",
            };
          }

          if (o.type === "circle" || o.type === "ellipse") {
            return {
              ...base,
              type: "shape",
              shape: "circle",
              background: o.fill || "#000",
              borderColor: o.stroke || "#000",
              borderWidth: o.strokeWidth || 0,
              borderRadius: Math.max(width, height) / 2,
            };
          }

          return {
            ...base,
            type: "shape",
            shape: "rect",
            background: o.fill || "#000",
            borderColor: o.stroke || "#000",
            borderWidth: o.strokeWidth || 0,
            borderRadius: o.rx || o.ry || 0,
          };
        });
      }

      dispatch({ type: "SET_ELEMENTS", payload: elements });

      const newCanvas = {
        width: parsed.width || maxRight || state.canvas.width,
        height: parsed.height || maxBottom || state.canvas.height,
        aspect: "custom",
        zoom: state.canvas.zoom,
      };

      dispatch({ type: "SET_CANVAS_SIZE", payload: newCanvas });

      if (persist) {
        const saved = {
          ...initialState,
          elements,
          canvas: newCanvas,
        };
        localStorage.setItem("editor-state", JSON.stringify(saved));
      }
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
  // ⭐ SAVE: Recent Designs (localStorage)
  // ------------------------------------------------------
  const saveCurrentDesign = (info = {}) => {
    try {
      const stateJSON = {
        elements: state.elements,
        canvas: state.canvas,
        timestamp: Date.now(),
      };

      const canvasEl = document.querySelector("#canvas-area");
      if (!canvasEl) return;

      html2canvas(canvasEl, { scale: 0.3 }).then((canvas) => {
        const preview = canvas.toDataURL("image/png");

        const entry = {
          id: uuid(),
          name: info.name || "Untitled Design",
          preview,
          editorState: stateJSON,
          date: new Date().toISOString(),
        };

        let list = JSON.parse(localStorage.getItem("recent-designs")) || [];
        list.unshift(entry);
        list = list.slice(0, 20);

        localStorage.setItem("recent-designs", JSON.stringify(list));
      });
    } catch (err) {
      console.error("Failed to save recent design", err);
    }
  };

  

  // ------------------------------------------------------
  // SANITIZE CANVAS (Fix html2canvas OKLCH error)
  // ------------------------------------------------------
  function forceRemoveOKLCH() {
    const all = document.querySelectorAll("*");

    all.forEach((el) => {
      const styles = window.getComputedStyle(el);

      const check = (prop) => styles[prop] && styles[prop].includes("oklch");

      // Replace OKLCH values
      if (check("color")) el.style.setProperty("color", "rgb(0,0,0)", "important");
      if (check("backgroundColor")) el.style.setProperty("background-color", "transparent", "important");
      if (check("borderColor")) el.style.setProperty("border-color", "rgb(0,0,0)", "important");

      // Tailwind Shadows use OKLCH
      if (check("boxShadow")) el.style.setProperty("box-shadow", "none", "important");
      if (check("outlineColor")) el.style.setProperty("outline-color", "rgb(0,0,0)", "important");

      // Rings / Ring-offset (Tailwind)
      if (check("--tw-ring-color")) el.style.setProperty("--tw-ring-color", "transparent", "important");
      if (check("--tw-ring-offset-color")) el.style.setProperty("--tw-ring-offset-color", "transparent", "important");
    });
  }

  // ------------------------------------------------------
  // SAVE DESIGN TO DB
  // ------------------------------------------------------
  const saveDesignToDB = async (userId, designName = "My Design") => {
    try {
      console.log("🟦 SENDING SAVE REQUEST...");
      console.log("USER:", userId, "NAME:", designName);

      const canvasEl = document.querySelector("#canvas-area");
      if (!canvasEl) {
        console.error("❌ No canvas found!");
        return { success: false };
      }

      forceRemoveOKLCH();

      const previewCanvas = await html2canvas(canvasEl, {
        backgroundColor: null,
        useCORS: true,
        scale: 0.5,
      });

      const preview_image = previewCanvas.toDataURL("image/png");

      const payload = {
        user_id: userId,
        design_name: designName,
        preview_image,
        json: JSON.stringify({
          elements: state.elements,
          canvas: state.canvas,
        }),
      };

      console.log("REQUEST PAYLOAD:", payload);
      console.log("POST TO:", `${API_URL}/designs/save`);

      const res = await axios.post(`${API_URL}/designs/save`, payload);

      console.log("🟩 SAVE SUCCESS:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ SAVE TO DB FAILED:", err);
      if (err.response) {
        console.error("STATUS:", err.response.status);
        console.error("RESPONSE:", err.response.data);
      }
      return { success: false };
    }
  };


  // ------------------------------------------------------
  // EXPORTED API
  // ------------------------------------------------------
  const api = {
    state,
    canvasRef,

    addText,
    addShape,
    addImage,
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

    // ⭐ NEW EXPORTS
    saveCurrentDesign,
    saveDesignToDB,
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