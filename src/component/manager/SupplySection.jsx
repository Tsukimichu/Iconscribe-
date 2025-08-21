import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, List, X } from "lucide-react";

const initialSupplies = [
  { name: "Bond Paper", status: "Sufficient", quantity: 45, price: 265 },
  { name: "Epson Printer Ink", status: "Low on Stock", quantity: 5, price: 285 },
  { name: "Ink Toner Powder", status: "Sufficient", quantity: 20, price: 3195 },
  { name: "Backing Paper", status: "Sufficient", quantity: 35, price: 96 },
  { name: "Plastic", status: "Out of Stock", quantity: 0, price: 165 },
];

const statusColors = {
  "Sufficient": "bg-green-500/20 text-green-400 border border-green-500/30",
  "Low on Stock": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  "Out of Stock": "bg-red-500/20 text-red-400 border border-red-500/30",
};

const SupplyMonitoring = () => {
  const [supplies, setSupplies] = useState(initialSupplies);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [newSupply, setNewSupply] = useState({ name: "", status: "Sufficient", quantity: 0, price: 0 });

  const filteredSupplies = supplies.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPopup = (type, supply = null) => {
    setPopupType(type);
    setSelectedSupply(supply);
    if (supply) setNewSupply(supply);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedSupply(null);
    setNewSupply({ name: "", status: "Sufficient", quantity: 0, price: 0 });
  };

  const handleConfirm = () => {
    if (popupType === "delete") {
      setSupplies((prev) => prev.filter((s) => s !== selectedSupply));
    } else if (popupType === "add") {
      setSupplies((prev) => [...prev, newSupply]);
    } else if (popupType === "edit") {
      setSupplies((prev) =>
        prev.map((s) => (s === selectedSupply ? newSupply : s))
      );
    }
    closePopup();
  };

  const sortSupplies = () => {
    setSupplies((prev) =>
      [...prev].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white">Supply Monitoring</h1>
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
          <Plus size={18} /> Add Supply
        </button>
        <button
          onClick={sortSupplies}
          className="flex items-center gap-2 bg-slate-800 text-gray-300 px-4 py-2 rounded-lg border border-white/10 hover:bg-slate-700 transition"
        >
          <List size={18} /> Sort Items
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800/80 shadow-xl rounded-2xl overflow-hidden border border-white/10"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/70 sticky top-0">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-300">Product</th>
              <th className="py-3 px-6 font-semibold text-gray-300">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-300">Quantity</th>
              <th className="py-3 px-6 font-semibold text-gray-300">Price</th>
              <th className="py-3 px-6 font-semibold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSupplies.map((supply, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/10 hover:bg-slate-700/30 transition"
              >
                <td className="py-3 px-6">{supply.name}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[supply.status]}`}>
                    {supply.status}
                  </span>
                </td>
                <td className="py-3 px-6">{supply.quantity} in stock</td>
                <td className="py-3 px-6">₱{supply.price.toLocaleString()}</td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    onClick={() => openPopup("edit", supply)}
                    className="flex items-center gap-1 bg-slate-700 px-3 py-1 rounded-lg hover:bg-slate-600 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => openPopup("delete", supply)}
                    className="flex items-center gap-1 bg-red-600/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-600/40 transition"
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

              {(popupType === "add" || popupType === "edit") && (
                <>
                  <h3 className="text-lg font-semibold mb-4">
                    {popupType === "add" ? "Add New Supply" : "Edit Supply"}
                  </h3>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={newSupply.name}
                    onChange={(e) => setNewSupply({ ...newSupply, name: e.target.value })}
                    className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <select
                    value={newSupply.status}
                    onChange={(e) => setNewSupply({ ...newSupply, status: e.target.value })}
                    className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    <option value="Sufficient">Sufficient</option>
                    <option value="Low on Stock">Low on Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newSupply.quantity}
                    onChange={(e) => setNewSupply({ ...newSupply, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newSupply.price}
                    onChange={(e) => setNewSupply({ ...newSupply, price: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 mb-6 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                </>
              )}

              {popupType === "delete" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">
                    Confirm Delete
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 mb-6">
                    <p className="font-medium text-white mb-2">{selectedSupply?.name}</p>
                    <p className="text-sm text-gray-400">Quantity: {selectedSupply?.quantity}</p>
                    <p className="text-sm text-gray-400">Price: ₱{selectedSupply?.price.toLocaleString()}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedSupply?.status]}`}>
                      {selectedSupply?.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    This action cannot be undone.
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
                    popupType === "delete"
                      ? "bg-red-600 hover:bg-red-700"
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

export default SupplyMonitoring;
