import React, { useRef } from "react";
import { useEditor } from "../../context/EditorContext";
import { Shapes, X, Upload } from "lucide-react";

export default function ElementsPanel() {
  const { addImage, isElementsPanelOpen, toggleElementsPanel } = useEditor();
  const fileInputRef = useRef();

  if (!isElementsPanelOpen) return null;

  // --- ELEMENT ASSETS (LOCAL FOLDER) ---
  const categories = [
    {
      title: "Lines",
      items: [
        { label: "Line 1", src: "/assets/elements/lines/line1.png" },
        { label: "Line 2", src: "/assets/elements/lines/line2.png" },
        { label: "Line 3", src: "/assets/elements/lines/line3.svg" },
      ],
    },
    {
      title: "Borders",
      items: [
        { label: "Border 1", src: "/assets/elements/borders/border1.png" },
        { label: "Border 2", src: "/assets/elements/borders/border2.svg" },
      ],
    },
    {
      title: "Flowers",
      items: [
        { label: "Flower 1", src: "/assets/elements/flowers/flower1.png" },
        { label: "Flower 2", src: "/assets/elements/flowers/flower2.png" },
      ],
    },
    {
      title: "Blobs / Shapes",
      items: [
        { label: "Blob 1", src: "/assets/elements/blobs/blob1.png" },
        { label: "Blob 2", src: "/assets/elements/blobs/blob2.png" },
      ],
    },
  ];

  // --- Upload Element Handler ---
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => addImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="
        fixed top-20 left-4 w-72 max-h-[85vh] overflow-y-auto
        bg-white border border-blue-300/40 rounded-2xl shadow-xl z-50
        p-4 select-none animate-fadeIn
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
          <Shapes className="w-5 h-5" /> Elements
        </div>
        <button
          onClick={toggleElementsPanel}
          className="p-1 rounded-lg hover:bg-blue-100 transition"
        >
          <X className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Upload Element */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="
          w-full flex items-center justify-center gap-2
          py-3 mb-4 rounded-xl border border-blue-300/40 bg-blue-50
          hover:bg-blue-100 transition
        "
      >
        <Upload className="w-5 h-5 text-blue-600" />
        <span className="text-blue-700 font-medium">Upload Element</span>
      </button>
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
      />

      {/* CATEGORY SECTIONS */}
      {categories.map((cat) => (
        <div key={cat.title} className="mb-5">
          <h3 className="text-blue-700 font-semibold mb-2">
            {cat.title}
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {cat.items.map((item) => (
              <button
                key={item.src}
                onClick={() => addImage(item.src)}
                className="
                  border border-blue-200 rounded-xl overflow-hidden bg-white
                  hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]
                  hover:border-blue-400 transition
                  aspect-square flex items-center justify-center
                "
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
