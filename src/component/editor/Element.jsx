import React, { useState, useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import TextElement from './TextElement'
import ImageElement from './ImageElement'
import ShapeElement from './ShapeElement'
import { useEditor } from '../../context/EditorContext'

export default function Element({ element, zoom = 1 }) {
  const { updateElement, selectElement, state } = useEditor()
  const selected = state.selectedId === element.id

  // Local states for smooth interactions
  const [rotation, setRotation] = useState(element.rotation || 0)
  const [tempPos, setTempPos] = useState({ x: element.x, y: element.y })
  const rotateRef = useRef(null)
  const draggingRef = useRef(false)

  // Keep local rotation in sync with context (for undo/redo updates)
  useEffect(() => {
    setRotation(element.rotation ?? 0)
  }, [element.rotation])

  // Keep temp position in sync with context (for undo/redo updates)
  useEffect(() => {
    if (!draggingRef.current) {
      setTempPos({ x: element.x, y: element.y })
    }
  }, [element.x, element.y])

  // Shift + R = rotate 15°
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selected) return
      if (e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        const newRotation = (rotation + 15) % 360
        updateElement(element.id, { rotation: newRotation })
        setRotation(newRotation)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, rotation, element.id, updateElement])

  // --- SMOOTH, ZOOM-AWARE DRAGGING ---
  const handleDrag = (e, d) => {
    draggingRef.current = true
    // Move visually only, no context updates (for performance)
    setTempPos({ x: d.x / zoom, y: d.y / zoom })
  }

  const handleDragStop = (e, d) => {
    draggingRef.current = false
    updateElement(element.id, {
      x: d.x / zoom,
      y: d.y / zoom,
    })
  }

  // --- ZOOM-AWARE RESIZING ---
  const handleResizeStop = (e, dir, ref, delta, pos) => {
    updateElement(element.id, {
      width: parseInt(ref.style.width) / zoom,
      height: parseInt(ref.style.height) / zoom,
      x: pos.x / zoom,
      y: pos.y / zoom,
    })
  }

  // --- ROTATION HANDLE ---
  const startRotate = (e) => {
    e.stopPropagation()
    const move = (ev) => {
      const rect = rotateRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const radians = Math.atan2(ev.clientY - cy, ev.clientX - cx)
      const angle = (radians * 180) / Math.PI
      const newRotation = Math.round(angle)
      setRotation(newRotation)
    }
    const stop = () => {
      updateElement(element.id, { rotation })
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }

  // Calculate current visible position (live updates while dragging)
  const visiblePos = draggingRef.current
    ? { x: tempPos.x * zoom, y: tempPos.y * zoom }
    : { x: element.x * zoom, y: element.y * zoom }

  return (
    <Rnd
      bounds="#editor-canvas"
      size={{
        width: element.width * zoom,
        height: element.height * zoom,
      }}
      position={visiblePos}
      scale={zoom}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={(e) => {
        e.stopPropagation()
        selectElement(element.id)
      }}
      enableResizing={{
        bottomRight: true,
        bottomLeft: true,
        topRight: true,
        topLeft: true,
      }}
      style={{
        zIndex: element.zIndex ?? 1,
        opacity: element.opacity ?? 1,
        outline: selected ? '2px solid #3b82f6' : 'none',
        transition: draggingRef.current ? 'none' : 'transform 0.05s ease-out',
      }}
    >
      <div
        ref={rotateRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center',
          transition: 'transform 0.08s linear',
        }}
      >
        {element.type === 'text' && <TextElement element={element} />}
        {element.type === 'image' && <ImageElement element={element} />}
        {element.type === 'shape' && <ShapeElement element={element} />}

        {/* Rotation handle (only visible when selected) */}
        {selected && (
          <div
            className="absolute left-1/2 -top-6 w-4 h-4 bg-blue-500 rounded-full cursor-grab border border-white shadow"
            style={{ transform: 'translateX(-50%)' }}
            onMouseDown={startRotate}
          />
        )}
      </div>
    </Rnd>
  )
}
