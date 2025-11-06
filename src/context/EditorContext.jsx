// ----------------------------
// src/context/EditorContext.jsx
// ----------------------------
import React, { createContext, useReducer, useContext, useRef, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import html2canvas from 'html2canvas'

const EditorContext = createContext()

// 🧩 Initial State
const initialState = {
  elements: [],
  selectedId: null,
  history: [],
  future: [],
  canvas: {
    width: 1080,
    height: 1080,
    aspect: '1:1', // Default square
  },
}

// 🧠 Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newElements = [...state.elements, action.payload]
      return {
        ...state,
        elements: newElements,
        selectedId: action.payload.id,
        history: [...state.history.slice(-30), state.elements], // limit history size
        future: [],
      }
    }

    case 'UPDATE_ELEMENT': {
      const newElements = state.elements.map((el) =>
        el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
      )
      return {
        ...state,
        elements: newElements,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      }
    }

    case 'SET_ELEMENTS':
      return { ...state, elements: action.payload }

    case 'SELECT_ELEMENT':
      return { ...state, selectedId: action.payload }

    case 'DELETE_ELEMENT': {
      const newElements = state.elements.filter((e) => e.id !== action.payload)
      return {
        ...state,
        elements: newElements,
        selectedId: null,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      }
    }

    case 'REORDER_ELEMENTS':
      return {
        ...state,
        elements: action.payload,
        history: [...state.history.slice(-30), state.elements],
        future: [],
      }

    case 'UNDO': {
      if (state.history.length === 0) return state
      const prev = state.history[state.history.length - 1]
      const history = state.history.slice(0, -1)
      return {
        ...state,
        elements: prev,
        history,
        future: [state.elements, ...state.future],
        selectedId: null,
      }
    }

    case 'REDO': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      const future = state.future.slice(1)
      return {
        ...state,
        elements: next,
        history: [...state.history.slice(-30), state.elements],
        future,
        selectedId: null,
      }
    }

    case 'SET_CANVAS_SIZE': {
      return {
        ...state,
        canvas: action.payload,
      }
    }

    default:
      return state
  }
}

// 🧭 Provider
export function EditorProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('editor-state')
      return saved ? JSON.parse(saved) : init
    } catch {
      return init
    }
  })

  const canvasRef = useRef(null)

  // 💾 Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('editor-state', JSON.stringify(state))
  }, [state])

  // --- Actions ---
  const addText = (overrides = {}) => {
    const el = {
      id: uuid(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 80,
      text: overrides.text ?? 'Double-click to edit',
      fontSize: overrides.fontSize ?? 20,
      fontFamily: overrides.fontFamily ?? 'Arial, sans-serif',
      color: overrides.color ?? '#111827',
      opacity: overrides.opacity ?? 1,
      ...overrides,
    }
    dispatch({ type: 'ADD_ELEMENT', payload: el })
  }

  const addShape = (shapeType = 'rect', overrides = {}) => {
    const el = {
      id: uuid(),
      type: 'shape',
      shape: shapeType,
      x: 120,
      y: 120,
      width: 150,
      height: 100,
      background: overrides.background ?? '#ef4444',
      borderRadius: shapeType === 'circle' ? 9999 : overrides.borderRadius ?? 6,
      opacity: overrides.opacity ?? 1,
      ...overrides,
    }
    dispatch({ type: 'ADD_ELEMENT', payload: el })
  }

  const addImage = (src, overrides = {}) => {
    const el = {
      id: uuid(),
      type: 'image',
      src,
      x: 140,
      y: 140,
      width: 240,
      height: 160,
      opacity: overrides.opacity ?? 1,
      ...overrides,
    }
    dispatch({ type: 'ADD_ELEMENT', payload: el })
  }

  const updateElement = (id, updates) =>
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } })
  const selectElement = (id) => dispatch({ type: 'SELECT_ELEMENT', payload: id })
  const deleteElement = (id) => dispatch({ type: 'DELETE_ELEMENT', payload: id })
  const reorderElements = (list) =>
    dispatch({ type: 'REORDER_ELEMENTS', payload: list })
  const undo = () => dispatch({ type: 'UNDO' })
  const redo = () => dispatch({ type: 'REDO' })
  const setElements = (list) => dispatch({ type: 'SET_ELEMENTS', payload: list })

  // 📤 Export as Image
  const exportAsImage = async (format = 'png') => {
    const canvasEl = document.querySelector('#canvas-area')
    if (!canvasEl) return alert('No canvas found!')

    const canvas = await html2canvas(canvasEl, {
      backgroundColor: null,
      useCORS: true,
      scale: 2,
    })
    const dataURL = canvas.toDataURL(`image/${format}`)
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `design.${format}`
    link.click()
  }

  // 📤 Export as JSON
  const exportAsJSON = () => {
    const json = JSON.stringify(state.elements, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'design.json'
    link.click()
  }

  // 📥 Import JSON
  const importFromJSON = (jsonData) => {
    try {
      const elements = JSON.parse(jsonData)
      if (Array.isArray(elements)) dispatch({ type: 'SET_ELEMENTS', payload: elements })
    } catch (e) {
      alert('Invalid JSON file!')
    }
  }

  // 🧩 Change Canvas Size / Aspect Ratio
  const setCanvasSize = (width, height, aspect = 'custom') => {
    dispatch({
      type: 'SET_CANVAS_SIZE',
      payload: { width, height, aspect },
    })
  }

  const api = {
    state,
    addText,
    addShape,
    addImage,
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
    canvasRef,
  }

  return <EditorContext.Provider value={api}>{children}</EditorContext.Provider>
}

// 🪄 Hook
export function useEditor() {
  return useContext(EditorContext)
}
