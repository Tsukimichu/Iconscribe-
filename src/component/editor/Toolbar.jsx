// src/component/editor/Toolbar.jsx
import React, { useRef, useState, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";
import {
  exportCanvasAsPng,
  exportCanvasAsJpg,
  exportCanvasAsPdf,
} from "../../utils/exportUtils";

import AspectRatioSelector from "../AspectRatioSelector";
import {
  Type,
  Square,
  Circle,
  Minus,
  Undo2,
  Redo2,
  Upload,
  Image as ImageIcon,
  Home,
  LayoutGrid,
  ChevronDown,
  Download,
  Palette,
  X,
  Check,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../ui/ToastProvider.jsx";

// --- STYLES ---
const glassIconBtnStr =
  "p-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 hover:shadow-sm active:scale-95";
const segmentedTrayStr =
  "flex items-center gap-1 bg-blue-950/40 p-1 rounded-full border border-white/10 shadow-inner";
const primaryActionBtnStr = (color) =>
  `flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 ${color}`;

// --- URL POPOVER COMPONENT ---
function UrlPopover({ isOpen, onClose, onSubmit }) {
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) onSubmit(urlInput);
    setUrlInput("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[998]" onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-3 w-80 p-3 bg-white rounded-2xl shadow-2xl border border-blue-100 z-[999]"
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="url"
                placeholder="Paste image URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 text-gray-800 text-sm bg-gray-100 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!urlInput.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                <Check size={16} />
              </button>
            </form>
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-blue-100"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Toolbar({ onElementsClick, onSave }) {
  const { addText, addShape, addImage, undo, redo } = useEditor();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [urlPopoverOpen, setUrlPopoverOpen] = useState(false);

  const onUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    addImage(url);
    e.target.value = null;
  };

  const handleExport = async (type) => {
    const container = document.getElementById("canvas-area");
    if (!container) return alert("Canvas not found.");

    try {
      if (type === "png") {
        const dataUrl = await exportCanvasAsPng(container);
        const a = document.createElement("a"); a.href = dataUrl; a.download = "canvas.png"; a.click();
      } else if (type === "jpg") {
        const dataUrl = await exportCanvasAsJpg(container);
        const a = document.createElement("a"); a.href = dataUrl; a.download = "canvas.jpg"; a.click();
      } else if (type === "pdf") {
        await exportCanvasAsPdf(container, "canvas.pdf");
      }
      setExportOpen(false);
      showToast("Export successful!", "success");
    } catch (err) {
      console.error(err);
      showToast("Export failed", "error");
    }
  };

  return (
    <>
      {/* ================= MAIN TOOLBAR CONTAINER ================= */}
      <div 
        className="
          absolute top-6 left-1/2 -translate-x-1/2 z-[50]
          max-w-[95%] w-max
        "
      >
        <div
          className="
            flex items-center gap-3 px-3 py-2
            rounded-full
            border border-white/20 shadow-2xl shadow-blue-900/20
            bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-indigo-800/90
            backdrop-blur-xl
          "
        >
          {/* --- TRAY 1: CANVAS TOOLS --- */}
          <div className={segmentedTrayStr}>
            {/* Wrapped AspectSelector to contain its dropdown styles */}
            <div className="relative flex items-center">
                <AspectRatioSelector customTriggerStyle={glassIconBtnStr} />
            </div>
          </div>

          {/* --- TRAY 2: ADD ELEMENTS --- */}
          <div className={segmentedTrayStr}>
            <button onClick={() => addText()} className={glassIconBtnStr} title="Add Text">
              <Type className="w-5 h-5" />
            </button>
            <div className="w-px h-5 bg-white/20 mx-0.5"></div>
            
            {[
              { type: "rectangle", icon: <Square className="w-5 h-5" /> },
              { type: "circle", icon: <Circle className="w-5 h-5" /> },
              { type: "line", icon: <Minus className="w-5 h-5" /> },
            ].map((shape) => (
              <button key={shape.type} onClick={() => addShape(shape.type)} className={glassIconBtnStr}>
                {shape.icon}
              </button>
            ))}
          </div>

          {/* --- TRAY 3: IMAGES --- */}
          <div className={segmentedTrayStr}>
            <input ref={fileRef} onChange={onUpload} type="file" accept="image/*" className="hidden" />
            <button
              onClick={() => fileRef.current.click()}
              className="p-2 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-sm hover:shadow-orange-500/30 transition-all active:scale-95"
              title="Upload"
            >
              <Upload className="w-5 h-5" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setUrlPopoverOpen(!urlPopoverOpen)} 
                className={glassIconBtnStr}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <UrlPopover
                isOpen={urlPopoverOpen}
                onClose={() => setUrlPopoverOpen(false)}
                onSubmit={addImage}
              />
            </div>
          </div>

          {/* --- TRAY 4: HISTORY --- */}
          <div className={segmentedTrayStr}>
            <button onClick={undo} className={glassIconBtnStr}>
              <Undo2 className="w-5 h-5" />
            </button>
            <button onClick={redo} className={glassIconBtnStr}>
              <Redo2 className="w-5 h-5" />
            </button>
          </div>

          {/* --- DIVIDER --- */}
          <div className="w-px h-8 bg-white/20 mx-1"></div>

          {/* --- RIGHT SECTION: ACTIONS --- */}
          <div className="flex items-center gap-2">
            <button onClick={() => setLeaveModalOpen(true)} className={glassIconBtnStr} title="Home">
              <Home className="w-5 h-5" />
            </button>

            {/* ADDED: My Designs Button */}
            <button 
                onClick={() => navigate("/my-designs")} 
                className={glassIconBtnStr} 
                title="My Designs"
            >
                <LayoutGrid className="w-5 h-5" />
            </button>

            <button
                onClick={onSave}
                className={primaryActionBtnStr("bg-emerald-500 hover:bg-emerald-600 text-white")}
            >
                Save
            </button>

            {/* EXPORT */}
            <div className="relative">
                <button
                    onClick={() => setExportOpen(!exportOpen)}
                    className={primaryActionBtnStr("bg-white text-blue-900 hover:bg-blue-50")}
                >
                    Export <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {exportOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-blue-100 z-[100] overflow-hidden py-1"
                    >
                        {["png", "jpg", "pdf"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleExport(type)}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition capitalize"
                        >
                            {type.toUpperCase()}
                        </button>
                        ))}
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LEAVE MODAL ================= */}
      <AnimatePresence>
        {leaveModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLeaveModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-[90%] max-w-sm p-6 rounded-2xl shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-3">
                 <div className="p-3 bg-red-100 rounded-full text-red-500">
                    <Home className="w-8 h-8" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">Unsaved Changes</h2>
                 <p className="text-gray-500 mb-4">
                   Are you sure you want to leave? Your changes will be lost.
                 </p>
                 <div className="flex gap-3 w-full">
                    <button onClick={() => setLeaveModalOpen(false)} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={() => navigate("/dashboard")} className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition">Leave</button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}