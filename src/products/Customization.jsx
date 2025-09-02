import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Customization = () => {
  const [text, setText] = useState("Your text here");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800 text-white p-4 space-y-4">
        <button className="w-full bg-gray-700 p-2 rounded">Upload</button>
        <button className="w-full bg-gray-700 p-2 rounded">Images</button>
        <button className="w-full bg-gray-700 p-2 rounded">Text</button>
        <button className="w-full bg-gray-700 p-2 rounded">Elements</button>
        <button className="w-full bg-gray-700 p-2 rounded">Background</button>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="fileInput"
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center bg-gray-200 p-2 space-x-2">
          <button className="px-3 py-1 bg-white rounded border">Undo</button>
          <button className="px-3 py-1 bg-white rounded border">Redo</button>
          <button className="px-3 py-1 bg-white rounded border">Save</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            Confirm Design
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex justify-center items-center bg-white">
          <div className="w-[700px] h-[400px] bg-gray-200 flex justify-center items-center relative">
            {/* Uploaded Image */}
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded Design"
                className="absolute w-40 h-40 object-contain"
              />
            )}

            {/* Text Box */}
            <div className="absolute">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border border-dashed px-2 py-1 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;
