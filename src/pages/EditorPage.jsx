// ----------------------------
// src/pages/EditorPage.jsx
// ----------------------------
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Toolbar from "../component/editor/Toolbar";
import CanvasWorkspace from "../component/editor/CanvasWorkspace";
import LayersPanel from "../component/editor/LayersPanel";
import PropertiesPanel from "../component/editor/PropertiesPanel";
import ElementPanel from "../component/editor/ElementsPanel";

import { useEditor } from "../context/EditorContext";

export default function EditorPage() {
  const [showElements, setShowElements] = useState(false);
  const [loaded, setLoaded] = useState(false); // prevents double loading

  // ➤ Receive template from TemplateGallery
  const location = useLocation();
  const template = location.state?.template;

  // Import function from context
  const { importFromJSON } = useEditor();

  // ------------------------------------------------------------
  // ⭐ Load template JSON (supports URL JSON or object JSON)
  // ------------------------------------------------------------
  useEffect(() => {
    // avoid double loading
    if (!template || loaded) return;

    const loadTemplate = async () => {
      try {
        let jsonData = template.json;

        // If json is a URL, fetch the file
        if (typeof jsonData === "string" && jsonData.endsWith(".json")) {
          const response = await fetch(jsonData);
          jsonData = await response.json();
        }

        // Import into editor
        importFromJSON(jsonData);
        setLoaded(true);
      } catch (err) {
        console.error("Failed to load template JSON:", err);
        alert("⚠ Error loading template file. Check console for details.");
      }
    };

    loadTemplate();
  }, [template, importFromJSON, loaded]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header Toolbar */}
      <header className="bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Toolbar onElementsClick={() => setShowElements((prev) => !prev)} />
        </div>
      </header>

      {/* Main Editor Layout */}
      <main className="flex flex-1 overflow-hidden min-h-0 relative">

        {/* Left Sidebar */}
        <aside className="flex-shrink-0 w-[250px] min-w-[220px] bg-white overflow-y-auto pl-2 pt-2">
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
        <aside className="flex-shrink-0 w-[350px] min-w-[260px] bg-white pt-2 overflow-y-auto">
          <PropertiesPanel />
        </aside>

        {/* Elements Overlay Panel */}
        {showElements && (
          <div
            className="
              absolute left-[250px] top-0 bottom-0 
              w-[260px] bg-white shadow-xl border-r 
              z-50 animate-slideIn
            "
          >
            <ElementPanel onClose={() => setShowElements(false)} />
          </div>
        )}

      </main>
    </div>
  );
}
