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
import { API_URL } from "../../api";
import WalkInOrderModal from "./WalkInOrderModal";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [imageGallery, setImageGallery] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [tableView, setTableView] = useState("active");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // --- Walk-in order modal ---
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Form state for new walk-in order
  // Update your existing useState for newOrder
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
    // Product Specifics
    quantity: "",
    size: "",
    paper_type: "",
    color_printing: "", 
    binding_type: "",
    material: "",
    details: "",
    // NEW FIELDS FOR BROCHURE
    lamination: "", 
    back_to_back: false, 
  });

  const [showUrgencyModal, setShowUrgencyModal] = useState(false);
  const [newUrgency, setNewUrgency] = useState("");

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
    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];

        // 🔥 Normalize table data
        setOrders(
          arr.map((o) => {
            const userId =
              o.user_id !== undefined
                ? o.user_id
                : o.userId !== undefined
                ? o.userId
                : null;

            // --- SAFEST NAME FIX ON EARTH ---
            // Walk-in = user_id === null
            // Online = user_id = number

            const safeCustomerName = (() => {
              if (userId === null) {
                // WALK-IN
                const n = o.customer_name?.trim();
                if (n && n !== "null" && n !== "undefined") return n;

                // If missing, fallback to attribute or last resort
                return o.name || "Walk-in Customer";
              }

              // ONLINE ORDERS
              return o.customer_name || o.name || "";
            })();

            return {
              ...o,

              // Normalized IDs
              user_id: userId,
              order_id: o.order_id || o.orderId || null,

              // ✔ FIXED: Correct name field (NO MORE TYPO)
              customer_name: safeCustomerName,

              // Normalized date
              dateOrdered: o.dateOrdered || o.order_date || o.orderDate || null,

              // Safe price total
              total_price:
                Number(o.estimated_price || 0) + Number(o.manager_added || 0),
            };
          })
        );
      })
      .catch((err) => console.error("❌ Error loading orders:", err));
  };



  // Load on first render
  useEffect(() => {
    loadOrders();
  }, []);


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
        `${API_URL}/orders/${orderId}/price`,
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
        `${API_URL}/orders/${itemId}/status`,
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

  const handleAddOrder = async () => {
    const { customer_name, service, quantity, price } = newOrder;

    // ==========================
    // 1. Validations
    // ==========================
    if (!customer_name?.trim()) {
      return alert("Please enter customer name.");
    }

    // SERVICE must always be set
    if (!service || service.trim() === "") {
      return alert("Select a product/service.");
    }

    // QUANTITY must exist
    if (!quantity || Number(quantity) <= 0) {
      return alert("Enter valid quantity.");
    }

    // PRICE must be computed
    if (!price || isNaN(price)) {
      return alert("Price was not computed. Check product inputs.");
    }

    try {
      const fd = new FormData();

      // ==========================
      // 2. Core Fields ALWAYS included
      // ==========================
      const CORE_FIELDS = [
        "customer_name",
        "email",
        "contact_number",
        "location",
        "service",
        "quantity",
        "price",       // estimated price
        "urgency",
        "status",
      ];

      const details = {};

      // ==========================
      // 3. Separate CORE + DETAILS
      // ==========================
      Object.entries(newOrder).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          return; // skip empty fields ONLY
        }

        // Core fields go into form-data root
        if (CORE_FIELDS.includes(key)) {
          fd.append(key, value);
        } 
        // Everything else goes inside DETAILS JSON
        else {
          details[key] = value;
        }
      });

      // ==========================
      // 4. Attach all product-specific fields
      // ==========================
      fd.append("details", JSON.stringify(details));

      // ==========================
      // 5. Attach uploaded files
      // ==========================
      orderFiles.forEach((file) => fd.append("files", file));

      // ==========================
      // 6. Send request to backend
      // ==========================
      const res = await fetch(`${API_URL}/orders/walkin`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add order");
      }

      // ==========================
      // 7. Refresh Orders List
      // ==========================
      await loadOrders();

      // ==========================
      // 8. Reset form after success
      // ==========================
      setShowAddOrderModal(false);
      setOrderFiles([]);
      setSelectedProduct("");

      setNewOrder({
        customer_name: "",
        email: "",
        contact_number: "",
        location: "",
        price: "",
        service: "",
        quantity: "",
        size: "",
        custom_width: "",
        custom_height: "",
        paper_type: "",
        color_printing: "",
        lamination: "",
        back_to_back: false,
        number_of_pages: "",
        binding_type: "",
        cover_finish: "",
        book_type: "",
        calendar_type: "",
        color: "",
        event_name: "",
        layout: "",
        card_title: "",
        business_name: "",
        booklet_finish: "",
        with_stub: "",
        urgency: "Normal",
        status: "Pending",
      });

    } catch (err) {
      console.error("❌ Error adding walk-in order:", err);
      alert("Server error while adding order. Please try again later.");
    }
  };



  // --- Open View Modal ---
  const openViewModal = async (order) => {
    try {
      let url = "";

      // Determine if walk-in properly (user_id missing OR null)
      const isWalkIn = !order.user_id || order.user_id === null;

      if (isWalkIn) {
        // walk-in uses enquiryNo only
        url = `${API_URL}/orders/walkin/${order.enquiryNo}`;
      } else {
        // online orders MUST use order_id
        const oid = order.order_id || order.orderId; // <-- fallback fix
        if (!oid) {
          alert("Order ID missing. Cannot load online order.");
          return;
        }
        url = `${API_URL}/orders/full/${oid}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Unable to load order.");
        return;
      }

      const finalOrder = data.order;

      // Safe defaults
      finalOrder.customer_name = finalOrder.customer_name || "Customer";
      finalOrder.email = finalOrder.email || "—";
      finalOrder.contact_number = finalOrder.contact_number || "—";
      finalOrder.location = finalOrder.location || "—";

      setSelectedOrder(finalOrder);
      setShowViewModal(true);

    } catch (err) {
      console.error("❌ Error loading order:", err);
      alert("Server error loading order.");
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
  
  const handlePriceInput = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) return;

    setNewOrder((prev) => ({
      ...prev,
      price: cleaned,
    }));
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
                      {order.total_price != null
                        ? `₱${Number(order.total_price).toFixed(2)}`
                        : <span className="text-gray-400 italic">—</span>}
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

                      {/* COMPLETED / CANCELED VIEW: */}
                      {tableView === "completed" || tableView === "canceled" ? (
                        <>
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

              {selectedOrder && (
                <div className="space-y-6">
                  
                  {/* BASIC INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><b>Customer Name:</b> {selectedOrder.customer_name}</p>
                    <p><b>Email:</b> {selectedOrder.email}</p>
                    <p><b>Contact Number:</b> {selectedOrder.contact_number}</p>
                    <p><b>Location:</b> {selectedOrder.location}</p>

                    <p>
                      <b>Date Ordered:</b>{" "}
                      {selectedOrder.dateOrdered
                        ? new Date(selectedOrder.dateOrdered).toLocaleString()
                        : "—"}
                    </p>

                    <p><b>Status:</b> {selectedOrder.status}</p>
                    <p>
                      <b>Total:</b> ₱
                      {Number(selectedOrder.total ?? selectedOrder.price ?? 0).toFixed(2)}
                    </p>
                  </div>

                  {/* ORDER ITEMS */}
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="border-t pt-5 mt-5">
                        
                        <h3 className="text-xl font-bold text-cyan-700 mb-3">
                          {item.service}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                          <p><b>Enquiry No:</b> {item.enquiryNo}</p>
                          <p><b>Quantity:</b> {item.quantity}</p>
                          <p><b>Urgency:</b> {item.urgency}</p>
                          <p>
                            <b>Estimated Price:</b> ₱
                            {Number(item.estimated_price || 0).toFixed(2)}
                          </p>

                          {/* ATTRIBUTES */}
                          {item.details &&
                            Object.keys(item.details).map((key) => (
                              <p key={key}>
                                <b>{key.replace(/_/g, " ")}:</b> {item.details[key]}
                              </p>
                            ))}

                          {/* FILES */}
                          {item.files && item.files.length > 0 && (
                            <div className="col-span-2">
                              <b>Uploaded Files:</b>
                              <div className="flex gap-3 mt-2 flex-wrap">
                                {item.files.map((f, fIdx) => {
                                  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(f);
                                  const isPDF = /\.pdf$/i.test(f);

                                  return (
                                    <div key={fIdx} className="flex flex-col items-center">
                                      {isImage && (
                                        <button
                                          onClick={() => {
                                            setImageGallery(item.files);
                                            setCurrentImageIndex(fIdx);
                                            setShowImageModal(true);
                                          }}
                                          className="bg-gray-100 border px-2 py-1 rounded"
                                        >
                                          View Image
                                        </button>
                                      )}

                                      {isPDF && (
                                        <a
                                          target="_blank"
                                          href={`${API_URL.replace("/api","")}${f}`}
                                          className="bg-gray-100 border px-2 py-1 rounded"
                                        >
                                          View PDF
                                        </a>
                                      )}

                                      <a
                                        href={`${API_URL.replace("/api","")}${f}`}
                                        download
                                        className="text-xs text-blue-600 mt-1"
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
                    <p className="text-gray-500 italic">No items found for this order.</p>
                  )}
                </div>
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
            />
    </div>
  );
};

export default OrdersSection;