import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";

function SavedDesignsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const userId = user?.user_id || user?.id; // support both

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/designs/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDesigns(data.designs);
      })
      .catch((err) => console.error("Failed to load designs:", err));
  }, [userId]);

  const openDesign = (design) => {
    navigate("/editor", {
      state: {
        savedDesignJSON: design.json_data,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        My Saved Designs
      </h1>

      {/* If no designs */}
      {designs.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-lg">
          You have no saved designs yet.
        </div>
      )}

      <div className="
        grid 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-6 max-w-6xl mx-auto
      ">
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

              <button
                onClick={() => openDesign(d)}
                className="
                  mt-3 w-full bg-blue-600 text-white py-2 rounded-lg 
                  hover:bg-blue-700 transition shadow
                "
              >
                Open & Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedDesignsPage;
