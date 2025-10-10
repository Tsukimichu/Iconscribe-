import { useState } from "react";
import axios from "axios";
import { Upload, XCircle, CheckCircle } from "lucide-react";
import { useToast } from "../component/ui/ToastProvider";

const UploadSection = ({ orderItemId, uploadCount = 1, onUploadComplete }) => {
  const [files, setFiles] = useState({ image1: null, image2: null });
  const [previews, setPreviews] = useState({ image1: null, image2: null });
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { showToast } = useToast();

  // Handle file selection
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    setUploaded(false);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!orderItemId) {
      showToast("Missing order item ID", "error");
      return;
    }

    if (uploadCount === 1 && !files.image1) {
      showToast("Please select a file before uploading", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      let response;

      if (uploadCount === 1) {
        formData.append("image1", files.image1);
        response = await axios.post(
          `http://localhost:5000/api/orders/upload/single/${orderItemId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else if (uploadCount === 2) {
        if (files.image1) formData.append("image1", files.image1);
        if (files.image2) formData.append("image2", files.image2);
        response = await axios.post(
          `http://localhost:5000/api/orders/upload/double/${orderItemId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      showToast("Files uploaded successfully!", "success");
      setUploaded(true);
      onUploadComplete && onUploadComplete(response.data);
    } catch (error) {
      console.error("❌ Upload error:", error);
      showToast("Failed to upload files", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-black mb-6">
        Upload Your File{uploadCount > 1 ? "s" : ""}
      </h2>

      {/* Upload File 1 */}
      <div className="flex flex-col gap-4 mb-6">
        <h3 className="block text-base font-semibold text-black">File 1:</h3>

        <label className="flex items-center justify-center gap-2 border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 shadow-sm hover:border-yellow-600 hover:bg-yellow-100 transition cursor-pointer">
          <Upload className="w-6 h-6 text-yellow-500" />
          <span className="text-base font-medium text-black">
            Upload Your File
          </span>
          <input
            type="file"
            name="image1"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e, "image1")}
          />
        </label>

        {files.image1 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <p>
              Selected File:{" "}
              <span className="font-medium text-black">
                {files.image1.name}
              </span>
            </p>
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={() => setFiles((prev) => ({ ...prev, image1: null }))}
            >
              <XCircle size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Upload File 2 (if applicable) */}
      {uploadCount === 2 && (
        <div className="flex flex-col gap-4 mb-6">
          <h3 className="block text-base font-semibold text-black">File 2:</h3>

          <label className="flex items-center justify-center gap-2 border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 shadow-sm hover:border-yellow-600 hover:bg-yellow-100 transition cursor-pointer">
            <Upload className="w-6 h-6 text-yellow-500" />
            <span className="text-base font-medium text-black">
              Upload Your File
            </span>
            <input
              type="file"
              name="image2"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e, "image2")}
            />
          </label>

          {files.image2 && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <p>
                Selected File:{" "}
                <span className="font-medium text-black">
                  {files.image2.name}
                </span>
              </p>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => setFiles((prev) => ({ ...prev, image2: null }))}
              >
                <XCircle size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:scale-105"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Upload Success Message */}
      {uploaded && (
        <div className="flex items-center gap-2 mt-4 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Files uploaded successfully!
          </span>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
