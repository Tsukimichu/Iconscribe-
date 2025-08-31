import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Customization = () => {
  const { productName } = useParams();
  const [customDesign, setCustomDesign] = useState("");

  const handleDesignUpload = (e) => {
    setCustomDesign(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = () => {
    alert(`Customization submitted for ${productName}`);
    // Add backend logic or API calls here if needed
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Customize Your {productName}
      </h2>

      <label className="block mb-2">Upload Your Designs:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleDesignUpload}
        className="mb-4"
      />

      {customDesign && (
        <div className="mt-4">
          <p className="font-semibold">Preview:</p>
          <img src={customDesign} alt="Preview" className="w-64 border rounded" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Submit Customization
      </button>
    </div>
  );
};

export default Customization;
