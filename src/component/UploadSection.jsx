import { useState } from "react";
import { Upload, XCircle } from "lucide-react";

const UploadSection = ({ uploadCount = 1, onUploadComplete }) => {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: previewURL }));

    onUploadComplete && onUploadComplete({ files: [file] });
  };

  const handleRemove = (key) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));
    onUploadComplete && onUploadComplete({ files: [] });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-black mb-6">
        Upload Your File{uploadCount > 1 ? "s" : ""}
      </h2>

      {["image1", "image2"].slice(0, uploadCount).map((key, i) => (
        <div key={i} className="flex flex-col gap-3 mb-8">
          {/* Upload Button */}
          <label className="flex items-center justify-center gap-2 border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 shadow-sm hover:border-yellow-600 hover:bg-yellow-100 transition cursor-pointer">
            <Upload className="w-6 h-6 text-yellow-500" />
            <span className="text-base font-medium text-black">Select File</span>
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleFileChange(e, key)}
            />
          </label>

          {/* Reserved space for filename (prevents jumping) */}
          <div className="min-h-[1rem] flex items-center justify-between">
            {files[key] ? (
              <>
                <p className="text-sm text-green-600 truncate">
                  File Selected:{" "}
                  <span className="font-s text-black">
                    {files[key].name}
                  </span>
                </p>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(key)}
                >
                  <XCircle size={18} />
                </button>
              </>
            ) : (
              <span className="text-cs text-gray-400 italic">
                No file selected
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadSection;
