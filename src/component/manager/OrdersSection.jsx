import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";

const ordersData = [
  {
    enquiryNo: "001",
    service: "Official Receipts",
    name: "Aldrin Portento",
    dateOrdered: "04/11/2025",
    urgency: { label: "Minor", color: "bg-green-100 text-green-700" },
    status: { label: "In review", color: "bg-blue-100 text-blue-700" },
  },
  {
    enquiryNo: "002",
    service: "Official Receipts",
    name: "Dave Geroleo",
    dateOrdered: "04/11/2025",
    urgency: { label: "Moderate", color: "bg-yellow-100 text-yellow-700" },
    status: { label: "Ongoing", color: "bg-purple-100 text-purple-700" },
  },
  {
    enquiryNo: "003",
    service: "Books",
    name: "Carl Madrigal",
    dateOrdered: "04/11/2025",
    urgency: { label: "Moderate", color: "bg-yellow-100 text-yellow-700" },
    status: { label: "Pending", color: "bg-orange-100 text-orange-700" },
  },
  {
    enquiryNo: "004",
    service: "Official Receipts",
    name: "Mark Matining",
    dateOrdered: "04/11/2025",
    urgency: { label: "--", color: "bg-gray-100 text-gray-500" },
    status: { label: "Completed", color: "bg-green-200 text-green-800" },
  },
  {
    enquiryNo: "005",
    service: "Official Receipts",
    name: "John Portento",
    dateOrdered: "04/11/2025",
    urgency: { label: "Critical", color: "bg-red-100 text-red-700" },
    status: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-700" },
  },
  {
    enquiryNo: "006",
    service: "Yearbook",
    name: "James Palma",
    dateOrdered: "04/11/2025",
    urgency: { label: "--", color: "bg-gray-100 text-gray-500" },
    status: { label: "Completed", color: "bg-green-200 text-green-800" },
  },
];

const OrdersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (action, order) => {
    setModalAction(action);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setModalAction(null);
  };

  const confirmAction = () => {
    if (modalAction === "archive") {
      alert(`Archived order ${selectedOrder.enquiryNo}`);
    } else if (modalAction === "delete") {
      alert(`Deleted order ${selectedOrder.enquiryNo}`);
    }
    closeModal();
  };

  // Sorting function
  const sortedOrders = useMemo(() => {
    let sorted = [...ordersData].filter(
      (o) =>
        o.enquiryNo.includes(searchTerm) ||
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }) =>
    sortConfig.key === column ? (
      sortConfig.direction === "asc" ? (
        <ChevronUp size={16} className="inline" />
      ) : (
        <ChevronDown size={16} className="inline" />
      )
    ) : null;

  return (
    <div className={`min-h-screen p-6 ${showModal ? "backdrop-blur-sm" : ""}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📦 Orders</h1>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none w-full"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-x-auto"
      >
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-100">
            <tr>
              {[
                { key: "enquiryNo", label: "Enquiry No." },
                { key: "service", label: "Service" },
                { key: "name", label: "Name" },
                { key: "dateOrdered", label: "Date Ordered" },
                { key: "urgency", label: "Urgency", sortable: false },
                { key: "status", label: "Status", sortable: false },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && requestSort(col.key)}
                  className={`py-3 px-6 font-semibold text-gray-700 cursor-pointer select-none ${
                    col.sortable !== false ? "hover:text-blue-500" : ""
                  }`}
                >
                  {col.label} {col.sortable !== false && <SortIcon column={col.key} />}
                </th>
              ))}
              <th className="py-3 px-6 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, idx) => (
              <motion.tr
                key={order.enquiryNo}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{order.enquiryNo}</td>
                <td className="py-3 px-6">{order.service}</td>
                <td className="py-3 px-6">{order.name}</td>
                <td className="py-3 px-6">{order.dateOrdered}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.urgency.color}`}>
                    {order.urgency.label}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status.color}`}>
                    {order.status.label}
                  </span>
                </td>
                <td className="py-3 px-6 flex justify-end gap-2">
                  <button
                    onClick={() => openModal("archive", order)}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Archive size={16} /> Archive
                  </button>
                  <button
                    onClick={() => openModal("delete", order)}
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-bold mb-3">
                {modalAction === "archive" ? "Archive Order" : "Delete Order"}
              </h2>
              <p className="text-gray-600 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold">
                  {modalAction === "archive" ? "archive" : "delete"}
                </span>{" "}
                order <b>{selectedOrder?.enquiryNo}</b>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    modalAction === "archive"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
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

export default OrdersSection;
