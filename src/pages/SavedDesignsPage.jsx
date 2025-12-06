// src/pages/SavedDesignsPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";

function SavedDesignsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const userId = user?.user_id || user?.id;

  // Load all designs
  const loadDesigns = () => {
    fetch(`${API_URL}/designs/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDesigns(data.designs);
      })
      .catch((err) => console.error("Failed to load designs:", err));
  };

  useEffect(() => {
    if (!userId) return;
    loadDesigns();
  }, [userId]);

  // Open design for editing
  const openDesign = (design) => {
    navigate("/editor", {
      state: {
        savedDesignJSON: design.json_data,
        design_id: design.design_id,
        design_name: design.design_name,
        preview_image: design.preview_image,
      },
    });
  };

  // Delete design
  const deleteDesign = async (designId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this design?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/designs/delete/${designId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Design deleted successfully.");
        loadDesigns(); // Refresh the list
      } else {
        alert("Failed to delete design.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        My Saved Designs
      </h1>

      {designs.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-lg">
          You have no saved designs yet.
        </div>
      )}

      <div
        className="
          grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          gap-6 max-w-6xl mx-auto
        "
      >
        {designs.map((d) => (
          <div
            key={d.design_id}
            className="
              bg-white rounded-xl shadow hover:shadow-xl 
              transition p-3 border border-gray-200
            "
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={d.preview_image}
                alt="Design Preview"
                className="w-full h-48 object-cover hover:scale-105 transition duration-300"
              />
            </div>

            <div className="mt-3">
              <h2 className="font-semibold text-gray-800 truncate">
                {d.design_name}
              </h2>

              {/* Open Button */}
              <button
                onClick={() => openDesign(d)}
                className="
                  mt-3 w-full bg-blue-600 text-white py-2 rounded-lg 
                  hover:bg-blue-700 transition shadow
                "
              >
                Open & Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteDesign(d.design_id)}
                className="
                  mt-2 w-full bg-red-500 text-white py-2 rounded-lg 
                  hover:bg-red-600 transition shadow
                "
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedDesignsPage;
