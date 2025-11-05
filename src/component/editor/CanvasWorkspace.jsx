// ----------------------------
// src/components/Editor/CanvasWorkspace.jsx
// ----------------------------
import React, { useRef, useEffect, useState } from 'react'
import { useEditor } from '../../context/EditorContext'
import Element from './Element'

export default function CanvasWorkspace() {
  const { state, undo, redo, deleteElement, updateElement, setElements } = useEditor()
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [guides, setGuides] = useState({ vertical: null, horizontal: null })

  // ⌨️ Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const selected = state.elements.find(el => el.id === state.selectedId)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault()
          undo()
        } else if (e.key === 'y') {
          e.preventDefault()
          redo()
        } else if (e.key === 'd' && selected) {
          e.preventDefault()
          const clone = { ...selected, id: crypto.randomUUID(), x: selected.x + 20, y: selected.y + 20 }
          setElements([...state.elements, clone])
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault()
          setZoom((z) => Math.min(2, z + 0.1))
        } else if (e.key === '-') {
          e.preventDefault()
          setZoom((z) => Math.max(0.5, z - 0.1))
        }
      }
      if (e.key === 'Delete' && state.selectedId) {
        e.preventDefault()
        deleteElement(state.selectedId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state])

  // 🧭 Smart Alignment Guides (detect when elements align)
  useEffect(() => {
    if (!state.selectedId) {
      setGuides({ vertical: null, horizontal: null })
      return
    }

    const selected = state.elements.find(el => el.id === state.selectedId)
    if (!selected) return

    const others = state.elements.filter(el => el.id !== selected.id)
    let vGuide = null
    let hGuide = null

    for (const other of others) {
      // Vertical alignment (center or edges)
      if (Math.abs(selected.x - other.x) < 5) vGuide = other.x
      if (Math.abs(selected.x + selected.width / 2 - (other.x + other.width / 2)) < 5)
        vGuide = other.x + other.width / 2
      if (Math.abs(selected.x + selected.width - (other.x + other.width)) < 5)
        vGuide = other.x + other.width

      // Horizontal alignment
      if (Math.abs(selected.y - other.y) < 5) hGuide = other.y
      if (Math.abs(selected.y + selected.height / 2 - (other.y + other.height / 2)) < 5)
        hGuide = other.y + other.height / 2
      if (Math.abs(selected.y + selected.height - (other.y + other.height)) < 5)
        hGuide = other.y + other.height
    }

    setGuides({ vertical: vGuide, horizontal: hGuide })
  }, [state.selectedId, state.elements])

  // 🧾 Grid pattern (background)
  const gridStyle = showGrid
    ? {
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundImage:
          'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
      }
    : {}

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {/* Toolbar for zoom and grid */}
      <div className="absolute top-2 left-2 flex gap-2 z-20">
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.1))}
          className="px-2 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
        >
          +
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          className="px-2 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
        >
          -
        </button>
        <button
          onClick={() => setShowGrid(s => !s)}
          className="px-2 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
      </div>

      <div
        id="editor-canvas"
        ref={canvasRef}
        className="relative bg-white border shadow-inner"
        style={{
          width: 900 * zoom,
          height: 600 * zoom,
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
          ...gridStyle,
        }}
      >
        {state.elements.map((el) => (
          <Element key={el.id} element={el} zoom={zoom} />
        ))}

        {/* Alignment Guides */}
        {guides.vertical && (
          <div
            className="absolute bg-red-500/50 w-[1px] h-full"
            style={{ left: `${guides.vertical}px`, top: 0 }}
          />
        )}
        {guides.horizontal && (
          <div
            className="absolute bg-red-500/50 h-[1px] w-full"
            style={{ top: `${guides.horizontal}px`, left: 0 }}
          />
        )}
      </div>
    </div>
  )
}
