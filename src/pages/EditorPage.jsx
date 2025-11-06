// ----------------------------
// src/pages/EditorPage.jsx
// ----------------------------
import React from 'react'
import Toolbar from '../component/editor/Toolbar'
import CanvasWorkspace from '../component/editor/CanvasWorkspace'
import LayersPanel from '../component/editor/LayersPanel'
import PropertiesPanel from '../component/editor/PropertiesPanel'

export default function EditorPage(){
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Toolbar />
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-white overflow-auto">
          <LayersPanel />
        </aside>
        <section className="flex-1 flex items-stretch justify-center p-6">
          <CanvasWorkspace />
        </section>
        <aside className="w-80 border-l bg-white overflow-auto">
          <PropertiesPanel />
        </aside>
      </main>
    </div>
  )
}