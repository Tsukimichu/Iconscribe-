import React, { useRef } from 'react'
import { useEditor } from '../../context/EditorContext'
import { exportCanvasAsPng } from '../../utils/exportUtils'

export default function Toolbar() {
  const {
    addText,
    addShape,
    addImage,
    undo,
    redo,
    updateElement,
    state,
  } = useEditor()
  const fileRef = useRef(null)
  const selected = state.elements.find(el => el.id === state.selectedId)

  const onUpload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    addImage(url)
    e.target.value = null
  }

  const onExport = async () => {
    const container = document.getElementById('editor-canvas')
    try {
      const dataUrl = await exportCanvasAsPng(container)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'canvas.png'
      a.click()
    } catch (err) {
      console.error(err)
      alert('Export failed')
    }
  }

  const addImageFromUrl = () => {
    const url = prompt('Image URL')
    if (url) addImage(url)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Add Elements */}
      <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={() => addText()}>Add Text</button>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => addShape('rectangle')}>Rectangle</button>
        <button className="px-3 py-1 rounded bg-green-500 text-white" onClick={() => addShape('circle')}>Circle</button>
        <button className="px-3 py-1 rounded bg-green-400 text-white" onClick={() => addShape('line')}>Line</button>
      </div>

      {/* Image Upload */}
      <input ref={fileRef} onChange={onUpload} type="file" accept="image/*" className="hidden" />
      <button className="px-3 py-1 rounded bg-yellow-500 text-white" onClick={() => fileRef.current && fileRef.current.click()}>Upload Image</button>
      <button className="px-3 py-1 rounded bg-amber-500 text-white" onClick={addImageFromUrl}>Image from URL</button>

      {/* Undo / Redo */}
      <div className="ml-4">
        <button onClick={undo} className="px-2 py-1 border rounded mr-2">Undo</button>
        <button onClick={redo} className="px-2 py-1 border rounded">Redo</button>
      </div>

      {/* --- DYNAMIC CONTROLS --- */}
      {selected && (
        <div className="ml-6 flex items-center gap-4 border-l pl-4">
          {/* --- SHAPE CONTROLS --- */}
          {selected.type === 'shape' && (
            <>
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600">Fill</label>
                <input
                  type="color"
                  value={selected.background || '#000000'}
                  onChange={(e) => updateElement(selected.id, { background: e.target.value })}
                  className="w-8 h-8 border rounded"
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600">Border</label>
                <input
                  type="color"
                  value={selected.borderColor || '#000000'}
                  onChange={(e) => updateElement(selected.id, { borderColor: e.target.value })}
                  className="w-8 h-8 border rounded"
                />
              </div>

              <div className="flex flex-col items-center w-24">
                <label className="text-xs text-gray-600">Border Width</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={selected.borderWidth ?? 0}
                  onChange={(e) => updateElement(selected.id, { borderWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {selected.shape !== 'circle' && selected.shape !== 'line' && (
                <div className="flex flex-col items-center w-24">
                  <label className="text-xs text-gray-600">Radius</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={selected.borderRadius ?? 0}
                    onChange={(e) => updateElement(selected.id, { borderRadius: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-col items-center w-24">
                <label className="text-xs text-gray-600">Opacity</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={selected.opacity ?? 1}
                  onChange={(e) => updateElement(selected.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* --- TEXT CONTROLS --- */}
          {selected.type === 'text' && (
            <>
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600">Color</label>
                <input
                  type="color"
                  value={selected.color || '#000000'}
                  onChange={(e) => updateElement(selected.id, { color: e.target.value })}
                  className="w-8 h-8 border rounded"
                />
              </div>

              <div className="flex flex-col items-center w-24">
                <label className="text-xs text-gray-600">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={selected.fontSize ?? 24}
                  onChange={(e) => updateElement(selected.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col items-center w-32">
                <label className="text-xs text-gray-600">Font Family</label>
                <select
                  value={selected.fontFamily ?? 'Arial'}
                  onChange={(e) => updateElement(selected.id, { fontFamily: e.target.value })}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>

              <div className="flex flex-col items-center w-28">
                <label className="text-xs text-gray-600">Opacity</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={selected.opacity ?? 1}
                  onChange={(e) => updateElement(selected.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col items-center w-28">
                <label className="text-xs text-gray-600">Align</label>
                <select
                  value={selected.textAlign ?? 'center'}
                  onChange={(e) => updateElement(selected.id, { textAlign: e.target.value })}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Export Button */}
      <div className="ml-auto">
        <button onClick={onExport} className="px-3 py-1 rounded bg-slate-800 text-white">Export PNG</button>
      </div>
    </div>
  )
}
