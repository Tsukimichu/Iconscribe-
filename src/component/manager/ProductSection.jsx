import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Archive, List, X } from "lucide-react";

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
  Active: "bg-green-500/20 text-green-400 border border-green-500/30",
  Inactive: "bg-red-500/20 text-red-400 border border-red-500/30",
  Archived: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
};

const ProductSection = () => {
  const [services, setServices] = useState(initialServices);
  const [archived, setArchived] = useState([]);
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
    if (service) {
      setNewServiceName(service.name);
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
      setServices((prev) => prev.filter((s) => s.name !== selectedService.name));
      setArchived((prev) => [...prev, { ...selectedService, status: "Archived" }]);
    } else if (popupType === "add") {
      if (!newServiceName.trim()) return;
      setServices((prev) => [
        ...prev,
        { name: newServiceName.trim(), status: newServiceStatus },
      ]);
    } else if (popupType === "edit" && selectedService) {
      setServices((prev) =>
        prev.map((s) =>
          s.name === selectedService.name
            ? { ...s, name: newServiceName, status: newServiceStatus }
            : s
        )
      );
    }
    closePopup();
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full 
                       bg-slate-800 border border-white/10 text-white
                       focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => openPopup("add")}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
        >
          <Plus size={18} /> Add Service
        </button>
        <button className="flex items-center gap-2 bg-slate-800 text-gray-300 px-4 py-2 rounded-lg border border-white/10 hover:bg-slate-700 transition">
          <List size={18} /> Sort Items
        </button>
      </div>

      {/* Active/Inactive Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800/80 shadow-xl rounded-2xl overflow-hidden border border-white/10"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/70 sticky top-0">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-300">
                Product Name
              </th>
              <th className="py-3 px-6 font-semibold text-gray-300">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/10 hover:bg-slate-700/30 transition"
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
                    className="flex items-center gap-1 bg-slate-700 px-3 py-1 rounded-lg hover:bg-slate-600 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => openPopup("archive", service)}
                    className="flex items-center gap-1 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-600/40 transition"
                  >
                    <Archive size={16} /> Archive
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Archived Section */}
      {archived.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">Archived Services</h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-800/80 shadow-xl rounded-2xl overflow-hidden border border-white/10"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/70 sticky top-0">
                <tr>
                  <th className="py-3 px-6 font-semibold text-gray-300">
                    Product Name
                  </th>
                  <th className="py-3 px-6 font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {archived.map((service, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/10 hover:bg-slate-700/30 transition"
                  >
                    <td className="py-3 px-6">{service.name}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors["Archived"]}`}
                      >
                        Archived
                      </span>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 
                         text-white rounded-2xl p-6 shadow-2xl max-w-sm w-full 
                         border border-white/10 backdrop-blur-xl relative"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                onClick={closePopup}
              >
                <X size={20} />
              </button>

              {popupType === "add" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
                  <input
                    type="text"
                    placeholder="Service name"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg 
                               bg-slate-800 border border-white/10 text-white 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <select
                    value={newServiceStatus}
                    onChange={(e) => setNewServiceStatus(e.target.value)}
                    className="w-full px-4 py-2 mb-6 rounded-lg 
                               bg-slate-800 border border-white/10 text-white 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}

              {popupType === "edit" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg 
                               bg-slate-800 border border-white/10 text-white 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <select
                    value={newServiceStatus}
                    onChange={(e) => setNewServiceStatus(e.target.value)}
                    className="w-full px-4 py-2 mb-6 rounded-lg 
                               bg-slate-800 border border-white/10 text-white 
                               focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}

              {popupType === "archive" && (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Archive {selectedService?.name}?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    This service will be archived and can be restored later.
                  </p>
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition"
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
