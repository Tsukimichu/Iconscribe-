import React from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2, List } from "lucide-react";

const supplies = [
  { product: "Bond Paper", status: "Sufficient", quantity: "45 in stock", price: "₱265" },
  { product: "Epson Printer Ink", status: "Low on Stock", quantity: "5 in stock", price: "₱285" },
  { product: "Ink Toner Powder", status: "Sufficient", quantity: "20 in stock", price: "₱3,195" },
  { product: "Backing Paper", status: "Sufficient", quantity: "35 in stock", price: "₱96" },
  { product: "Plastic", status: "Out of Stock", quantity: "0 in stock", price: "₱165" },
];

const statusColors = {
  "Sufficient": "bg-green-100 text-green-700 border border-green-300",
  "Low on Stock": "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "Out of Stock": "bg-red-100 text-red-700 border border-red-300",
};

const SupplySection = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Supply Monitoring</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} /> Add Supply
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
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-700">Product</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Quantity <span className="text-xs text-gray-500">(count)</span></th>
              <th className="py-3 px-6 font-semibold text-gray-700">Price <span className="text-xs text-gray-500">(unit)</span></th>
              <th className="py-3 px-6 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((item, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{item.product}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-6">{item.quantity}</td>
                <td className="py-3 px-6">{item.price}</td>
                <td className="py-3 px-6 flex gap-2">
                  <button className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition">
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default SupplySection;
