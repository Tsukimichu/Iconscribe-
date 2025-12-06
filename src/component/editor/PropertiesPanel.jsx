// src/components/Editor/PropertiesPanel.jsx
import React, { useEffect } from 'react'
import { useEditor } from '../../context/EditorContext'
import { motion, useDragControls } from 'framer-motion'
import { 
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, 
  Trash2, Type, Image as ImageIcon, Square, 
  Palette, MousePointer2, Layers, GripHorizontal
} from 'lucide-react'

export default function PropertiesPanel() {
  const { state, updateElement, deleteElement } = useEditor()
  const selected = state.elements.find(e => e.id === state.selectedId)
  
  // 🎥 Drag Controls
  const dragControls = useDragControls()

  // --------------------------------------------------
  // 🅰️ Google Fonts Loader
  // --------------------------------------------------
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

  // --------------------------------------------------
  // 🎨 Helper Components
  // --------------------------------------------------
  const Section = ({ title, icon: Icon, children }) => (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {Icon && <Icon size={12} />}
          {title}
        </div>
      )}
      {children}
    </div>
  )

  const Label = ({ children }) => (
    <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
      {children}
    </label>
  )

  const InputGroup = ({ children, className = "" }) => (
    <div className={`bg-slate-50 border border-slate-200 rounded-xl p-3 ${className}`}>
      {children}
    </div>
  )

  // --------------------------------------------------
  // 🛑 Empty State
  // --------------------------------------------------
  if (!selected) {
    return (
      <div className="fixed right-6 top-24 w-72 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl flex flex-col items-center justify-center text-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-none">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
           <MousePointer2 size={32} />
        </div>
        <p className="text-slate-500 font-medium">No Selection</p>
        <p className="text-xs text-slate-400">Click on an element to edit its properties.</p>
      </div>
    )
  }

  // --------------------------------------------------
  // 🛠️ Main Logic
  // --------------------------------------------------
  
  const set = (k, v) => updateElement(selected.id, { [k]: v })

  const fontOptions = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 
    'Poppins', 'Roboto', 'Montserrat', 'Playfair Display', 
    'Open Sans', 'Oswald', 'Merriweather', 'Inter', 'Dancing Script'
  ]

  return (
    <motion.div 
      // 🟢 DRAG CONFIGURATION
      drag
      dragListener={false} // Only drag when using the header handle
      dragControls={dragControls}
      dragMomentum={false} // Prevents panel from sliding like ice
      
      className="
        fixed right-6 top-24 w-80 
        bg-white/95 backdrop-blur-2xl border border-white/20 shadow-2xl 
        rounded-3xl overflow-hidden z-40
        flex flex-col
        max-h-[80vh]
      "
    >
      {/* 🟢 DRAGGABLE HEADER 
         Added 'cursor-grab', onPointerDown event, and a grip icon
      */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="
            p-4 border-b border-slate-100 flex items-center justify-between 
            bg-white/80 backdrop-blur-md z-10 
            cursor-grab active:cursor-grabbing select-none
        "
      >
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Palette size={18} className="text-blue-500" /> 
          Design
        </h3>
        <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
            {selected.type}
            </span>
            <GripHorizontal size={18} className="text-slate-300" />
        </div>
      </div>

      <div className="p-5 space-y-8 flex-1 overflow-y-auto scrollbar-hide">
        
        {/* --- GLOBAL: Opacity & Layering --- */}
        <Section title="Appearance" icon={Layers}>
            <InputGroup>
                <Label>Opacity</Label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={selected.opacity ?? 1}
                        onChange={(e) => set('opacity', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs font-mono w-8 text-right text-slate-600">
                        {Math.round((selected.opacity ?? 1) * 100)}%
                    </span>
                </div>
            </InputGroup>
        </Section>

        {/* --- TYPE: TEXT --- */}
        {(selected.type === 'text' || selected.type === 'textbox') && (
          <Section title="Typography" icon={Type}>
            <InputGroup className="space-y-4">
              
              {/* Font Family */}
              <div>
                <Label>Font Family</Label>
                <select
                  value={selected.fontFamily ?? 'Arial'}
                  onChange={(e) => set('fontFamily', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ fontFamily: selected.fontFamily }}
                >
                  {fontOptions.map(f => (
                    <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Size & Weight Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <Label>Size (px)</Label>
                   <input
                    type="number"
                    min="1"
                    value={selected.fontSize ?? 24}
                    onChange={(e) => set('fontSize', parseInt(e.target.value) || 12)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                   <Label>Color</Label>
                   <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 h-[38px]">
                      <input
                        type="color"
                        value={selected.fill ?? '#000000'}
                        onChange={(e) => set('fill', e.target.value)}
                        className="w-6 h-6 rounded border-none p-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-500 uppercase flex-1">
                          {selected.fill ?? '#000'}
                      </span>
                   </div>
                </div>
              </div>

              {/* Toggles Row */}
              <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg">
                 <button
                    onClick={() => set('fontWeight', selected.fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`flex-1 p-1.5 rounded-md transition-all ${selected.fontWeight === 'bold' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    <Bold size={16} className="mx-auto"/>
                 </button>
                 <button
                    onClick={() => set('fontStyle', selected.fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`flex-1 p-1.5 rounded-md transition-all ${selected.fontStyle === 'italic' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    <Italic size={16} className="mx-auto"/>
                 </button>
                 <div className="w-px bg-slate-300 my-1"></div>
                 <button
                    onClick={() => set('textAlign', 'left')}
                    className={`flex-1 p-1.5 rounded-md transition-all ${selected.textAlign === 'left' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    <AlignLeft size={16} className="mx-auto"/>
                 </button>
                 <button
                    onClick={() => set('textAlign', 'center')}
                    className={`flex-1 p-1.5 rounded-md transition-all ${selected.textAlign === 'center' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    <AlignCenter size={16} className="mx-auto"/>
                 </button>
                 <button
                    onClick={() => set('textAlign', 'right')}
                    className={`flex-1 p-1.5 rounded-md transition-all ${selected.textAlign === 'right' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    <AlignRight size={16} className="mx-auto"/>
                 </button>
              </div>

            </InputGroup>
          </Section>
        )}

        {/* --- TYPE: SHAPE --- */}
        {(selected.type === 'rect' || selected.type === 'circle' || selected.type === 'shape') && (
          <Section title="Shape Style" icon={Square}>
            <InputGroup>
               <Label>Fill Color</Label>
               <div className="flex gap-3 items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-200">
                    <input
                        type="color"
                        value={selected.fill || '#000000'}
                        onChange={(e) => set('fill', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                      <input 
                        type="text" 
                        value={selected.fill || '#000000'}
                        onChange={(e) => set('fill', e.target.value)}
                        className="w-full text-sm font-mono border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 uppercase text-slate-600"
                      />
                  </div>
               </div>
            </InputGroup>
          </Section>
        )}

        {/* --- TYPE: IMAGE --- */}
        {(selected.type === 'image' || selected.type === 'maskedImage') && (
          <Section title="Image Source" icon={ImageIcon}>
             <InputGroup>
                <Label>Source URL</Label>
                <textarea
                  value={selected.src}
                  onChange={(e) => set('src', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 break-all resize-none h-20"
                />
             </InputGroup>
          </Section>
        )}

      </div>

      {/* Footer / Delete */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => deleteElement(selected.id)}
          className="
            w-full flex items-center justify-center gap-2 
            py-2.5 rounded-xl 
            bg-red-50 text-red-600 font-semibold text-sm
            hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30
            transition-all duration-200
          "
        >
          <Trash2 size={16} />
          Delete Element
        </button>
      </div>
    </motion.div>
  )
}