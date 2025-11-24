import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Clock, Truck, X, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";
import io from "socket.io-client";
import { API_URL } from "../api.js";

const socket = io("http://localhost:5000");

function Transactions() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const userId = user?.id;

  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverTime, setServerTime] = useState(Date.now());  // ✅ Real server time
  const [timeOffset, setTimeOffset] = useState(0);           // Difference: server - device

  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const [liveNotifications, setLiveNotifications] = useState([]);

  // ============================================================
  // 🚀 FETCH REAL SERVER TIME
  // ============================================================
  const fetchServerTime = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/server-time`);
      const data = await res.json();

      const serverNow = data.now;
      const localNow = Date.now();

      setServerTime(serverNow);

      // Store offset to ensure all checks use server time only
      setTimeOffset(serverNow - localNow);

    } catch (err) {
      console.error("Failed to fetch server time:", err);
    }
  };

  // Fetch server time every mount + every 30 seconds
  useEffect(() => {
    fetchServerTime();
    const interval = setInterval(fetchServerTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // 🔐 Get real server time safely
  // ============================================================
  const getServerNow = () => Date.now() + timeOffset;

  // ============================================================
  // ⛔ Replace device-time-dependent logic
  // ============================================================
  const canCancelOrder = (orderDate) => {
    if (!orderDate) return false;
    const orderMs = new Date(orderDate).getTime();
    const now = getServerNow();
    return now - orderMs <= 24 * 60 * 60 * 1000;
  };

  const canEditOrder = (orderDate) => {
    if (!orderDate) return false;
    const orderMs = new Date(orderDate).getTime();
    const now = getServerNow();
    return now - orderMs <= 12 * 60 * 60 * 1000;
  };

  // ============================================================
  // EXECUTE CANCEL ORDER
  // ============================================================
  const executeCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const res = await fetch(`${API_URL}/orders/${orderToCancel}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showToast("Order cancelled successfully!");

      setOrders(prev =>
        prev.map(o =>
          o.enquiryNo === orderToCancel
            ? { ...o, status: "Cancelled" }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel order.");
    } finally {
      setOrderToCancel(null);
    }
  };

  // ============================================================
  // FETCH USER ORDERS
  // ============================================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/orders/user/${userId}`);
      const data = await res.json();

      const sorted = Array.isArray(data)
        ? data.sort(
            (a, b) =>
              new Date(b.dateOrdered || b.created_at) -
              new Date(a.dateOrdered || a.created_at)
          )
        : [];

      setOrders(sorted);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    fetchOrders();
  }, [isLoggedIn, userId]);

  // ============================================================
  // SOCKET LISTENERS
  // ============================================================
  useEffect(() => {
    if (!userId) return;

    socket.emit("joinUserRoom", userId);

    socket.on("orderStatusUpdated", (data) => {
      showToast(`Your order "${data.service}" is now: ${data.status}`);

      setOrders(prev =>
        prev.map(o =>
          o.order_id === data.order_id ? { ...o, status: data.status } : o
        )
      );

      setLiveNotifications(prev => [
        {
          title: data.service,
          status: data.status,
          date: new Date().toISOString().slice(0, 10)
        },
        ...prev
      ]);
    });

    socket.on("orderPriceUpdated", (data) => {
      showToast(`New total price: ₱${data.total}`);

      setOrders(prev =>
        prev.map(o =>
          o.order_id === data.order_id
            ? { ...o, price: data.total, _flash: true }
            : o
        )
      );

      setTimeout(() => {
        setOrders(prev =>
          prev.map(o =>
            o.order_id === data.order_id
              ? { ...o, _flash: false }
              : o
          )
        );
      }, 1200);

      setLiveNotifications(prev => [
        {
          title: data.service,
          status: "Price Updated",
          price: data.total,
          date: new Date().toISOString().slice(0, 10)
        },
        ...prev
      ]);
    });

    return () => {
      socket.off("orderStatusUpdated");
      socket.off("orderPriceUpdated");
    };
  }, [userId]);

  if (!isLoggedIn) return null;

  // ============================================================
  // NOTIFICATIONS LIST
  // ============================================================
  const backendNotifications = orders
    .filter(order => order.status !== "Cancelled")
    .slice(0, 5)
    .map(order => ({
      title: order.service || order.product_name,
      date: order.dateOrdered?.slice(0, 10) || order.created_at?.slice(0, 10),
      status: order.status,
    }));

  const notifications = [...liveNotifications, ...backendNotifications].slice(0, 5);

  // ============================================================
  // RENDER UI
  // ============================================================
  return (
    <section className="relative w-full px-6 py-30 bg-white text-gray-800">
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Transactions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Orders Table */}
        <motion.div
          className="md:col-span-2 h-[450px] rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">Project Summary</h3>

          <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
            <table className="min-w-full table-fixed border-collapse text-sm md:text-base">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-300">
                <tr className="text-left text-gray-600">
                  <th className="py-2 w-[25%]">Service</th>
                  <th className="w-[20%]">Date Ordered</th>
                  <th className="w-[15%]">Urgency</th>
                  <th className="w-[10%] text-center">File</th>
                  <th className="w-[15%] text-center">Status</th>
                  <th className="w-[10%]">Est. Price</th>
                  <th className="w-[10%]">Total</th>
                  <th className="w-[20%] text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">Loading...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((item, index) => {

                    const disableActions =
                      ["Ongoing", "Out for Delivery", "Completed", "Cancelled"].includes(item.status) ||
                      !canEditOrder(item.dateOrdered || item.created_at);

                    return (
                      <motion.tr
                        key={item.id || index}
                        className={`transition-all hover:bg-gray-100 ${
                          item.status === "Cancelled" ? "bg-gray-100 text-gray-400 opacity-70" : ""
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >

                        {/* SERVICE */}
                        <td className="py-2 px-2 font-medium w-[25%] truncate">
                          {item.service || item.product_name}
                        </td>

                        {/* DATE */}
                        <td className="w-[20%] truncate">
                          {item.dateOrdered?.slice(0,10) || item.created_at?.slice(0,10)}
                        </td>

                        {/* URGENCY */}
                        <td className="font-semibold w-[15%] truncate">
                          {item.urgency}
                        </td>

                        {/* FILE */}
                        <td className="w-[10%] text-center">
                          {item.file1 ? (
                            <button
                              onClick={() => setPreviewImage(`http://localhost:5000${item.file1}`) || setShowImageModal(true)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="w-[15%] text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(item.status)}
                            <span>{item.status}</span>
                          </div>
                        </td>

                        {/* EST PRICE */}
                        <td className="font-semibold w-[10%]">
                          ₱{Number(item.estimated_price).toLocaleString("en-PH")}
                        </td>

                        {/* TOTAL */}
                        <td
                          className={
                            "font-semibold w-[10%] transition-all " +
                            (item._flash ? "price-flash" : "")
                          }
                        >
                          ₱{Number(item.price || item.total_price || 0).toLocaleString("en-PH")}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-2 px-2 w-[20%]">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditOrder(item)}
                              disabled={disableActions}
                              className={`bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow transition ${
                                disableActions ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                              }`}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => setOrderToCancel(item.enquiryNo)}
                              disabled={!canCancelOrder(item.dateOrdered || item.created_at)}
                              className={`bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow transition ${
                                !canCancelOrder(item.dateOrdered || item.created_at)
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-red-700"
                              }`}
                            >
                              Cancel
                            </button>

                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="rounded-2xl backdrop-blur-xl bg-white/60 shadow-xl border border-gray-300 p-6 flex flex-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-bold mb-6">Notifications</h3>

          <ul className="space-y-3 text-xs flex-1 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <li className="text-center py-2 text-gray-500">No notifications yet.</li>
            ) : (
              notifications.map((note, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center bg-white p-2 rounded-lg shadow border border-gray-200 text-xs gap-2"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">{note.title}</span>
                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                      note.status === "Pending"
                        ? "bg-[#D6ECFF] text-[#0057A8]"
                        : note.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : note.status === "Out for Delivery"
                        ? "bg-[#FFE1D8] text-[#B2401F]"
                        : note.status === "Ongoing"
                        ? "bg-[#FFF4CC] text-[#A07900]"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {note.status}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">{note.date}</span>
                </motion.li>
              ))
            )}
          </ul>
        </motion.div>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90%] max-h-[85vh] rounded-lg shadow-lg"
          />
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white bg-gray-800 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* EDIT ORDER MODAL */}
      {editOrder && (
        <EditOrderModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onUpdated={refreshOrders}
        />
      )}

      {/* CANCEL CONFIRM MODAL */}
      {orderToCancel && (
        <ConfirmCancelModal
          onClose={() => setOrderToCancel(null)}
          onConfirm={executeCancelOrder}
        />
      )}

    </section>
  );
}
// --- CONFIRM CANCEL MODAL ---
function ConfirmCancelModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Order?</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              No, Keep it
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- ORDER DETAILS MODAL ---
function OrderModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Service:</strong> {order.service}</p>
          <p><strong>Date Ordered:</strong> {order.dateOrdered?.slice(0,10)}</p>
          <p><strong>Urgency:</strong> {order.urgency}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>

          {order.details && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Order Details</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                {Object.entries(order.details).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {String(value)}</p>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- STATUS ICONS ---
function getStatusIcon(status) {
  switch (status) {
    case "Pending":
    case "In review":
    case "Ongoing":
      return <Clock size={16} className="text-yellow-600" />;
    case "Out for Delivery":
      return <Truck size={16} className="text-orange-600" />;
    case "Completed":
      return <CheckCircle size={16} className="text-green-600" />;
    default:
      return null;
  }
}

// --- PRICE FORMATTER ---
function formatPrice(amount) {
  if (!amount || isNaN(amount)) return "—";
  return "₱" + Number(amount).toLocaleString("en-PH");
}

// --- EDIT ORDER MODAL ---
function EditOrderModal({ order, onClose, onUpdated }) {
  const [quantity, setQuantity] = useState(order.quantity);
  const [urgency, setUrgency] = useState(order.urgency);
  const [attributes, setAttributes] = useState(
    Object.entries(order.details || {}).map(([name, value]) => ({
      name,
      value
    }))
  );

  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const { showToast } = useToast();

  const saveUpdates = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/edit/${order.enquiryNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          urgency,
          attributes
        }),
      });

      const data = await res.json();
      if (!data.success) return showToast(data.message);

      showToast("Order updated!");
      onUpdated();
      onClose();
    } catch (err) {
      showToast("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[70] p-4">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >

        <h2 className="text-xl font-bold mb-4">Edit Order</h2>

        {/* Quantity */}
        <label className="font-semibold">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Urgency */}
        <label className="font-semibold">Urgency</label>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option>Normal</option>
          <option>Urgent</option>
        </select>

        {/* Custom Fields */}
        <label className="font-semibold">Custom Details</label>
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              placeholder="Name"
              value={attr.name}
              onChange={(e) =>
                setAttributes(
                  attributes.map((a, i) =>
                    i === index ? { ...a, name: e.target.value } : a
                  )
                )
              }
              className="w-1/2 border p-2 rounded"
            />
            <input
              placeholder="Value"
              value={attr.value}
              onChange={(e) =>
                setAttributes(
                  attributes.map((a, i) =>
                    i === index ? { ...a, value: e.target.value } : a
                  )
                )
              }
              className="w-1/2 border p-2 rounded"
            />
          </div>
        ))}

        <button
          onClick={() => setAttributes([...attributes, { name: "", value: "" }])}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded mb-4"
        >
          + Add Field
        </button>

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={saveUpdates}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default Transactions;
