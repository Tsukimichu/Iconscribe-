// ----------------------------
// src/component/AspectRatioSelector.jsx
// ----------------------------
import React, { useState, useEffect } from 'react'
import { useEditor } from '../context/EditorContext'

const presets = [
  { label: '1:1 (Square)', w: 1080, h: 1080 },
  { label: '16:9 (Landscape)', w: 1920, h: 1080 },
  { label: '9:16 (Portrait)', w: 1080, h: 1920 },
  { label: '4:5 (Instagram)', w: 1080, h: 1350 },
]

export default function AspectRatioSelector() {
  const { state, setCanvasSize } = useEditor()
  const [custom, setCustom] = useState({ w: 1080, h: 1080 })

  const handleChange = (e) => {
    const value = e.target.value
    if (value === 'custom') {
      setCanvasSize(custom.w, custom.h, 'custom')
    } else {
      const preset = presets.find(p => p.label === value)
      if (preset) setCanvasSize(preset.w, preset.h, preset.label)
    }
  }

  const handleCustomChange = (field, val) => {
    const newVal = { ...custom, [field]: parseInt(val) || 0 }
    setCustom(newVal)
    setCanvasSize(newVal.w, newVal.h, 'custom')
  }

  useEffect(() => {
    if (state?.canvas?.aspect === 'custom') {
      setCustom({ w: state.canvas.width, h: state.canvas.height })
    }
  }, [state.canvas])

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-md border border-gray-200">
      <label className="text-sm font-medium text-gray-700">Aspect Ratio:</label>
      <select
        onChange={handleChange}
        value={state?.canvas?.aspect ?? '1:1 (Square)'}
        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {presets.map(p => (
          <option key={p.label} value={p.label}>{p.label}</option>
        ))}
        <option value="custom">Custom</option>
      </select>

      {state?.canvas?.aspect === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="100"
            value={custom.w}
            onChange={(e) => handleCustomChange('w', e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
            placeholder="Width"
          />
          <span className="text-gray-500 text-sm">×</span>
          <input
            type="number"
            min="100"
            value={custom.h}
            onChange={(e) => handleCustomChange('h', e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
            placeholder="Height"
          />
        </div>
      )}
    </div>
  )
}
