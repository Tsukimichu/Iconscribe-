import React from 'react'
import { useEditor } from '../../context/EditorContext'

export default function PropertiesPanel() {
  const { state, updateElement, deleteElement } = useEditor()
  const selected = state.elements.find(e => e.id === state.selectedId)

  if (!selected) return <div className="p-4 text-gray-500">No selection</div>

  const set = (k, v) => updateElement(selected.id, { [k]: v })

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Properties</h3>

      {/* Shared */}
      <div>
        <label className="text-sm font-medium">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selected.opacity || 1}
          onChange={(e) => set('opacity', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* TEXT ELEMENT */}
      {selected.type === 'text' && (
        <>
          <div>
            <label className="text-sm font-medium">Font Size</label>
            <input
              type="number"
              value={selected.fontSize}
              onChange={(e) => set('fontSize', parseInt(e.target.value || 14))}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Font Family</label>
            <select
              value={selected.fontFamily}
              onChange={(e) => set('fontFamily', e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option>Arial, sans-serif</option>
              <option>Georgia, serif</option>
              <option>"Courier New", monospace</option>
              <option>Tahoma, sans-serif</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Color</label>
            <input
              type="color"
              value={selected.color}
              onChange={(e) => set('color', e.target.value)}
              className="w-full h-8"
            />
          </div>

          {/* Text Alignment */}
          <div>
            <label className="text-sm font-medium">Alignment</label>
            <div className="flex gap-1 mt-1">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => set('textAlign', align)}
                  className={`flex-1 border rounded py-1 text-sm capitalize ${
                    selected.textAlign === align ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Bold / Italic */}
          <div>
            <label className="text-sm font-medium">Style</label>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => set('fontWeight', selected.fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`flex-1 border rounded py-1 font-bold ${
                  selected.fontWeight === 'bold' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                B
              </button>
              <button
                onClick={() => set('fontStyle', selected.fontStyle === 'italic' ? 'normal' : 'italic')}
                className={`flex-1 border rounded py-1 italic ${
                  selected.fontStyle === 'italic' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                I
              </button>
            </div>
          </div>
        </>
      )}

      {/* SHAPE ELEMENT */}
      {selected.type === 'shape' && (
        <div>
          <label className="text-sm font-medium">Fill</label>
          <input
            type="color"
            value={selected.background}
            onChange={(e) => set('background', e.target.value)}
            className="w-full h-8"
          />
        </div>
      )}

      {/* IMAGE ELEMENT */}
      {selected.type === 'image' && (
        <div>
          <label className="text-sm font-medium">Image URL</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={selected.src}
            onChange={(e) => set('src', e.target.value)}
          />
        </div>
      )}

      <div className="pt-4 border-t">
        <button
          className="px-3 py-1 rounded bg-red-500 text-white w-full"
          onClick={() => deleteElement(selected.id)}
        >
          Delete Element
        </button>
      </div>
    </div>
  )
}
