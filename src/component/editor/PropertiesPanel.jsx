import React, { useEffect } from 'react'
import { useEditor } from '../../context/EditorContext'
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

export default function PropertiesPanel() {
  const { state, updateElement, deleteElement } = useEditor()
  const selected = state.elements.find(e => e.id === state.selectedId)

  // ⭐ Hooks must ALWAYS run before any conditional return
  useEffect(() => {
    if (selected?.fontFamily) {
      const linkId = `google-font-${selected.fontFamily.replace(/\s+/g, '-')}`
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${selected.fontFamily.replace(/\s+/g, '+')}:wght@300;400;600;700&display=swap`
        document.head.appendChild(link)
      }
    }
  }, [selected?.fontFamily])

  // ⭐ After hooks → you are allowed to return early
  if (!selected)
    return (
      <div className="p-6 text-gray-400 italic text-center border border-dashed border-gray-200 rounded-xl">
        No element selected
      </div>
    )

  const set = (k, v) => updateElement(selected.id, { [k]: v })

  const fontOptions = [
    'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Tahoma',
    'Poppins', 'Roboto', 'Montserrat', 'Playfair Display', 'Raleway', 'Lato',
    'Open Sans', 'Oswald', 'Merriweather', 'Nunito', 'Quicksand', 'Dancing Script',
    'Pacifico', 'Bebas Neue', 'Inter'
  ]

  const sectionStyle = 'bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-100 space-y-3'

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-5 space-y-6 w-80">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-2">Properties</h3>

      {/* Opacity */}
      <div className={sectionStyle}>
        <label className="text-sm font-medium text-gray-700">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selected.opacity || 1}
          onChange={(e) => set('opacity', parseFloat(e.target.value))}
          className="w-full mt-2 accent-blue-500"
        />
      </div>

      {/* Text Properties */}
      {selected.type === 'text' && (
        <div className={sectionStyle}>
          <h4 className="text-gray-700 font-semibold mb-1">Text</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Font Size</label>
              <input
                type="number"
                value={selected.fontSize ?? 24}
                onChange={(e) => set('fontSize', parseInt(e.target.value || 14))}
                className="w-full mt-1 border-gray-300 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Font Family</label>
              <select
                value={selected.fontFamily ?? 'Arial'}
                onChange={(e) => set('fontFamily', e.target.value)}
                className="w-full mt-1 border-gray-300 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                style={{ fontFamily: selected.fontFamily }}
              >
                {fontOptions.map(f => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Color</label>
              <input
                type="color"
                value={selected.color ?? '#000000'}
                onChange={(e) => set('color', e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 mt-1 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Alignment</label>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => set('textAlign', 'left')}
                  className={`flex-1 p-2 rounded-lg ${selected.textAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => set('textAlign', 'center')}
                  className={`flex-1 p-2 rounded-lg ${selected.textAlign === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => set('textAlign', 'right')}
                  className={`flex-1 p-2 rounded-lg ${selected.textAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <AlignRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => set('fontWeight', selected.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`flex-1 p-2 rounded-lg font-bold ${selected.fontWeight === 'bold' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <Bold size={16} />
            </button>

            <button
              onClick={() => set('fontStyle', selected.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`flex-1 p-2 rounded-lg italic ${selected.fontStyle === 'italic' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <Italic size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Shape Properties */}
      {selected.type === 'shape' && (
        <div className={sectionStyle}>
          <h4 className="text-gray-700 font-semibold mb-1">Shape</h4>

          <label className="text-sm font-medium text-gray-600">Fill Color</label>
          <input
            type="color"
            value={selected.background || '#000000'}
            onChange={(e) => set('background', e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-200 mt-1 cursor-pointer"
          />
        </div>
      )}

      {/* Image Properties */}
      {selected.type === 'image' && (
        <div className={sectionStyle}>
          <h4 className="text-gray-700 font-semibold mb-1">Image</h4>

          <label className="text-sm font-medium text-gray-600">Image URL</label>
          <input
            className="w-full mt-1 border-gray-300 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={selected.src}
            onChange={(e) => set('src', e.target.value)}
          />
        </div>
      )}

      <div className="pt-4 border-t">
        <button
          className="w-full py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md"
          onClick={() => deleteElement(selected.id)}
        >
          Delete Element
        </button>
      </div>
    </div>
  )
}
