import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Archive, List, X } from "lucide-react";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  archived: "bg-yellow-100 text-yellow-700",
  default: "bg-green-100 text-green-700",
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
      .then((data) => {
        const servicesWithStatus = (Array.isArray(data) ? data : []).map(s => ({
          ...s,
          status: (s.status || "active").toLowerCase()
        }));
        setServices(servicesWithStatus);
      })
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
            <th className="py-3 px-6 w-40 font-semibold text-gray-700 text-left">
              Product Name
            </th>
            <th className="py-3 px-6 w-28 font-semibold text-gray-700 text-left">
              Status
            </th>
            <th className="py-3 px-6 w-60 font-semibold text-gray-700 text-left">
              Action
            </th>
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
                key={service.product_id} // better than idx
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{service.product_name}</td>
                <td className="py-3 px-6 w-28">
                  <span
                    className={`inline-block w-20 text-center px-3 py-1 rounded-full text-sm font-semibold ${
                      statusColors[service.status] || statusColors.default
                    }`}
                  >
                    {service.status || "active"}
                  </span>
                </td>
                <td className="py-3 px-6 w-60 flex gap-2 items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.status === "active"}
                      onChange={() => handleStatusToggle(service)}
                      className="sr-only peer"
                    />
                    <div
                      className={`
                        w-11 h-6 rounded-full relative
                        ${service.status === "active" ? "bg-green-500" : "bg-red-500"}
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full
                        after:h-5 after:w-5 after:transition-all
                        ${service.status === "active" ? "after:translate-x-full" : ""}
                      `}
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

    </div>
  );
};

export default ProductSection;