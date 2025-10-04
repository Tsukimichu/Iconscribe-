import React, { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Archive, List, X, RotateCcw } from "lucide-react";


const statusColors = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  Archived: "bg-yellow-100 text-yellow-700",
};

const ProductSection = () => {
  const [services, setServices] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/product_status")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched data:", data);
      setServices(Array.isArray(data) ? data : []);
    })
    .catch((err) => console.error("Error loading product statuses:", err));
}, []);



  const [archived, setArchived] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceStatus, setNewServiceStatus] = useState("Active");

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openPopup = (type, service = null) => {
    setPopupType(type);
    setSelectedService(service);
    if (service) {
      setNewServiceName(service.product_name);
      setNewServiceStatus(service.status);
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedService(null);
    setNewServiceName("");
    setNewServiceStatus("Active");
  };

  const handleConfirm = () => {
    if (popupType === "archive") {
      setServices((prev) => prev.filter((s) => s.product_name !== selectedService.product_name));
      setArchived((prev) => [...prev, { ...selectedService, status: "Archived" }]);
    } 
    else if (popupType === "add") {
      if (!newServiceName.trim()) return;
      const newService = { product_name: newServiceName.trim(), status: newServiceStatus };
      fetch("http://localhost:5000/api/product_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      })
        .then((res) => res.json())
        .then((saved) => setServices((prev) => [...prev, saved]))
        .catch((err) => console.error(err));
    } 
    else if (popupType === "edit" && selectedService) {
      const updatedService = { product_name: newServiceName, status: newServiceStatus };
      fetch(`http://localhost:5000/api/product_status/${selectedService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      })
        .then(() => {
          setServices((prev) =>
            prev.map((s) =>
              s.id === selectedService.id ? { ...s, ...updatedService } : s
            )
          );
        })
        .catch((err) => console.error(err));
    }

    closePopup();
  };


  const handleRestore = (service) => {
    setArchived((prev) => prev.filter((s) => s.product_name !== service.product_name));
    setServices((prev) => [...prev, { ...service, status: "Inactive" }]);
  };

  return (
    <div className="p-6 min-h-screen bg-white text-gray-900 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-extrabold"> Product Management</h1>
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

      {/* Action buttons */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => openPopup("add")}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            <Plus size={18} /> Add Service
          </button>
          <button
            onClick={() =>
              setFilter(
                filter === "all"
                  ? "Active"
                  : filter === "Active"
                  ? "Inactive"
                  : filter === "Inactive"
                  ? "Archived"
                  : "all"
              )
            }
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <List size={18} /> Filter: {filter}
          </button>
        </div>
      </div>

      {/* Active/Inactive Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-700">Product Name</th>
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
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[service.status]}`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex gap-2 items-center">
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={service.status === "Active"}
                        onChange={() => {
                          const newStatus = service.status === "Active" ? "Inactive" : "Active";
                          fetch(`http://localhost:5000/api/product_status/${service.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: newStatus }),
                          })
                            .then(() => {
                              setServices((prev) =>
                                prev.map((s) =>
                                  s.id === service.id ? { ...s, status: newStatus } : s
                                )
                              );
                            })
                            .catch((err) => console.error(err));
                        }}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-red-300 peer-focus:outline-none rounded-full peer
                          peer-checked:bg-green-500
                          peer-checked:after:translate-x-full peer-checked:after:border-white
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      ></div>
                    </label>

                    {/* Archive button */}
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

      {/* Archived Section */}
      {archived.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 text-yellow-700">🗂 Archived Services</h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-3 px-6 font-semibold text-gray-700">Product Name</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {archived.map((service, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-6">{service.product_name}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors["Archived"]}`}
                      >
                        Archived
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleRestore(service)}
                        className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition"
                      >
                        <RotateCcw size={16} /> Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}

      {/* Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-gray-900 rounded-2xl p-6 shadow-2xl max-w-md w-full relative"
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

              {/* Popup Content */}
              {popupType === "add" && (
                <>
                  <h3 className="text-xl font-bold mb-4">➕ Add New Service</h3>
                  <input
                    type="text"
                    placeholder="Service name"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg 
                               bg-gray-100 border border-gray-300 text-gray-900 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <select
                    value={newServiceStatus}
                    onChange={(e) => setNewServiceStatus(e.target.value)}
                    className="w-full px-4 py-2 mb-6 rounded-lg 
                               bg-gray-100 border border-gray-300 text-gray-900 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}

              {popupType === "edit" && (
                <>
                  <h3 className="text-xl font-bold mb-4">✏️ Edit Service</h3>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg 
                               bg-gray-100 border border-gray-300 text-gray-900 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <select
                    value={newServiceStatus}
                    onChange={(e) => setNewServiceStatus(e.target.value)}
                    className="w-full px-4 py-2 mb-6 rounded-lg 
                               bg-gray-100 border border-gray-300 text-gray-900 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-xl text-white ${
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
