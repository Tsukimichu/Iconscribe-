import { useState } from "react";
import { Upload, XCircle, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadSection = ({
  uploadCount = 1,
  onUploadComplete,
  hasCustomization = false,
  customLabels = [],
  placeholders = [], 
}) => {
  const [files, setFiles] = useState({});
  const navigate = useNavigate();

const handleFileChange = (e, key, index) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSizeMB = 5; // 🔹 set max size here (e.g. 5 MB)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    alert(`⚠️ File too large! Please upload files below ${maxSizeMB} MB.`);
    e.target.value = ""; // reset file input
    return;
  }

  setFiles((prev) => ({ ...prev, [key]: file }));
  onUploadComplete && onUploadComplete({ files: [file] }, index);
};


  const handleRemove = (key) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    onUploadComplete && onUploadComplete({ files: [] });
  };

  const handleCustomize = () => {
    navigate("/customize");
  };

  // Determine upload labels
  const uploadKeys = customLabels.length
    ? customLabels
    : ["File 1", "File 2"].slice(0, uploadCount);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-black mb-6">
        Upload Your File{uploadKeys.length > 1 ? "s" : ""}
      </h2>

      {/* Customize button */}
      {hasCustomization && (
        <div className="flex justify-center gap-4 mb-8">
          {/* Customize Design Button */}
          <button
            type="button"
            onClick={handleCustomize}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Edit3 className="w-6 h-6 text-white" />
            <span className="text-base">Design</span>
          </button>

          {/* Choose Template Button */}
          <button
            type="button"
            onClick={() => navigate('/template-gallery')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold px-6 py-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Upload className="w-6 h-6 text-gray-900" />
            <span className="text-base">Template</span>
          </button>
        </div>
      )}

      {/* Upload buttons */}
      {uploadKeys.map((label, i) => (
        <div key={i} className="flex flex-col gap-3 mb-6">
          <label className="flex items-center justify-center gap-2 border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 shadow-sm hover:border-yellow-600 hover:bg-yellow-100 transition cursor-pointer">
            <Upload className="w-6 h-6 text-yellow-500" />
            <span className="text-base font-medium text-black">
              {customLabels.length ? label : "Upload Your Design"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
             onChange={(e) => handleFileChange(e, label, i)}
              title={placeholders[i] || "Choose a file"}
            />
          </label>

          {/* File info or placeholder text */}
          <div className="min-h-[1rem] flex items-center justify-between">
            {files[label] ? (
              <>
                <p className="text-sm text-green-600 truncate">
                  File Selected:{" "}
                  <span className="font-s text-black">{files[label].name}</span>
                </p>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(label)}
                >
                  <XCircle size={18} />
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-400 italic">
                {placeholders[i] || "No file selected"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadSection;
