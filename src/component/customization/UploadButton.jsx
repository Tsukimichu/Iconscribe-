const UploadButton = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => onUpload(f.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <label className="cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
      Upload Image
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </label>
  );
};

export default UploadButton;
