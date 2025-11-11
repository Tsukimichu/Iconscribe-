// ----------------------------
// src/pages/EditorPage.jsx
// ----------------------------
import React from "react";
import Toolbar from "../component/editor/Toolbar";
import CanvasWorkspace from "../component/editor/CanvasWorkspace";
import LayersPanel from "../component/editor/LayersPanel";
import PropertiesPanel from "../component/editor/PropertiesPanel";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header Toolbar */}
      <header className="bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Toolbar />
        </div>
      </header>

      {/* Main Editor Layout */}
      <main className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <aside className="flex-shrink-0 w-[250px] min-w-[220px] bg-white overflow-y-auto transition-all duration-300 pl-2 pt-2">
          <LayersPanel />
        </aside>

        {/* Canvas Section */}
        <section
          className="
            flex-1 flex items-center justify-center 
            p-2 sm:p-4 md:p-6 lg:p-8 
            overflow-hidden bg-gray-50
          "
        >
          <div className="w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center">
            <CanvasWorkspace />
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="flex-shrink-0 w-[350px] min-w-[260px] bg-white pt-2 overflow-y-auto transition-all duration-300">
          <PropertiesPanel />
        </aside>
      </main>
    </div>
  );
}
