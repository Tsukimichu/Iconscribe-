import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import templates from "../data/templates.json";
import { ArrowLeft, LayoutTemplate } from "lucide-react"; // Switched ArrowBigLeft to standard ArrowLeft for cleaner look

function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Brochure",
    "Calendar",
    "Calling Card",
    // "Flyer",
    "Poster",
    // "Invitation",
    "Label",
  ];

  // Filter templates by category
  const filteredTemplates = templates.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  // 👉 This sends the template JSON safely via router state
  const handleSelect = (tpl) => {
    navigate("/editor", {
      state: { template: tpl },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-blue-700 to-blue-800 text-white pt-12 pb-16 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          {/* BACK BUTTON - Redesigned to be less intrusive but accessible */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-0 left-0 md:left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="mb-4 p-3 bg-blue-600/50 rounded-full inline-block">
            <LayoutTemplate className="w-8 h-8 text-blue-100" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Create from a Template
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl font-medium">
            Jumpstart your design process with our professional layouts.
          </p>
        </div>
      </div>

      {/* STICKY CATEGORY FILTER */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TEMPLATE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Image Container with Zoom Effect */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={tpl.preview}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Overlay Button on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-blue-700 font-bold py-2 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Use Template
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {tpl.name}
                    </h2>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {tpl.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 opacity-60">
            <LayoutTemplate className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500">No templates found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateGallery;