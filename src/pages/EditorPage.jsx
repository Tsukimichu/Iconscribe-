// src/pages/EditorPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Toolbar from "../component/editor/Toolbar";
import CanvasWorkspace from "../component/editor/CanvasWorkspace";
import LayersPanel from "../component/editor/LayersPanel";
import PropertiesPanel from "../component/editor/PropertiesPanel";
import ElementPanel from "../component/editor/ElementsPanel";
import SaveDesignModal from "../component/editor/SaveDesignModal";
import { useToast } from "../component/ui/ToastProvider";
import { useEditor } from "../context/EditorContext";
import { useAuth } from "../context/authContext";

export default function EditorPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const template = location.state?.template || null;
  const recentDesignId = location.state?.recentDesignId || null;
  const savedDesignJSON = location.state?.savedDesignJSON || null;
  const savedDesignId = location.state?.design_id || null;
  const savedDesignName = location.state?.design_name || "";

  const {
    importFromJSON,
    saveCurrentDesign,
    saveDesignToDB,
    activeDesignId,
    setActiveDesignId,
  } = useEditor();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [currentDesignName, setCurrentDesignName] =
    useState(savedDesignName || "");

  const MIN_WIDTH = 1024;
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < MIN_WIDTH
  );

  const [showElements, setShowElements] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // --------------------------------------------------
  // Sync activeDesignId when opening saved design
  // --------------------------------------------------
  useEffect(() => {
    setActiveDesignId(savedDesignId || null);
  }, [savedDesignId, setActiveDesignId]);

  // --------------------------------------------------
  // Save New Design (always create new)
  // --------------------------------------------------
  const saveNewDesign = async (name) => {
    const res = await saveDesignToDB(user?.user_id, name, true); // forceNew = true
    if (res?.success) {
      showToast("New design saved!", "success");
      setCurrentDesignName(name);
      // After Save New, we treat it as a "new" design still (no ID known from backend)
      setActiveDesignId(null);
    } else {
      showToast("Failed to save new design.", "error");
    }
  };

  // --------------------------------------------------
  // Save Changes (update existing)
  // --------------------------------------------------
  const saveExistingDesign = async (name) => {
    if (!activeDesignId) {
      showToast("No existing design selected to update.", "error");
      return;
    }

    const res = await saveDesignToDB(user?.user_id, name, false);
    if (res?.success) {
      showToast("Changes saved!", "success");
      setCurrentDesignName(name);
    } else {
      showToast("Failed to save changes.", "error");
    }
  };

  // --------------------------------------------------
  // Responsive watcher
  // --------------------------------------------------
  useEffect(() => {
    const handleResize = () =>
      setIsSmallScreen(window.innerWidth < MIN_WIDTH);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --------------------------------------------------
  // Load saved design from DB
  // --------------------------------------------------
  useEffect(() => {
    if (!savedDesignJSON || loaded) return;

    try {
      const parsed = JSON.parse(savedDesignJSON);
      importFromJSON(parsed, true);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to load saved design JSON:", err);
    }
  }, [savedDesignJSON, importFromJSON, loaded]);

  // --------------------------------------------------
  // Load recent design or template (if not loading saved design)
// --------------------------------------------------
  useEffect(() => {
    if (isSmallScreen || loaded || savedDesignJSON) return;

    // Load from localStorage recent designs
    if (recentDesignId) {
      try {
        const raw = localStorage.getItem("recent-designs");
        if (!raw) return;

        const list = JSON.parse(raw);
        const found = list.find((d) => d.id === recentDesignId);
        if (!found) return;

        importFromJSON(found.editorState, true);
        setActiveDesignId(null);
        setCurrentDesignName(found.name);
        setLoaded(true);
      } catch (err) {
        console.error("Failed to load recent design:", err);
      }
      return;
    }

    // Load template
    if (template) {
      const loadTemplate = async () => {
        try {
          let jsonData = template.json;

          if (typeof jsonData === "string" && jsonData.endsWith(".json")) {
            const response = await fetch(jsonData);
            jsonData = await response.json();
          }

          importFromJSON(jsonData, true);
          setActiveDesignId(null);
          setCurrentDesignName(template.name);
          setLoaded(true);

          setTimeout(() => {
            saveCurrentDesign({
              name: template.name,
              category: template.category,
              templateCategory: template.category,
              templateId: template.id,
              preview: template.preview,
            });
          }, 600);
        } catch (err) {
          console.error("Error loading template:", err);
        }
      };

      loadTemplate();
    }
  }, [
    template,
    recentDesignId,
    importFromJSON,
    saveCurrentDesign,
    savedDesignJSON,
    loaded,
    isSmallScreen,
    setActiveDesignId,
  ]);

  // --------------------------------------------------
  // Small screen warning
  // --------------------------------------------------
  if (isSmallScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold mb-3">Desktop Only</h1>
          <p>Use a larger screen.</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white z-20 w-full flex justify-center px-2 py-3">
        <Toolbar
          onElementsClick={() => setShowElements((prev) => !prev)}
          onSave={() => setSaveModalOpen(true)}
        />
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-[250px] bg-white overflow-y-auto pl-2 pt-2">
          <LayersPanel />
        </aside>

        <section className="flex-1 flex items-center justify-center p-4 bg-gray-50">
          <CanvasWorkspace />
        </section>

        <aside className="w-[350px] bg-white pt-2 overflow-y-auto">
          <PropertiesPanel />
        </aside>

        {showElements && (
          <div className="absolute left-[250px] top-0 bottom-0 w-[260px] bg-white shadow-xl border-r z-50">
            <ElementPanel onClose={() => setShowElements(false)} />
          </div>
        )}
      </main>

      <SaveDesignModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSaveNew={saveNewDesign}
        onSaveExisting={saveExistingDesign}
        initialName={currentDesignName}
        isEditingExisting={!!activeDesignId}
      />
    </div>
  );
}
