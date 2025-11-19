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
  // ➤ Screen Size Restriction Logic
  const MIN_WIDTH = 1024; // Set your cutoff pixel width here
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < MIN_WIDTH);

  const [showElements, setShowElements] = useState(false);
  const [loaded, setLoaded] = useState(false); // prevents double loading

  // ➤ Receive template from TemplateGallery
  const location = useLocation();
  const template = location.state?.template;

  // Import function from context
  const { importFromJSON } = useEditor();

  // ------------------------------------------------------------
  // ⭐ 1. Monitor Screen Size
  // ------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < MIN_WIDTH);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ------------------------------------------------------------
  // ⭐ 2. Load template JSON (supports URL JSON or object JSON)
  // ------------------------------------------------------------
  useEffect(() => {
    // If screen is small, we can skip loading to save resources (optional)
    if (isSmallScreen) return;

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
  }, [template, importFromJSON, loaded, isSmallScreen]);

  // ------------------------------------------------------------
  // ⭐ 3. Render "Mobile Not Supported" Screen
  // ------------------------------------------------------------
  if (isSmallScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Optional: Add your Logo here */}
          <div className="mb-6 text-indigo-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Desktop Experience Only
          </h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Our editor is designed for a larger workspace to give you the best design precision. Please switch to a <b>Laptop</b> or <b>Desktop</b> to continue editing.
          </p>
          <div className="text-sm text-gray-400 font-medium">
            Current Width: {window.innerWidth}px <br/>
            Required: {MIN_WIDTH}px
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // ⭐ 4. Render Actual Editor (Desktop)
  // ------------------------------------------------------------
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