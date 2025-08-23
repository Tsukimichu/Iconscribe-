import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, List, Trash2, Eye, X } from "lucide-react";

const initialArchiveData = [
  { enquiry: "011", service: "Official Receipts", name: "Aldrin Portento", ordered: "04/11/2025", urgency: "04/24/2025", status: "Completed" },
  { enquiry: "012", service: "Yearbook", name: "Joshua Valenzuela", ordered: "04/11/2025", urgency: "04/24/2025", status: "Completed" },
  { enquiry: "013", service: "Book", name: "Aaron Ortasel", ordered: "04/11/2025", urgency: "04/24/2025", status: "Completed" },
  { enquiry: "014", service: "Official Receipts", name: "Niel Osinasa", ordered: "04/11/2025", urgency: "04/24/2025", status: "Completed" },
  { enquiry: "015", service: "Official Receipts", name: "Mark Motining", ordered: "04/11/2025", urgency: "04/24/2025", status: "Completed" },
];

const statusColors = {
  Completed: "bg-green-100 text-green-700 border border-green-300",
};

const ArchiveSection = () => {
  const [archiveData, setArchiveData] = useState(initialArchiveData);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredData = archiveData.filter(
    (item) =>
      item.enquiry.toLowerCase().includes(search.toLowerCase()) ||
      item.service.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSort = () => {
    const sorted = [...filteredData].sort((a, b) =>
      sortAsc ? a.enquiry.localeCompare(b.enquiry) : b.enquiry.localeCompare(a.enquiry)
    );
    setArchiveData(sorted);
    setSortAsc(!sortAsc);
  };

  const handleDelete = (enquiry) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setArchiveData(archiveData.filter((item) => item.enquiry !== enquiry));
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Archive</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleSort}
          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          <List size={18} /> Sort by Enquiry
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
              <th className="py-3 px-6 font-semibold text-gray-700">Enquiry No.</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Service</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Date Ordered</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Urgency</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{item.enquiry}</td>
                <td className="py-3 px-6">{item.service}</td>
                <td className="py-3 px-6">{item.name}</td>
                <td className="py-3 px-6">{item.ordered}</td>
                <td className="py-3 px-6">{item.urgency}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    onClick={() => handleDelete(item.enquiry)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Archive Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Enquiry No:</strong> {selectedItem.enquiry}</p>
              <p><strong>Service:</strong> {selectedItem.service}</p>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Date Ordered:</strong> {selectedItem.ordered}</p>
              <p><strong>Urgency:</strong> {selectedItem.urgency}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ArchiveSection;
