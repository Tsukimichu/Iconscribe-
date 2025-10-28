import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Archive, List, X, Edit } from "lucide-react";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const servicesWithStatus = (Array.isArray(data) ? data : []).map((s) => ({
          ...s,
          status: (s.status || "active").toLowerCase(),
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

  const updateProductInfo = async (productId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const updated = await res.json();

      setServices((prev) =>
        prev.map((s) => (s.product_id === productId ? updated : s))
      );
    } catch (err) {
      console.error("Error updating product info:", err);
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
    if (type === "edit" && service) {
      setTitle(service.product_name);
      setDescription(service.description || "");
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedService(null);
    setTitle("");
    setDescription("");
  };

  const handleConfirm = async () => {
    if (popupType === "edit" && selectedService) {
      const updatedData = {
        product_name: title.trim(),
        description: description.trim(),
      };
      await updateProductInfo(selectedService.product_id, updatedData);
    } else if (popupType === "archive" && selectedService) {
      setServices((prev) =>
        prev.filter((s) => s.product_id !== selectedService.product_id)
      );
      setArchived((prev) => [
        ...prev,
        { ...selectedService, status: "archived" },
      ]);
    }
    closePopup();
  };

  const handleStatusToggle = (service) => {
    const newStatus = service.status === "active" ? "inactive" : "active";
    updateProductStatus(service.product_id, newStatus);
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full 
                       bg-gray-100 border border-gray-300 text-gray-800
                       focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end mb-4">
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 w-60 font-semibold text-gray-700">Product Name</th>
              <th className="py-3 px-6 w-80 font-semibold text-gray-700">Description</th>
              <th className="py-3 px-6 w-28 font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 w-72 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredServices.map((service, idx) => (
                <motion.tr
                  key={service.product_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{service.product_name}</td>
                  <td className="py-3 px-6">{service.description || "—"}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-block w-20 text-center px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[service.status] || statusColors.default
                      }`}
                    >
                      {service.status || "active"}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex gap-2 items-center">
                    {/* Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={service.status === "active"}
                        onChange={() => handleStatusToggle(service)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 rounded-full relative ${
                          service.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full
                        after:h-5 after:w-5 after:transition-all ${
                          service.status === "active" ? "after:translate-x-full" : ""
                        }`}
                      ></div>
                    </label>

                    {/* Edit Button */}
                    <button
                      onClick={() => openPopup("edit", service)}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-cyan-700">
                {popupType === "edit"
                  ? "Edit Product Details"
                  : popupType === "archive"
                  ? "Archive Product"
                  : ""}
              </h2>
              {popupType === "edit" && (
                <p className="text-gray-500 text-sm mt-1">
                  Update your product name and description below.
                </p>
              )}
            </div>

            {/* Modal Content */}
            {popupType === "edit" && (
              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Product Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white/60 backdrop-blur-sm text-gray-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-gray-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Describe this product..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white/60 backdrop-blur-sm text-gray-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-gray-400 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closePopup}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition"
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
