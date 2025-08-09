import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, List, X } from "lucide-react";

const initialServices = [
  { name: "Official Receipt", status: "Active" },
  { name: "Calendars", status: "Active" },
  { name: "Books", status: "Active" },
  { name: "Document Printing", status: "Active" },
  { name: "Flyers", status: "Inactive" },
  { name: "Calling Cards", status: "Inactive" },
  { name: "Posters", status: "Inactive" },
  { name: "Raffle Ticket", status: "Inactive" },
];

const statusColors = {
  Active: "bg-green-100 text-green-700 border border-green-300",
  Inactive: "bg-red-100 text-red-700 border border-red-300",
};

const ProductSection = () => {
  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceStatus, setNewServiceStatus] = useState("Active");

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPopup = (type, service = null) => {
    setPopupType(type);
    setSelectedService(service);
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
    if (popupType === "delete") {
      setServices((prev) =>
        prev.filter((s) => s.name !== selectedService.name)
      );
    } else if (popupType === "add") {
      if (!newServiceName.trim()) return;
      setServices((prev) => [
        ...prev,
        { name: newServiceName.trim(), status: newServiceStatus },
      ]);
    }
    closePopup();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Product Management
        </h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => openPopup("add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Service
        </button>
        <button className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
          <List size={18} /> Sort Items
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden"
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
            {filteredServices.map((service, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{service.name}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[service.status]}`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    onClick={() => openPopup("edit", service)}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => openPopup("delete", service)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={closePopup}
              >
                <X size={20} />
              </button>

              {popupType === "add" ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
                  <input
                    type="text"
                    placeholder="Service name"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <select
                    value={newServiceStatus}
                    onChange={(e) => setNewServiceStatus(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              ) : popupType === "delete" ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Delete {selectedService?.name}?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This action cannot be undone. Are you sure you want to
                    delete this service?
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Edit {selectedService?.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Editing functionality will be implemented later.
                  </p>
                </>
              )}

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
                    popupType === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
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
