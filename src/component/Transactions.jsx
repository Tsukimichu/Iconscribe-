import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, Clock, Truck, X } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";

function Transactions() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  // Preview image handler
  function handleImagePreview(image) {
    setPreviewImage(image);
    setShowImageModal(true);
  }

  // Check if order can be canceled (within 24 hours)
  const canCancelOrder = (orderDate) => {
    if (!orderDate) return false;
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    return now - orderTime <= 24 * 60 * 60 * 1000;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast("Order cancelled successfully!");
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel order.");
    }
  };

  // Fetch orders and sort latest first
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const sortedOrders = Array.isArray(data)
          ? data.sort(
              (a, b) =>
                new Date(b.dateOrdered || b.created_at) -
                new Date(a.dateOrdered || a.created_at)
            )
          : [];

        setOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, userId]);

  if (!isLoggedIn) return null;

  // Build notifications (latest 5, excluding cancelled)
  const notifications = orders
    .filter(order => order.status !== "Cancelled")
    .slice(0, 5)
    .map((order) => ({
      title: order.service || order.product_name,
      date: order.dateOrdered?.slice(0, 10) || order.created_at?.slice(0, 10),
      status: order.status,
    }));

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
          className="md:col-span-2 h-[350px] rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-6">Project Summary</h3>
          <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
            <table className="min-w-full table-fixed border-collapse text-sm md:text-base">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-300">
                <tr className="text-left text-gray-600">
                  <th className="py-2 w-[25%]">Service</th>
                  <th className="w-[20%]">Date Ordered</th>
                  <th className="w-[15%]">Urgency</th>
                  <th className="w-[20%] text-center">Status</th>
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
                    const isCancelled = item.status === "Cancelled";

                    return (
                      <motion.tr
                        key={item.id || index}
                        className={`transition-all hover:bg-gray-100 ${isCancelled ? "bg-gray-100 text-gray-400 opacity-70" : ""}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="py-2 px-2 font-medium w-[25%] truncate">{item.service || item.product_name}</td>
                        <td className="w-[20%] truncate">{item.dateOrdered?.slice(0, 10) || item.created_at?.slice(0, 10)}</td>
                        <td className="font-semibold w-[15%] truncate">{item.urgency}</td>
                        <td className="font-semibold w-[20%]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`cursor-pointer ${item.image ? "opacity-90 hover:opacity-100" : ""}`}
                              onClick={() => item.image && handleImagePreview(item.image)}
                            >
                              {getStatusIcon(item.status)}
                            </span>
                            {item.status}
                          </div>
                        </td>
                        <td className="py-2 px-2 w-[20%]">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg shadow transition"
                            >
                              View
                            </button>

                            <button
                              onClick={() => handleCancelOrder(item.id)}
                              disabled={isCancelled || !canCancelOrder(item.dateOrdered || item.created_at)}
                              className={`bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow transition ${
                                isCancelled || !canCancelOrder(item.dateOrdered || item.created_at)
                                  ? "opacity-50 cursor-not-allowed hover:bg-red-600"
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
          className="rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-6">Notifications</h3>
          <ul className="space-y-3 text-sm flex-1">
            {notifications.length === 0 ? (
              <li className="text-center py-2 text-gray-500">No notifications yet.</li>
            ) : (
              notifications.map((note, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
                >
                  <span>{note.title} ({note.status})</span>
                  <span>{note.date}</span>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <img src={previewImage} alt="Preview" className="max-w-[90%] max-h-[85vh] rounded-lg shadow-lg" />
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </section>
  );
}

// Separate component for Order Modal
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
          <p><strong>Status:</strong> <span className="inline-flex items-center gap-2">{getStatusIcon(order.status)}{order.status}</span></p>
          <p><strong>Service:</strong> {order.service || order.product_name}</p>
          <p><strong>Date Ordered:</strong> {order.dateOrdered?.slice(0,10) || order.created_at?.slice(0,10)}</p>
          <p><strong>Urgency:</strong> {order.urgency}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>

          {order.custom_details && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Custom Details</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                {(() => {
                  let details;
                  try {
                    details = typeof order.custom_details === "string"
                      ? JSON.parse(order.custom_details)
                      : order.custom_details;
                  } catch {
                    details = { Info: order.custom_details };
                  }
                  return Object.entries(details).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {String(value)}</p>
                  ));
                })()}
              </div>
            </div>
          )}

          {order.details && Object.keys(order.details).length > 0 && (
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
          <button onClick={onClose} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function getStatusIcon(status) {
  switch (status) {
    case "In review":
    case "Ongoing":
    case "Pending":
      return <Clock size={16} />;
    case "Completed":
      return <CheckCircle size={16} />;
    case "Out for Delivery":
      return <Truck size={16} />;
    default:
      return null;
  }
}

export default Transactions;
