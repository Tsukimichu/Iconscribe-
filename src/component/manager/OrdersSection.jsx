import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  Truck,
} from "lucide-react";
import { API_URL } from "../../api";
import WalkInOrderModal from "./WalkInOrderModal";

// Small helper component for labels
const Detail = ({ label, value }) => (
  <p>
    <span className="font-bold text-gray-800">{label}:</span>{" "}
    {value || "—"}
  </p>
);

const OrdersSection = () => {
  // =====================================================
  // STATE
  // =====================================================
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [imageGallery, setImageGallery] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [tableView, setTableView] = useState("active"); // active | completed | canceled
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentViewIndex, setCurrentViewIndex] = useState(null);

  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // --- Walk-in order modal ---
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Form state for new walk-in order
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    email: "",
    contact_number: "",
    location: "",
    quantity: "",
    details: "",
    price: "",
    service: "",
    product_id: null,
  });

  // Handle file uploads (for walk-in)
  const [orderFiles, setOrderFiles] = useState([]);

  // =====================================================
  // LOAD ORDERS + PRODUCTS
  // =====================================================
  const loadOrders = () => {
    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setOrders(
          arr.map(o => ({
            ...o,
            customer_name: o.customer_name || o.walk_in_name || "Walk-in Customer",
            email: o.email || o.walk_in_email || "",
            contact_number: o.contact_number || o.walk_in_contact || "",
            location: o.location || o.walk_in_location || "",
          }))
        );
      })
      .catch((err) => console.error("❌ Error loading orders:", err));
  };

  const loadProducts = () => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setProducts(arr);
      })
      .catch((err) => console.error("❌ Error loading products:", err));
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  // =====================================================
  // SEARCH + SORT HOOKS
  // =====================================================
  const sortedOrders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let filtered = orders.filter((o) => {
      const serviceMatch = o.service?.toLowerCase().includes(term);
      const customerMatch = o.customer_name?.toLowerCase().includes(term);
      const statusMatch = o.status?.toLowerCase().includes(term);

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
        serviceMatch ||
        customerMatch ||
        statusMatch ||
        estimatedPriceMatch ||
        totalPriceMatch ||
        dateMatch
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";

        if (sortConfig.key.includes("date")) {
          return sortConfig.direction === "asc"
            ? new Date(aVal) - new Date(bVal)
            : new Date(bVal) - new Date(aVal);
        }

        return sortConfig.direction === "asc"
          ? aVal > bVal
            ? 1
            : -1
          : aVal < bVal
          ? 1
          : -1;
      });
    }

    return filtered;
  }, [orders, searchTerm, sortConfig]);

  // Filter by tab: active / completed / canceled
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

  // =====================================================
  // HELPERS / FORMATTERS
  // =====================================================
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

  // =====================================================
  // VIEW MODAL + NAVIGATION (NEXT / PREV + KEYBOARD)
  // =====================================================
  const openViewModal = async (orderRow) => {
    const orderId = orderRow.order_id;
    if (!orderId) return alert("Invalid order ID.");

    try {
      const res = await fetch(`${API_URL}/orders/details/${orderId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to fetch order details.");
        return;
      }

      // Find current index in displayedOrders (for Next/Prev)
      const index = displayedOrders.findIndex((o) => o.order_id === orderId);

      // Merge table row data with details data
      const mergedOrder = {
        ...orderRow,
        ...data.order,
      };

      setCurrentViewIndex(index);
      setSelectedOrder(mergedOrder);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Server error while fetching order details.");
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
    setCurrentViewIndex(null);
  };

  const goToNextOrder = async () => {
    if (
      currentViewIndex == null ||
      currentViewIndex >= displayedOrders.length - 1
    )
      return;

    const nextOrder = displayedOrders[currentViewIndex + 1];
    await openViewModal(nextOrder);
  };

  const goToPreviousOrder = async () => {
    if (currentViewIndex == null || currentViewIndex <= 0) return;

    const prevOrder = displayedOrders[currentViewIndex - 1];
    await openViewModal(prevOrder);
  };

  // Keyboard navigation: ← → Esc
  useEffect(() => {
    if (!showViewModal) return;

    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        goToNextOrder();
      } else if (e.key === "ArrowLeft") {
        goToPreviousOrder();
      } else if (e.key === "Escape") {
        closeViewModal();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showViewModal, currentViewIndex, displayedOrders]);

  // =====================================================
  // PRICE MODAL HANDLERS
  // =====================================================
  const openPriceModal = (order) => {
    if (order.status !== "Pending") {
      alert("You can only add/update price when the order is Pending.");
      return;
    }

    setSelectedOrder(order);
    setNewPrice(order.manager_added || "");
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
      const res = await fetch(`${API_URL}/orders/${orderId}/price`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(newPrice) }),
      });

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

  // =====================================================
  // STATUS MODAL HANDLERS
  // =====================================================
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
      const res = await fetch(`${API_URL}/orders/${itemId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      loadOrders();
      closeStatusModal();
    } catch (err) {
      console.error("❌ Status update failed:", err);
      alert("Status update failed");
    }
  };

  // =====================================================
  // WALK-IN ORDER HANDLER
  // =====================================================
  const handleAddOrder = async (body) => {
    try {
      const res = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!data.success) {
        console.error("❌ Walk-in Add Error:", data);
        alert(data.message || "Error adding walk-in order");
        return;
      }

      loadOrders();
      setShowAddOrderModal(false);

    } catch (err) {
      console.error("❌ Add Walk-in Error:", err);
    }
  };

  // Quick sort dropdown (toolbar)
  const [quickSort, setQuickSort] = useState("none");

  const handleQuickSortChange = (value) => {
    setQuickSort(value);

    switch (value) {
      case "date_desc":
        setSortConfig({ key: "order_date", direction: "desc" });
        break;
      case "date_asc":
        setSortConfig({ key: "order_date", direction: "asc" });
        break;
      case "total_desc":
        setSortConfig({ key: "total_price", direction: "desc" });
        break;
      case "total_asc":
        setSortConfig({ key: "total_price", direction: "asc" });
        break;
      default:
        setSortConfig({ key: null, direction: "asc" });
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
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

        {/* Tabs + Add Walk-in + Sort */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
          <div className="flex gap-3">
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
          </div>

          <div className="flex items-center gap-3 md:ml-auto">
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Sort:
              </span>
              <select
                value={quickSort}
                onChange={(e) => handleQuickSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="none">Default</option>
                <option value="date_desc">Newest Orders</option>
                <option value="date_asc">Oldest Orders</option>
                <option value="total_desc">Highest Total</option>
                <option value="total_asc">Lowest Total</option>
              </select>
            </div>

            {/* Add Walk-in button */}
            <button
              onClick={() => setShowAddOrderModal(true)}
              className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition shadow-md"
            >
              <PlusCircle size={18} />
              Add Walk-In Order
            </button>
          </div>
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
                    { key: "service", label: "Service" },
                    { key: "customer_name", label: "Name" },
                    { key: "dateOrdered", label: "Date Ordered" },
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
                    className={`border-b border-gray-200 transition hover:opacity-95 
                      ${rowHighlight[order.status] || "bg-white"}`}
                  >
                    {/* Service */}
                    <td className="py-3 px-6">{order.service}</td>

                    {/* Customer Name */}
                    <td className="py-3 px-6 flex items-center gap-2">
                      {order.customer_name}

                      {order.order_type === "walk-in" && (
                        <span className="px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 rounded-full">
                          Walk-In
                        </span>
                      )}
                    </td>

                    {/* Date Ordered */}
                    <td className="py-3 px-6">
                      {order.dateOrdered
                        ? new Date(order.dateOrdered).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* STATUS */}
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
                      {order.estimated_price ? (
                        `₱${Number(order.estimated_price || 0).toFixed(2)}`
                      ) : (
                        <span className="text-gray-400 italic">Not Set</span>
                      )}
                    </td>

                    {/* Total Price */}
                    <td className="py-3 px-6 font-semibold text-green-600">
                      {order.total_price != null ? (
                        `₱${Number(order.total_price).toFixed(2)}`
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-6 flex justify-end gap-2">
                      {/* VIEW */}
                      <button
                        onClick={() => openViewModal(order)}
                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                      >
                        <Search size={16} />
                      </button>

                      {/* ACTIVE ORDER ACTIONS ONLY */}
                      {tableView === "completed" || tableView === "canceled" ? (
                        <></>
                      ) : (
                        <>
                          {/* SET STATUS */}
                          <button
                            onClick={() => openStatusModal(order)}
                            className="flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-2 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                          >
                            <Truck size={16} />
                          </button>

                          {/* ADD PRICE */}
                          {order.status === "Pending" ? (
                            <button
                              onClick={() => openPriceModal(order)}
                              className="flex items-center justify-center gap-1 bg-cyan-100 text-cyan-700 px-2 py-2 rounded-lg hover:bg-cyan-200 transition text-sm font-medium"
                            >
                              <PlusCircle size={16} />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex items-center justify-center gap-1 bg-gray-200 text-gray-400 px-2 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
                            >
                              <PlusCircle size={16} />
                            </button>
                          )}
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

      {/* --- Redesigned View Modal --- */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
            >
              {/* HEADER */}
              <h2 className="text-3xl font-extrabold text-cyan-700 text-center mb-6">
                Order Details
              </h2>

              {selectedOrder ? (
                <div className="space-y-6">
                  {/* CUSTOMER INFORMATION CARD */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-b-gray-200 pb-2">
                      Customer Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
                          <Detail
                            label="Customer Name"
                            value={
                              selectedOrder.customer_name ||
                              selectedOrder.walk_in_name ||
                              "Walk-In Customer"
                            }
                          />

                          <Detail
                            label="Email"
                            value={selectedOrder.email || selectedOrder.walk_in_email || "—"}
                          />

                          <Detail
                            label="Contact Number"
                            value={selectedOrder.contact_number || selectedOrder.walk_in_contact || "—"}
                          />

                          <Detail
                            label="Location"
                            value={
                              selectedOrder.location ||
                              selectedOrder.walk_in_location ||
                              selectedOrder.address ||
                              "—"
                            }
                          />

                          {selectedOrder.order_type === "walk-in" && (
                            <p className="text-xs text-indigo-600 font-semibold mt-1">Walk-In Order</p>
                          )}
                      <Detail
                        label="Date Ordered"
                        value={
                          selectedOrder.order_date
                            ? new Date(selectedOrder.order_date).toLocaleDateString()
                            : "—"
                        }
                      />
                      <Detail label="Status" value={selectedOrder.status} />
                    </div>
                  </div>

                  {/* PRICING CARD */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-b-gray-200 pb-2">
                      Pricing
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                      <Detail
                        label="Estimated Price"
                        value={
                          selectedOrder.estimated_price != null
                            ? `₱${Number(selectedOrder.estimated_price).toFixed(2)}`
                            : "—"
                        }
                      />

                      <Detail
                        label="Manager Added"
                        value={
                          selectedOrder.manager_added != null
                            ? `₱${Number(selectedOrder.manager_added).toFixed(2)}`
                            : "—"
                        }
                      />
                    </div>

                    {/* TOTAL PRICE */}
                    <div className="mt-4 text-center p-3 bg-green-100 border border-green-300 rounded-xl">
                      <p className="text-xl font-extrabold text-green-700">
                        Total Price:{" "}
                        ₱
                        {(
                          Number(selectedOrder.estimated_price || 0) +
                          Number(selectedOrder.manager_added || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ORDER ITEMS CARD */}
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-b-gray-200 pb-2">
                        {item.service || "Service"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                        {item.attributes?.length > 0 &&
                          item.attributes.map((attr, i) => (
                            <Detail
                              key={i}
                              label={attr.attribute_name || attr.name}
                              value={attr.option_value || attr.value}
                            />
                          ))}
                      </div>

                      {/* FILES */}
                      {(item.files || []).length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Uploaded Files
                          </h4>

                          <div className="flex gap-3 flex-wrap">
                            {item.files.map((file, fIdx) => {
                              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                              const isPDF = /\.pdf$/i.test(file);

                              return (
                                <div key={fIdx} className="flex flex-col items-center">
                                  {isImage && (
                                    <button
                                      onClick={() => {
                                        setImageGallery(item.files);
                                        setCurrentImageIndex(fIdx);
                                        setShowImageModal(true);
                                      }}
                                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
                                    >
                                      View Image
                                    </button>
                                  )}

                                  {isPDF && (
                                    <a
                                      href={`${API_URL.replace("/api", "")}${file}`}
                                      target="_blank"
                                      className="px-3 py-1 bg-white border rounded-lg shadow-sm hover:bg-gray-100"
                                    >
                                      View PDF
                                    </a>
                                  )}

                                  <a
                                    href={`${API_URL.replace("/api", "")}${file}`}
                                    download
                                    className="text-xs text-cyan-600 mt-1 underline"
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
                  ))}

                  {/* NAVIGATION BUTTONS */}
                  <div className="flex justify-between items-center mt-8">
                    <button
                      disabled={currentViewIndex <= 0}
                      onClick={goToPreviousOrder}
                      className={`px-5 py-2 rounded-xl font-semibold transition ${
                        currentViewIndex <= 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-cyan-600 text-white hover:bg-cyan-700"
                      }`}
                    >
                      ← Previous
                    </button>

                    <button
                      disabled={currentViewIndex >= displayedOrders.length - 1}
                      onClick={goToNextOrder}
                      className={`px-5 py-2 rounded-xl font-semibold transition ${
                        currentViewIndex >= displayedOrders.length - 1
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-cyan-600 text-white hover:bg-cyan-700"
                      }`}
                    >
                      Next →
                    </button>
                  </div>

                  {/* CLOSE */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={closeViewModal}
                      className="px-8 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 italic">No order selected.</p>
              )}
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

              <p className="mt-3 text-sm text-gray-600">
                Image {currentImageIndex + 1} of {imageGallery.length}
              </p>

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

      {/* --- Redesigned Status Modal --- */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              {/* Header */}
              <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">
                Update Order Status
              </h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                Choose the new status for this order. This will be visible to the customer.
              </p>

              {/* Current Status */}
              {selectedOrder && (
                <div className="mb-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Current Status
                  </p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[selectedOrder.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              )}

              {/* Status Options */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Select New Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["Pending", "Ongoing", "Out for Delivery", "Completed", "Cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setNewStatus(status)}
                        className={`px-3 py-2 rounded-lg text-sm border transition font-medium
                          ${
                            newStatus === status
                              ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Helper Text */}
              <div className="mb-5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                {newStatus === "Completed" && (
                  <p>
                    Marking this order as <span className="font-semibold">Completed</span>{" "}
                    means all items and payments are finalized.
                  </p>
                )}
                {newStatus === "Cancelled" && (
                  <p>
                    Marking this order as <span className="font-semibold">Cancelled</span>{" "}
                    will indicate that this job will no longer proceed.
                  </p>
                )}
                {newStatus === "Ongoing" && (
                  <p>
                    <span className="font-semibold">Ongoing</span> means the order is
                    currently being processed or produced.
                  </p>
                )}
                {newStatus === "Out for Delivery" && (
                  <p>
                    <span className="font-semibold">Out for Delivery</span> means the order
                    is already on its way to the customer.
                  </p>
                )}
                {newStatus === "Pending" && (
                  <p>
                    <span className="font-semibold">Pending</span> means this order is still
                    waiting to be processed.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeStatusModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSetStatus}
                  className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                >
                  Save Status
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 text-center">
                Add / Update Price
              </h2>

              {selectedOrder && (
                <div className="mb-4 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Customer:</span>{" "}
                    {selectedOrder.customer_name || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Service:</span>{" "}
                    {selectedOrder.service || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Estimated Price:</span>{" "}
                    {selectedOrder.estimated_price != null
                      ? `₱${Number(selectedOrder.estimated_price).toFixed(2)}`
                      : "—"}
                  </p>
                </div>
              )}

              <input
                type="number"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-cyan-500 outline-none text-lg"
                placeholder="Enter manager-added amount..."
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={closePriceModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddPrice}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Walk-in Order Modal */}
      <WalkInOrderModal
        show={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onSubmit={handleAddOrder}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        orderFiles={orderFiles}
        setOrderFiles={setOrderFiles}
        showSizeDropdown={showSizeDropdown}
        setShowSizeDropdown={setShowSizeDropdown}
        products={products}
      />
    </div>
  );
};

export default OrdersSection;