// ----------------------------
// src/context/EditorContext.jsx
// ----------------------------
import React, { createContext, useReducer, useContext, useRef } from 'react'
import { v4 as uuid } from 'uuid'

const EditorContext = createContext()

const initialState = {
  elements: [],
  selectedId: null,
  history: [],
  future: []
}

function reducer(state, action){
  switch(action.type){
    case 'ADD_ELEMENT':{
      const newElements = [...state.elements, action.payload]
      return {...state, elements: newElements, selectedId: action.payload.id, history: [...state.history, state.elements], future: []}
    }
    case 'UPDATE_ELEMENT':{
      const newElements = state.elements.map(el => el.id === action.payload.id ? {...el, ...action.payload.updates} : el)
      return {...state, elements: newElements, history: [...state.history, state.elements], future: []}
    }
    case 'SET_ELEMENTS':{
      return {...state, elements: action.payload}
    }
    case 'SELECT_ELEMENT':{
      return {...state, selectedId: action.payload}
    }
    case 'DELETE_ELEMENT':{
      const newElements = state.elements.filter(e=>e.id!==action.payload)
      return {...state, elements: newElements, selectedId: null, history: [...state.history, state.elements], future: []}
    }
    case 'REORDER_ELEMENTS':{
      const newElements = action.payload
      return {...state, elements: newElements, history: [...state.history, state.elements], future: []}
    }
    case 'UNDO':{
      if(state.history.length === 0) return state
      const prev = state.history[state.history.length -1]
      const history = state.history.slice(0, -1)
      return {...state, elements: prev, history, future: [state.elements, ...state.future], selectedId: null}
    }
    case 'REDO':{
      if(state.future.length === 0) return state
      const next = state.future[0]
      const future = state.future.slice(1)
      return {...state, elements: next, history: [...state.history, state.elements], future, selectedId: null}
    }
    default:
      return state
  }
}

export function EditorProvider({children}){
  const [state, dispatch] = useReducer(reducer, initialState)
  // helper actions
  const addText = (overrides = {}) => {
    const el = {
      id: uuid(),
      type: 'text',
      x: 100, y: 100, width: 200, height: 80,
      text: overrides.text ?? 'Double-click to edit',
      fontSize: overrides.fontSize ?? 20,
      fontFamily: overrides.fontFamily ?? 'Arial, sans-serif',
      color: overrides.color ?? '#111827',
      opacity: overrides.opacity ?? 1,
      ...overrides
    }
    dispatch({type:'ADD_ELEMENT', payload:el})
  }
  const addShape = (shapeType='rect', overrides = {}) => {
    const el = {
      id: uuid(),
      type: 'shape',
      shape: shapeType, // rect | circle | line
      x: 120, y: 120, width: 150, height: 100,
      background: overrides.background ?? '#ef4444',
      borderRadius: shapeType === 'circle' ? 9999 : (overrides.borderRadius ?? 6),
      opacity: overrides.opacity ?? 1,
      ...overrides
    }
    dispatch({type:'ADD_ELEMENT', payload:el})
  }
  const addImage = (src, overrides = {}) => {
    const el = {
      id: uuid(),
      type: 'image',
      src,
      x: 140, y: 140, width: 240, height: 160,
      opacity: overrides.opacity ?? 1,
      ...overrides
    }
    dispatch({type:'ADD_ELEMENT', payload:el})
  }

  const updateElement = (id, updates) => dispatch({type:'UPDATE_ELEMENT', payload:{id, updates}})
  const selectElement = (id) => dispatch({type:'SELECT_ELEMENT', payload:id})
  const deleteElement = (id) => dispatch({type:'DELETE_ELEMENT', payload:id})
  const reorderElements = (newList) => dispatch({type:'REORDER_ELEMENTS', payload:newList})
  const undo = () => dispatch({type:'UNDO'})
  const redo = () => dispatch({type:'REDO'})
  const setElements = (list) => dispatch({type:'SET_ELEMENTS', payload:list})

  const api = {state, addText, addShape, addImage, updateElement, selectElement, deleteElement, reorderElements, undo, redo, setElements}

  return <EditorContext.Provider value={api}>{children}</EditorContext.Provider>
}

export function useEditor(){
  return useContext(EditorContext)
}