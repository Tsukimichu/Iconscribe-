import React, { useState, useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import TextElement from './TextElement'
import ImageElement from './ImageElement'
import ShapeElement from './ShapeElement'
import { useEditor } from '../../context/EditorContext'

export default function Element({ element, zoom = 1 }) {
  const { updateElement, selectElement, state } = useEditor()
  const selected = state.selectedId === element.id

  // Local rotation state — **will be synced** with element.rotation
  const [rotation, setRotation] = useState(element.rotation || 0)
  const rotateRef = useRef(null)

  // --- KEEP LOCAL ROTATION IN SYNC WITH CONTEXT ---
  // This is the crucial fix: when the element prop updates (e.g. via undo/redo),
  // update the local rotation so the visual matches the context state.
  useEffect(() => {
    setRotation(element.rotation ?? 0)
  }, [element.rotation])

  // Keyboard: Shift + R rotates element by 15°, updates context (which goes into history)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selected) return
      if (e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        const newRotation = (rotation + 15) % 360
        // update context — this will be included in undo/redo history
        updateElement(element.id, { rotation: newRotation })
        // update local state (will also be synced by the effect above)
        setRotation(newRotation)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, rotation, element.id, updateElement])

  // Drag/resize handlers convert scaled values back to canvas coordinates
  const onDragStop = (e, d) => {
    updateElement(element.id, {
      x: d.x / zoom,
      y: d.y / zoom,
    })
  }

  const onResizeStop = (e, dir, ref, delta, pos) => {
    updateElement(element.id, {
      width: parseInt(ref.style.width) / zoom,
      height: parseInt(ref.style.height) / zoom,
      x: pos.x / zoom,
      y: pos.y / zoom,
    })
  }

  // Rotation handle dragging (pointer-based)
  const startRotate = (e) => {
    e.stopPropagation()
    const move = (ev) => {
      // Get the center of the element's visual box (use bounding rect)
      const rect = rotateRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const radians = Math.atan2(ev.clientY - cy, ev.clientX - cx)
      const angle = (radians * 180) / Math.PI
      const newRotation = Math.round(angle)
      // Persist rotation to context (so it enters undo history)
      updateElement(element.id, { rotation: newRotation })
      // update local immediately for responsive UI (effect will keep them synced)
      setRotation(newRotation)
    }
    const stop = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }

  return (
    <Rnd
      bounds="#editor-canvas"
      size={{
        width: element.width * zoom,
        height: element.height * zoom,
      }}
      position={{
        x: element.x * zoom,
        y: element.y * zoom,
      }}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
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

        {/* Rotation Handle */}
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
