import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  Truck,
  Shield,
} from "lucide-react";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [archived, setArchived] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [imageGallery, setImageGallery] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [tableView, setTableView] = useState("active"); // active | completed | canceled
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // --- Walk-in order modal ---
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  // Define available services (for dropdown)
  const serviceOptions = [
    "Official Receipt",
    "Binding",
    "Book",
    "Brochure",
    "Calendar",
    "Calling Card",
    "Flyers",
    "Invitation",
    "News Letter",
    "Poster",
    "Raffle Ticket",
  ];

  // Optional: if you want auto-pricing per service, define here
  const servicePrices = {
    "Official Receipt": 150,
    Binding: 50,
    Book: 300,
    Brochure: 120,
    Calendar: 200,
    "Calling Card": 100,
    Flyers: 80,
    Invitation: 90,
    "News Letter": 150,
    Poster: 180,
    "Raffle Ticket": 130,
  };

  // Form state for new walk-in order
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    email: "",
    contact_number: "",
    location: "",
    date_ordered: "",
    status: "Pending",
    service: "",
    enquiry_no: "",
    price: "",
    urgency: "Normal",
    number_of_pages: "",
    binding_type: "",
    paper_type: "",
    cover_finish: "",
    color_printing: "",
  });

  const [showUrgencyModal, setShowUrgencyModal] = useState(false);
  const [newUrgency, setNewUrgency] = useState("");

  const openUrgencyModal = (order) => {
    setSelectedOrder(order);
    setNewUrgency(order.urgency || "Not Rush");
    setShowUrgencyModal(true);
  };

  const closeUrgencyModal = () => {
    setShowUrgencyModal(false);
    setNewUrgency("");
  };

  const confirmUrgencyChange = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.enquiryNo === selectedOrder.enquiryNo
          ? { ...o, urgency: newUrgency }
          : o
      )
    );
    setShowUrgencyModal(false);
  };

  // Handle file uploads (for walk-in)
  const [orderFiles, setOrderFiles] = useState([]);

  // When the user selects a service from the dropdown
  const handleServiceChange = (e) => {
    const selectedService = e.target.value;

    // Automatically fill the price if a service is selected
    setNewOrder((prev) => ({
      ...prev,
      service: selectedService,
      price: servicePrices[selectedService] || "",
    }));
  };

  // ==========================================================
  // FETCH ORDERS (single endpoint, we will filter by status)
  // ==========================================================
  const loadOrders = () => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        // data from backend already has enquiryNo, service, customer_name, etc.
        setOrders(arr);
      })
      .catch((err) => console.error("❌ Error loading orders:", err));
  };

  // Load on first render
  useEffect(() => {
    loadOrders();
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

  const confirmArchive = async () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder.order_id;
    if (!orderId) return alert("Invalid order ID.");

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/archive`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
        setArchived((prev) => [...prev, selectedOrder]);
        closeArchiveModal();
      } else {
        alert(data.message || "Failed to archive order");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
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

  const confirmAddPrice = async () => {
    if (!selectedOrder || newPrice === "" || isNaN(newPrice)) {
      alert("Enter a valid price");
      return;
    }

    const orderId = selectedOrder.order_id;

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/price`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: Number(newPrice) }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  manager_added: data.manager_added,
                  total_price: data.total,
                }
              : o
          )
        );

        closePriceModal();
      } else {
        alert(data.message || "Failed to update price");
      }
    } catch (err) {
      console.error("❌ Error updating price:", err);
      alert("Server error while updating price");
    }
  };

  // --- Set Status Logic (per order item) ---
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

  const confirmSetStatus = async () => {
    if (!selectedOrder) return;

    const itemId = selectedOrder.enquiryNo; // order_item_id

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${itemId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      // Reload list so all tabs (active/completed/canceled) reflect changes
      loadOrders();

      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus("");
    } catch (err) {
      console.error("❌ Status update failed:", err);
      alert("Status update failed");
    }
  };

  // --- Add Walk-In Order Logic ---
  const handleAddOrder = async () => {
    const { customer_name, service, price } = newOrder;

    if (!customer_name.trim() || !service || !price) {
      return alert(
        "Please fill in all required fields (Customer, Service, and Price)."
      );
    }

    try {
      // Still using your original endpoint; adjust to /create when backend ready
      const formData = new FormData();
      Object.entries(newOrder).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("source", "walk-in");

      orderFiles.forEach((file) => formData.append("files", file));

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add order");

      if (data.success) {
        // Either push the new order or just reload:
        loadOrders();
        setShowAddOrderModal(false);
        setNewOrder({
          customer_name: "",
          email: "",
          contact_number: "",
          location: "",
          date_ordered: "",
          status: "Pending",
          service: "",
          enquiry_no: "",
          price: "",
          urgency: "Normal",
          number_of_pages: "",
          binding_type: "",
          paper_type: "",
          cover_finish: "",
          color_printing: "",
        });
        setOrderFiles([]);
      }
    } catch (err) {
      console.error("Error adding walk-in order:", err);
      alert("Server error while adding order. Please try again later.");
    }
  };

  // --- Open View Modal ---
  const openViewModal = async (order) => {
    const orderId = order.order_id;
    if (!orderId) return alert("Invalid order ID.");

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      const data = await res.json();
      console.log("Fetched order:", data);

      if (res.ok && data.success) {
        setSelectedOrder(data.order);
        setShowViewModal(true);
      } else {
        alert(data.message || "Failed to fetch order details.");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Server error while fetching order details.");
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
  };

  // --- Search + Sort ---
  const sortedOrders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let filtered = orders.filter((o) => {
      const enquiryNoMatch = o.enquiryNo?.toString().includes(term);
      const serviceMatch = o.service?.toLowerCase().includes(term);
      const customerMatch = o.customer_name?.toLowerCase().includes(term);
      const statusMatch = o.status?.toLowerCase().includes(term);
      const urgencyMatch = o.urgency?.toLowerCase().includes(term);

      const estimatedPriceMatch =
        o.estimated_price &&
        o.estimated_price.toString().toLowerCase().includes(term);

      const totalPrice =
        Number(o.estimated_price || 0) + Number(o.manager_added || 0);

      const totalPriceMatch =
        totalPrice && totalPrice.toString().toLowerCase().includes(term);

      const rawDate = o.dateOrdered ? new Date(o.dateOrdered) : null;

      const dateMatch = rawDate
        ? rawDate.toLocaleDateString().toLowerCase().includes(term) ||
          rawDate.toDateString().toLowerCase().includes(term) ||
          rawDate.toISOString().toLowerCase().includes(term)
        : false;

      return (
        enquiryNoMatch ||
        serviceMatch ||
        customerMatch ||
        statusMatch ||
        urgencyMatch ||
        estimatedPriceMatch ||
        totalPriceMatch ||
        dateMatch
      );
    });

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

  // Filter by tab: active / completed / canceled (no extra DB tables)
  const displayedOrders = useMemo(() => {
    if (tableView === "completed") {
      return sortedOrders.filter((o) => o.status === "Completed");
    }
    if (tableView === "canceled") {
      return sortedOrders.filter((o) => o.status === "Cancelled");
    }
    // "active" — anything that is not Completed or Cancelled
    return sortedOrders.filter(
      (o) => o.status !== "Completed" && o.status !== "Cancelled"
    );
  }, [sortedOrders, tableView]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
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

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const statusColors = {
    Pending: "bg-gray-100 text-gray-700",
    Ongoing: "bg-yellow-100 text-yellow-700",
    "Out for delivery": "bg-purple-100 text-purple-700",
    "Out for Delivery": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const rowHighlight = {
    Pending: "bg-gray-50",
    Ongoing: "bg-yellow-50",
    "Out for delivery": "bg-purple-50",
    "Out for Delivery": "bg-purple-50",
    Completed: "bg-green-50",
    Cancelled: "bg-red-50",
  };

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

        <div className="flex justify-start gap-3 mt-2">
          <button
            onClick={() => setTableView("active")}
            className={`px-4 py-2 rounded-lg shadow-sm transition 
            ${
              tableView === "active"
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Active Orders
          </button>

          <button
            onClick={() => setTableView("completed")}
            className={`px-4 py-2 rounded-lg shadow-sm transition 
            ${
              tableView === "completed"
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Completed Orders
          </button>

          <button
            onClick={() => setTableView("canceled")}
            className={`px-4 py-2 rounded-lg shadow-sm transition 
            ${
              tableView === "canceled"
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Canceled Orders
          </button>

          <button
            onClick={() => setShowAddOrderModal(true)}
            className="ml-auto flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition shadow-md"
          >
            <PlusCircle size={18} />
            Add Walk-In Order
          </button>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto"
        >
          <div className="max-h-[550px] overflow-y-auto">
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
                    { key: "estimated_price", label: "Estimated Price" },
                    { key: "total_price", label: "Total Price" },
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
                {displayedOrders.map((order, idx) => (
                  <motion.tr
                    key={order.enquiryNo}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`
                      border-b border-gray-200 transition hover:opacity-95 
                      ${rowHighlight[order.status] || "bg-white"}
                    `}
                  >
                    {/* Enquiry No */}
                    <td className="py-3 px-6">{order.enquiryNo}</td>

                    {/* Service */}
                    <td className="py-3 px-6">{order.service}</td>

                    {/* Customer Name */}
                    <td className="py-3 px-6">{order.customer_name}</td>

                    {/* Date Ordered */}
                    <td className="py-3 px-6">
                      {order.dateOrdered
                        ? new Date(order.dateOrdered).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Urgency */}
                    <td className="py-3 px-6">{order.urgency || "—"}</td>

                    {/* STATUS with COLOR BADGE */}
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Estimated Price */}
                    <td className="py-3 px-6">
                      {order.estimated_price
                        ? `₱${Number(order.estimated_price || 0).toFixed(2)}`
                        : (
                          <span className="text-gray-400 italic">Not Set</span>
                        )}
                    </td>

                    {/* Total Price */}
                    <td className="py-3 px-6 font-semibold text-green-600">
                      {order.total_price
                        ? `₱${Number(order.total_price || 0).toFixed(2)}`
                        : order.manager_added && order.manager_added > 0
                        ? `₱${(
                            Number(order.estimated_price || 0) +
                            Number(order.manager_added || 0)
                          ).toFixed(2)}`
                        : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                    </td>

                    {/* ======================= ACTION BUTTONS ======================= */}
                    <td className="py-3 px-6 flex justify-end gap-2">
                      {/* VIEW ALWAYS AVAILABLE */}
                      <button
                        onClick={() => openViewModal(order)}
                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                      >
                        <Search size={16} />
                      </button>

                      {/* COMPLETED / CANCELED VIEW: only archive */}
                      {tableView === "completed" || tableView === "canceled" ? (
                        <>
                          <button
                            onClick={() => openArchiveModal(order)}
                            className="flex items-center justify-center gap-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* ACTIVE ORDERS ONLY */}

                          {/* SET STATUS */}
                          <button
                            onClick={() => openStatusModal(order)}
                            className="flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-2 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                          >
                            <Truck size={16} />
                          </button>

                          {/* ADD PRICE */}
                          <button
                            onClick={() => openPriceModal(order)}
                            className="flex items-center justify-center gap-1 bg-cyan-100 text-cyan-700 px-2 py-2 rounded-lg hover:bg-cyan-200 transition text-sm font-medium"
                          >
                            <PlusCircle size={16} />
                          </button>

                          {/* ARCHIVE */}
                          <button
                            onClick={() => openArchiveModal(order)}
                            className="flex items-center justify-center gap-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                          >
                            <Trash2 size={16} />
                          </button>

                          {/* URGENCY */}
                          <button
                            onClick={() => openUrgencyModal(order)}
                            className="flex items-center justify-center gap-1 bg-orange-100 text-orange-700 px-2 py-2 rounded-lg hover:bg-orange-200 transition text-sm font-medium"
                          >
                            <Shield size={16} />
                          </button>
                        </>
                      )}
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
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            className="fixed inset-0 flex items-center justify-center z-50"
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
                    <p>
                      <span className="font-bold text-gray-800">Customer Name:</span>{" "}
                      {selectedOrder.customer_name || "—"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">Email:</span>{" "}
                      {selectedOrder.email || "—"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">Contact Number:</span>{" "}
                      {selectedOrder.contact_number || "—"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">Location:</span>{" "}
                      {selectedOrder.location || "—"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">Date Ordered:</span>{" "}
                      {selectedOrder.dateOrdered
                        ? new Date(selectedOrder.dateOrdered).toLocaleDateString()
                        : "—"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">Status:</span>{" "}
                      {selectedOrder.status || "Pending"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">Price:</span>{" "}
                      {selectedOrder.price != null
                        ? `₱${selectedOrder.price}`
                        : "₱350.00"}
                    </p>
                  </div>

                  {/* Loop through items safely */}
                  {(selectedOrder.items || []).length > 0 ? (
                    (selectedOrder.items || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="mt-6 border-t border-gray-200 pt-5"
                      >
                        <h3 className="text-lg font-semibold text-cyan-700 mb-3">
                          {item.service || "Service"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <p>
                            <span className="font-bold text-gray-800">
                              Enquiry No:
                            </span>{" "}
                            {item.enquiryNo || "—"}
                          </p>
                          <p>
                            <span className="font-bold text-gray-800">Urgency:</span>{" "}
                            {item.urgency || "—"}
                          </p>

                          {/* Product-specific details */}
                          {item.details &&
                            Object.keys(item.details).map((key) => {
                              const value = item.details[key];
                              if (!value) return null;
                              return (
                                <p key={key}>
                                  <span className="font-bold text-gray-800">
                                    {formatLabel(key)}:
                                  </span>{" "}
                                  {value}
                                </p>
                              );
                            })}

                          {/* Uploaded files */}
                          {(item.files || []).length > 0 && (
                            <div className="mt-3">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Uploaded Files:
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {(item.files || []).map((file, fIdx) => {
                                  const isImage =
                                    /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                                  const isPDF = /\.pdf$/i.test(file);
                                  return (
                                    <div
                                      key={fIdx}
                                      className="flex flex-col items-center"
                                    >
                                      {isImage && (
                                        <button
                                          onClick={() => {
                                            const allImages = (
                                              item.files || []
                                            ).filter((f) =>
                                              /\.(jpg|jpeg|png|gif|webp)$/i.test(
                                                f
                                              )
                                            );
                                            const startIndex =
                                              allImages.findIndex(
                                                (img) => img === file
                                              );
                                            setImageGallery(allImages);
                                            setCurrentImageIndex(
                                              startIndex >= 0 ? startIndex : 0
                                            );
                                            setPreviewImage(
                                              `http://localhost:5000${file}`
                                            );
                                            setShowImageModal(true);
                                          }}
                                          className="px-2 py-1 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                                        >
                                          View Image
                                        </button>
                                      )}
                                      {isPDF && (
                                        <a
                                          href={`http://localhost:5000${file}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-2 py-1 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                                        >
                                          View PDF
                                        </a>
                                      )}
                                      <a
                                        href={`http://localhost:5000${file}`}
                                        download
                                        className="text-xs text-cyan-600 mt-1 hover:underline"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic mt-3">
                      No items found for this order.
                    </p>
                  )}
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

      {/* --- Image Gallery Preview Modal --- */}
      <AnimatePresence>
        {showImageModal && imageGallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-[100]"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white p-4 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://localhost:5000${imageGallery[currentImageIndex]}`}
                alt={`Preview ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] rounded-xl object-contain"
              />

              {/* Navigation buttons */}
              {imageGallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + imageGallery.length) % imageGallery.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white px-3 py-2 rounded-full hover:bg-gray-700 transition"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % imageGallery.length
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white px-3 py-2 rounded-full hover:bg-gray-700 transition"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image counter */}
              <p className="mt-3 text-sm text-gray-600">
                Image {currentImageIndex + 1} of {imageGallery.length}
              </p>

              {/* Close button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Close
              </button>
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
              <h2 className="text-xl font-bold mb-3 text-gray-900">
                Set Order Status
              </h2>
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
                <option>Out for Delivery</option>
                <option>Completed</option>
                <option>Cancelled</option>
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
              <h2 className="text-xl font-bold mb-3 text-gray-900">
                Add / Update Price
              </h2>
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

      {/* --- Add Walk-In Order Modal --- */}
      <AnimatePresence>
        {showAddOrderModal && (
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
              className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full text-center overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold mb-6 text-cyan-700">
                Add Walk-In Order
              </h2>

              {/* Two-column layout for inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newOrder.customer_name}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customer_name: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newOrder.email || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, email: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newOrder.contact_number || ""}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      contact_number: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newOrder.location || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, location: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <input
                  type="date"
                  value={newOrder.date_ordered || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, date_ordered: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <select
                  value={newOrder.status || "Pending"}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, status: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  <option>Pending</option>
                  <option>Ongoing</option>
                  <option>Out for Delivery</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>

                <select
                  value={newOrder.service}
                  onChange={handleServiceChange}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  <option value="">Select a service...</option>
                  {serviceOptions.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Enquiry No."
                  value={newOrder.enquiry_no || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, enquiry_no: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <input
                  type="number"
                  placeholder="Price (₱)"
                  value={newOrder.price}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, price: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <select
                  value={newOrder.urgency}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, urgency: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Rush</option>
                </select>

                <input
                  type="number"
                  placeholder="Number of Pages"
                  value={newOrder.number_of_pages || ""}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      number_of_pages: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Binding Type (e.g. Perfect Binding)"
                  value={newOrder.binding_type || ""}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      binding_type: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Paper Type (e.g. Matte)"
                  value={newOrder.paper_type || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, paper_type: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Cover Finish (e.g. Glossy)"
                  value={newOrder.cover_finish || ""}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      cover_finish: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Color Printing (e.g. Full Color)"
                  value={newOrder.color_printing || ""}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      color_printing: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              {/* File Upload */}
              <div className="mt-4 text-left">
                <label className="block font-semibold text-gray-700 mb-1">
                  Upload Files (Images or PDFs)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => setOrderFiles([...e.target.files])}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                {orderFiles.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {orderFiles.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOrderModal(false);
                    setNewOrder({
                      customer_name: "",
                      email: "",
                      contact_number: "",
                      location: "",
                      date_ordered: "",
                      status: "Pending",
                      service: "",
                      enquiry_no: "",
                      price: "",
                      urgency: "Normal",
                      number_of_pages: "",
                      binding_type: "",
                      paper_type: "",
                      cover_finish: "",
                      color_printing: "",
                    });
                    setOrderFiles([]);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddOrder}
                  className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-sm transition-colors duration-200"
                >
                  Add Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Urgency Modal --- */}
      <AnimatePresence>
        {showUrgencyModal && (
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
              <h2 className="text-xl font-bold mb-3 text-gray-900">
                Edit Urgency
              </h2>
              <p className="text-gray-600 mb-4">
                Choose urgency for <b>{selectedOrder?.enquiryNo}</b>
              </p>

              <select
                value={newUrgency}
                onChange={(e) => setNewUrgency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option>Rush</option>
                <option>Not Rush</option>
              </select>

              <div className="flex justify-center gap-3">
                <button
                  onClick={closeUrgencyModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUrgencyChange}
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition"
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
              <h2 className="text-xl font-bold mb-3 text-gray-900">
                Archive Order
              </h2>
              <p className="text-gray-600 mb-5">
                Are you sure you want to archive order{" "}
                <b>{selectedOrder?.enquiryNo}</b>?
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