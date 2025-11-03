import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import templates from "../data/templates.json";
import { ArrowLeft } from "lucide-react"; // Optional icon for back button

function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Brochure",
    "Calendar",
    "Business Card",
    "Flyer",
    "Poster",
    "Invitation",
    "Label",
    "Newsletter",
  ];

  // Filter templates based on category
  const filteredTemplates = templates.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  const handleSelect = (tpl) => {
    navigate(`/customize?template=${encodeURIComponent(tpl.json)}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="relative h-[150px] bg-blue-700 text-white flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-bold mb-2">Create from a Template</h1>
        <p className="text-gray-200 text-lg max-w-2xl">
          Choose a ready-made design
        </p>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-full shadow hover:bg-blue-100 transition"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TEMPLATE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => handleSelect(tpl)}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
          >
            <img
              src={tpl.preview}
              alt={tpl.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="font-semibold text-lg text-gray-800">
                {tpl.name}
              </h2>
              <p className="text-gray-500 text-sm">{tpl.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateGallery;
