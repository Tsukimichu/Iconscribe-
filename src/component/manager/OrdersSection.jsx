import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  Truck,
} from "lucide-react";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [archived, setArchived] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // --- Fetch from backend ---
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // --- Archive Logic ---
  const openArchiveModal = (order) => {
    setSelectedOrder(order);
    setShowArchiveModal(true);
  };
  const closeArchiveModal = () => {
    setShowArchiveModal(false);
    setSelectedOrder(null);
  };
  const confirmArchive = () => {
    setOrders(orders.filter((o) => o.enquiryNo !== selectedOrder.enquiryNo));
    setArchived([...archived, selectedOrder]);
    closeArchiveModal();
  };

  // --- Add Price Logic ---
  const openPriceModal = (order) => {
    setSelectedOrder(order);
    setNewPrice(order.price || "");
    setShowPriceModal(true);
  };
  const closePriceModal = () => {
    setShowPriceModal(false);
    setSelectedOrder(null);
    setNewPrice("");
  };
  const confirmAddPrice = () => {
    if (!newPrice || isNaN(newPrice)) return alert("Please enter a valid number.");

    const updatedOrders = orders.map((o) =>
      o.enquiryNo === selectedOrder.enquiryNo ? { ...o, price: Number(newPrice) } : o
    );
    setOrders(updatedOrders);
    closePriceModal();

    // Optionally send to backend:
    /*
    fetch(`http://localhost:5000/api/orders/${selectedOrder.enquiryNo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: Number(newPrice) }),
    });
    */
  };

  // --- Set Status Logic ---
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Pending");
    setShowStatusModal(true);
  };
  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus("");
  };
  const confirmSetStatus = () => {
    const updatedOrders = orders.map((o) =>
      o.enquiryNo === selectedOrder.enquiryNo ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    closeStatusModal();

    // Optionally send to backend:
    /*
    fetch(`http://localhost:5000/api/orders/${selectedOrder.enquiryNo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    */
  };

  // --- Search + Sort ---
  const sortedOrders = useMemo(() => {
    let filtered = orders.filter(
      (o) =>
        o.enquiryNo.toString().includes(searchTerm) ||
        o.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orders, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
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
    <div className="p-8 rounded-3xl bg-white shadow-2xl space-y-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-cyan-700">Orders</h1>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none w-full text-gray-900 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto"
        >
          <table className="w-full text-left border-collapse min-w-[900px] text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  { key: "enquiryNo", label: "Enquiry No." },
                  { key: "service", label: "Service" },
                  { key: "customer_name", label: "Name" },
                  { key: "dateOrdered", label: "Date Ordered" },
                  { key: "urgency", label: "Urgency" },
                  { key: "status", label: "Status" },
                  { key: "price", label: "Price" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className="py-3 px-6 font-semibold cursor-pointer text-gray-700 hover:text-cyan-600"
                  >
                    {col.label}
                    <SortIcon column={col.key} />
                  </th>
                ))}
                <th className="py-3 px-6 font-semibold text-center text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, idx) => (
                <motion.tr
                  key={order.enquiryNo}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{order.enquiryNo}</td>
                  <td className="py-3 px-6">{order.service}</td>
                  <td className="py-3 px-6">{order.customer_name}</td>
                  <td className="py-3 px-6">
                    {new Date(order.dateOrdered).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">{order.urgency || "—"}</td>
                  <td className="py-3 px-6">{order.status || "Pending"}</td>
                  <td className="py-3 px-6">
                    {order.price ? `₱${order.price}` : <span className="text-gray-400 italic">No Price</span>}
                  </td>
                  <td className="py-3 px-6 flex justify-end gap-2">
                    <button
                      onClick={() => openStatusModal(order)}
                      className="flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-2 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                    >
                      <Truck size={16} />
                    </button>
                    <button
                      onClick={() => openPriceModal(order)}
                      className="flex items-center justify-center gap-1 bg-cyan-100 text-cyan-700 px-2 py-2 rounded-lg hover:bg-cyan-200 transition text-sm font-medium"
                    >
                      <PlusCircle size={16} />
                    </button>
                    <button
                      onClick={() => openArchiveModal(order)}
                      className="flex items-center justify-center gap-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>

      {/* --- Status Modal --- */}
      <AnimatePresence>
        {showStatusModal && (
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
              className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-bold mb-3 text-gray-900">Set Order Status</h2>
              <p className="text-gray-600 mb-4">
                Choose new status for <b>{selectedOrder?.enquiryNo}</b>
              </p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option>Pending</option>
                <option>Ongoing</option>
                <option>To be delivered</option>
              </select>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeStatusModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSetStatus}
                  className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Price Modal --- */}
      <AnimatePresence>
        {showPriceModal && (
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
              className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-bold mb-3 text-gray-900">Add / Update Price</h2>
              <p className="text-gray-600 mb-4">
                Enter price for order <b>{selectedOrder?.enquiryNo}</b>
              </p>
              <input
                type="number"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Enter price..."
              />
              <div className="flex justify-center gap-3">
                <button
                  onClick={closePriceModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddPrice}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Archive Modal --- */}
      <AnimatePresence>
        {showArchiveModal && (
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
              className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-bold mb-3 text-gray-900">Archive Order</h2>
              <p className="text-gray-600 mb-5">
                Are you sure you want to archive order <b>{selectedOrder?.enquiryNo}</b>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeArchiveModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmArchive}
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
