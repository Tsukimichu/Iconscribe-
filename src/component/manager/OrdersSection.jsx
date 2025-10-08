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
  const [showViewModal, setShowViewModal] = useState(false);

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
  };

  // --- View Logic ---
  const openViewModal = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
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
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse min-w-[900px] text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
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
                        onClick={() => openViewModal(order)}
                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                      >
                        <Search size={16} />
                      </button>
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
          </div>
        </motion.div>
      </motion.div>

      {/* --- View Modal --- */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-gray-900 overflow-y-auto max-h-[90vh] border border-gray-200"
            >
              <h2 className="text-3xl font-bold mb-6 text-cyan-700 text-center border-b pb-3">
                Order Details
              </h2>

              {selectedOrder ? (
                <div className="space-y-6">
                  {/* Basic Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <p><span className="font-bold text-gray-800">Enquiry No:</span> {selectedOrder.enquiryNo}</p>
                    <p><span className="font-bold text-gray-800">Customer Name:</span> {selectedOrder.customer_name || "Aaron Santos"}</p>
                    <p><span className="font-bold text-gray-800">Email:</span> {selectedOrder.email || "aaron.santos@example.com"}</p>
                    <p><span className="font-bold text-gray-800">Contact Number:</span> {selectedOrder.contact_number || "0917-123-4567"}</p>
                    <p><span className="font-bold text-gray-800">Location:</span> {selectedOrder.location || "Cebu City, Philippines"}</p>
                    <p><span className="font-bold text-gray-800">Service:</span> {selectedOrder.service || "Book Printing"}</p>
                    <p><span className="font-bold text-gray-800">Date Ordered:</span> {selectedOrder.dateOrdered ? new Date(selectedOrder.dateOrdered).toLocaleDateString() : "10/08/2025"}</p>
                    <p><span className="font-bold text-gray-800">Urgency:</span> {selectedOrder.urgency || "Normal"}</p>
                    <p>
                      <span className="font-bold text-gray-800">Status:</span>
                      <span className="ml-2 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs font-semibold">
                        {selectedOrder.status || "Pending"}
                      </span>
                    </p>
                    <p><span className="font-bold text-gray-800">Price:</span> {selectedOrder.price ? `₱${selectedOrder.price}` : "₱350.00"}</p>
                  </div>

                  {/* Product Details */}
                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-semibold text-cyan-700 mb-3">
                      Product Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <p><span className="font-bold text-gray-800">Number of Copies:</span> {selectedOrder.details?.numberOfCopies || 5}</p>
                      <p><span className="font-bold text-gray-800">Number of Pages:</span> {selectedOrder.details?.numberOfPages || 120}</p>
                      <p><span className="font-bold text-gray-800">Binding Type:</span> {selectedOrder.details?.bindingType || "Perfect Bind"}</p>
                      <p><span className="font-bold text-gray-800">Paper Type:</span> {selectedOrder.details?.paperType || "Matte"}</p>
                      <p><span className="font-bold text-gray-800">Cover Finish:</span> {selectedOrder.details?.coverFinish || "Glossy"}</p>
                      <p><span className="font-bold text-gray-800">Color Finish:</span> {selectedOrder.details?.colorFinish || "Full Color"}</p>
                    </div>

                    {/* Uploaded Design */}
                    <div className="mt-5">
                      <p className="font-bold text-gray-800 mb-1">Uploaded Design:</p>
                      <a
                        href={selectedOrder.details?.designFile || "https://via.placeholder.com/600x400.png?text=Design+Preview"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:underline text-sm"
                      >
                        View Uploaded Design
                      </a>
                      <img
                        src={selectedOrder.details?.designFile || "https://via.placeholder.com/600x400.png?text=Design+Preview"}
                        alt="Uploaded Design Preview"
                        className="mt-3 rounded-xl border border-gray-300 max-h-56 w-full object-contain shadow-sm"
                      />
                    </div>

                    {/* Uploaded File */}
                    <div className="mt-6">
                      <p className="font-bold text-gray-800 mb-1">Uploaded File:</p>
                      <a
                        href={selectedOrder.details?.uploadedFile || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:underline text-sm"
                      >
                        View Uploaded File
                      </a>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-bold text-cyan-700 mb-1">Notes:</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedOrder.notes || "Please ensure the colors are vibrant and the binding is durable."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No order selected.</p>
              )}

              {/* Close Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={closeViewModal}
                  className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition shadow-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>







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
