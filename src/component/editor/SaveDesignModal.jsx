// src/component/editor/SaveDesignModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function SaveDesignModal({
  open,
  onClose,
  onSaveNew,
  onSaveExisting,
  initialName,
  isEditingExisting,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialName || "");
    }
  }, [open, initialName]);

  if (!open) return null;

  const handleSaveNew = () => {
    if (!name.trim()) return;
    onSaveNew(name.trim());
    onClose();
  };

  const handleSaveExisting = () => {
    if (!name.trim()) return;
    onSaveExisting(name.trim());
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl border"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditingExisting ? "Save Changes" : "Save Design"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* INPUT */}
        <label className="text-gray-600 font-medium">Design Name</label>
        <input
          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="My Design"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>

          {/* Save New */}
          <button
            onClick={handleSaveNew}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Save New
          </button>

          {/* Save Changes (only if editing existing) */}
          {isEditingExisting && (
            <button
              onClick={handleSaveExisting}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
