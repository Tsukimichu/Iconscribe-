import { useState } from "react";
import { Upload, XCircle, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadSection = ({
  uploadCount = 1,
  onUploadComplete,
  hasCustomization = false,
  customLabels = [],
  placeholders = [], // ✅ New prop for placeholder text
}) => {
  const [files, setFiles] = useState({});
  const navigate = useNavigate();

const handleFileChange = (e, key, index) => {
  const file = e.target.files[0];
  if (!file) return;

  setFiles((prev) => ({ ...prev, [key]: file }));
  // Send file AND index to parent
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

      {/* ✅ Customize button */}
      {hasCustomization && (
        <button
          type="button"
          onClick={handleCustomize}
          className="flex items-center justify-center gap-2 border-2 border-blue-400 bg-blue-50 rounded-xl p-4 mb-6 shadow-sm hover:border-blue-600 hover:bg-blue-100 transition"
        >
          <Edit3 className="w-6 h-6 text-blue-500" />
          <span className="text-base font-medium text-black">
            Customize Design
          </span>
        </button>
      )}

      {/* ✅ Upload buttons */}
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
              title={placeholders[i] || "Choose a file"} //browser tooltip
            />
          </label>

          {/* ✅ File info or placeholder text */}
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
