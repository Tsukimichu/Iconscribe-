import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";

const initialOrders = [
  {
    enquiryNo: "001",
    service: "Official Receipts",
    name: "Aldrin Portento",
    dateOrdered: "04/11/2025",
    urgency: { label: "Minor", color: "bg-green-500/20 text-green-400" },
    status: { label: "In review", color: "bg-blue-500/20 text-blue-400" },
  },
  {
    enquiryNo: "002",
    service: "Official Receipts",
    name: "Dave Geroleo",
    dateOrdered: "04/11/2025",
    urgency: { label: "Moderate", color: "bg-yellow-500/20 text-yellow-400" },
    status: { label: "Ongoing", color: "bg-purple-500/20 text-purple-400" },
  },
  {
    enquiryNo: "003",
    service: "Books",
    name: "Carl Madrigal",
    dateOrdered: "04/11/2025",
    urgency: { label: "Moderate", color: "bg-yellow-500/20 text-yellow-400" },
    status: { label: "Pending", color: "bg-amber-500/20 text-amber-400" },
  },
  {
    enquiryNo: "004",
    service: "Official Receipts",
    name: "Mark Matining",
    dateOrdered: "04/11/2025",
    urgency: { label: "--", color: "bg-gray-500/20 text-gray-400" },
    status: { label: "Completed", color: "bg-green-500/20 text-green-400" },
  },
  {
    enquiryNo: "005",
    service: "Official Receipts",
    name: "John Portento",
    dateOrdered: "04/11/2025",
    urgency: { label: "Critical", color: "bg-red-500/20 text-red-400" },
    status: { label: "Out for Delivery", color: "bg-orange-500/20 text-orange-400" },
  },
];

const OrdersSection = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [archived, setArchived] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const confirmDelete = () => {
    setOrders(orders.filter((o) => o.enquiryNo !== selectedOrder.enquiryNo));
    setArchived([...archived, selectedOrder]);
    closeModal();
  };

  // Sorting + Search
  const sortedOrders = useMemo(() => {
    let filtered = [...orders].filter(
      (o) =>
        o.enquiryNo.includes(searchTerm) ||
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orders, searchTerm, sortConfig]);

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
        <ChevronUp size={16} className="inline ml-1" />
      ) : (
        <ChevronDown size={16} className="inline ml-1" />
      )
    ) : null;

  return (
    <div
      className="p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] shadow-2xl space-y-8 text-white min-h-screen"
    >
      {/* Animate only the content (not background) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Orders
          </h1>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none w-full text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Active Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-x-auto"
        >
          <table className="w-full text-left border-collapse min-w-[800px] text-sm">
            <thead className="bg-white/10">
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
                    className={`py-3 px-6 font-semibold cursor-pointer select-none text-gray-300 ${
                      col.sortable !== false ? "hover:text-cyan-400" : ""
                    }`}
                  >
                    {col.label}
                    {col.sortable !== false && <SortIcon column={col.key} />}
                  </th>
                ))}
                <th className="py-3 px-6 font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, idx) => (
                <motion.tr
                  key={order.enquiryNo}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="py-3 px-6">{order.enquiryNo}</td>
                  <td className="py-3 px-6">{order.service}</td>
                  <td className="py-3 px-6">{order.name}</td>
                  <td className="py-3 px-6">{order.dateOrdered}</td>
                  <td className="py-3 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.urgency.color}`}>
                      {order.urgency.label}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status.color}`}>
                      {order.status.label}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex justify-end">
                    <button
                      onClick={() => openModal(order)}
                      className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <Trash2 size={16} /> Archive
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Archived Orders Section */}
        {archived.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-3">Archived Orders</h2>
            <ul className="space-y-2 text-sm">
              {archived.map((order) => (
                <li key={order.enquiryNo} className="flex justify-between border-b border-white/10 pb-2">
                  <span>
                    <b>{order.enquiryNo}</b> - {order.name} ({order.service})
                  </span>
                  <span className="text-gray-400">{order.dateOrdered}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#1e293b] rounded-2xl shadow-lg p-6 max-w-sm w-full text-center text-white"
            >
              <h2 className="text-xl font-bold mb-3">Archive Order</h2>
              <p className="text-gray-400 mb-5">
                Are you sure you want to archive order <b>{selectedOrder?.enquiryNo}</b>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
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
