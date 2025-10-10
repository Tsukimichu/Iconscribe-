import { useState } from "react";
import axios from "axios";
import { Upload, XCircle } from "lucide-react";
import { useToast } from "../component/ui/ToastContext";

const UploadSection = ({ productId, uploadCount = 1, allowCustomization = false, onUploadComplete }) => {
  const [files, setFiles] = useState({ image1: null, image2: null });
  const [previews, setPreviews] = useState({ image1: null, image2: null });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleUpload = async () => {
    if (!productId) {
      showToast("Missing product ID", "error");
      return;
    }

    setLoading(true);

    try {
      let response;
      const formData = new FormData();

      if (uploadCount === 1) {
        formData.append("image1", files.image1);
        response = await axios.post(`http://localhost:5000/products/upload/single/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (uploadCount === 2) {
        if (files.image1) formData.append("image1", files.image1);
        if (files.image2) formData.append("image2", files.image2);

        response = await axios.post(`http://localhost:5000/products/upload/double/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      showToast("Files uploaded successfully!", "success");
      onUploadComplete && onUploadComplete(response.data); // return uploaded paths to parent
    } catch (error) {
      console.error(error);
      showToast("Failed to upload files", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-2xl shadow bg-white">
      <h2 className="font-semibold text-lg mb-2">Upload Your File{uploadCount > 1 ? "s" : ""}</h2>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Upload size={20} />
          <span>Upload File 1</span>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "image1")} hidden />
        </label>

        {previews.image1 && (
          <div className="relative">
            <img src={previews.image1} alt="Preview 1" className="max-h-40 rounded-md border" />
            <button
              className="absolute top-1 right-1 text-red-600"
              onClick={() => setPreviews((p) => ({ ...p, image1: null }))}
            >
              <XCircle size={18} />
            </button>
          </div>
        )}

        {uploadCount === 2 && (
          <>
            <label className="flex items-center gap-2 cursor-pointer">
              <Upload size={20} />
              <span>Upload File 2</span>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "image2")} hidden />
            </label>

            {previews.image2 && (
              <div className="relative">
                <img src={previews.image2} alt="Preview 2" className="max-h-40 rounded-md border" />
                <button
                  className="absolute top-1 right-1 text-red-600"
                  onClick={() => setPreviews((p) => ({ ...p, image2: null }))}
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadSection;
