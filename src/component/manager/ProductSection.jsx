import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Archive, List, X } from "lucide-react";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  archived: "bg-yellow-100 text-yellow-700",
};

const ProductSection = () => {
  const [services, setServices] = useState([]);
  const [archived, setArchived] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Add Service fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hasCustomization, setHasCustomization] = useState(false);
  const [customizationText, setCustomizationText] = useState("");
  const [hasUploadDesign, setHasUploadDesign] = useState(false);
  const [uploadDesignText, setUploadDesignText] = useState("");
  const [newServiceStatus, setNewServiceStatus] = useState("active");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const updateProductStatus = async (productId, newStatus) => {
    setServices((prev) =>
      prev.map((s) =>
        s.product_id === productId ? { ...s, status: newStatus } : s
      )
    );
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      console.error("Error updating product status:", err);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.product_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openPopup = (type, service = null) => {
    setPopupType(type);
    setSelectedService(service);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedService(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setHasCustomization(false);
    setCustomizationText("");
    setHasUploadDesign(false);
    setUploadDesignText("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleConfirm = async () => {
    if (popupType === "archive") {
      setServices((prev) =>
        prev.filter((s) => s.product_id !== selectedService.product_id)
      );
      setArchived((prev) => [
        ...prev,
        { ...selectedService, status: "archived" },
      ]);
    } else if (popupType === "add") {
      if (!title.trim()) return;
      const newService = {
        product_name: title.trim(),
        description,
        hasCustomization,
        customizationText,
        hasUploadDesign,
        uploadDesignText,
        status: newServiceStatus,
      };
      try {
        const res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newService),
        });
        const saved = await res.json();
        setServices((prev) => [...prev, saved]);
      } catch (err) {
        console.error("Error adding product:", err);
      }
    }
    closePopup();
  };

  const handleStatusToggle = (service) => {
    const newStatus = service.status === "active" ? "inactive" : "active";
    updateProductStatus(service.product_id, newStatus);
  };

  const handleRestore = (service) => {
    setArchived((prev) =>
      prev.filter((s) => s.product_id !== service.product_id)
    );
    setServices((prev) => [...prev, { ...service, status: "inactive" }]);
  };

  return (
    <div className="p-6 min-h-screen bg-white text-gray-900 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">
          Product Management
        </h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full 
                       bg-gray-100 border border-gray-300 text-gray-800
                       focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Add & Filter */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => openPopup("add")}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus size={18} /> Add Service
          </button>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-gray-200 text-gray-800 px-4 py-2 pr-8 rounded-lg 
                        hover:bg-gray-300 transition cursor-pointer focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
            <List
              className="absolute right-2 top-2.5 text-gray-600 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-700">
                Product Name
              </th>
              <th className="py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No services found.
                </td>
              </tr>
            ) : (
              filteredServices.map((service, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{service.product_name}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[service.status]
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex gap-2 items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={service.status === "active"}
                        onChange={() => handleStatusToggle(service)}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-red-300 rounded-full peer peer-checked:bg-green-500
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                          peer-checked:after:translate-x-full"
                      ></div>
                    </label>
                    <button
                      onClick={() => openPopup("archive", service)}
                      className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition"
                    >
                      <Archive size={16} /> Archive
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* ✅ Popup Section */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-gray-900 rounded-2xl p-6 shadow-2xl w-full max-w-xl relative"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={closePopup}
              >
                <X size={20} />
              </button>

              {popupType === "add" && (
                <>
                  <h3 className="text-2xl font-bold mb-5 text-cyan-700">
                    ➕ Add New Service
                  </h3>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Service Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter service title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter short description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Preview Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer"
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-3 w-full h-44 object-cover rounded-xl border"
                      />
                    )}
                  </div>

                  {/* Customization Switch */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">
                      Has Customization
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCustomization}
                        onChange={() =>
                          setHasCustomization(!hasCustomization)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  {hasCustomization && (
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Customization Button Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter button title for customization"
                        value={customizationText}
                        onChange={(e) =>
                          setCustomizationText(e.target.value)
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      />
                    </div>
                  )}

                  {/* Upload Design Switch */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">
                      Has Upload Design
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasUploadDesign}
                        onChange={() =>
                          setHasUploadDesign(!hasUploadDesign)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  {hasUploadDesign && (
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Upload Design Button Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter button title for upload design"
                        value={uploadDesignText}
                        onChange={(e) =>
                          setUploadDesignText(e.target.value)
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              {popupType === "archive" && (
                <>
                  <h3 className="text-xl font-bold mb-2 text-yellow-700">
                    ⚠️ Archive Service
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to archive{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedService?.product_name}
                    </span>
                    ? This can be restored later.
                  </p>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={closePopup}
                  className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-5 py-2 rounded-xl text-white ${
                    popupType === "archive"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-cyan-600 hover:bg-cyan-700"
                  } transition`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductSection;
