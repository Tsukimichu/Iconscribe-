import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Clock, Truck, X, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";
import io from "socket.io-client";
import { API_URL } from "../api.js";

const socket = io("http://localhost:5000");

function sendPushNotification(title, body) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/ICONS.png",
      vibrate: [150, 80, 150],
    });
  }
}

function Transactions() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const userId = user?.id;
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [serverNow, setServerNow] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [editOrder, setEditOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let secondTicker = null;
    let resyncTicker = null;

    async function syncServerTime() {
      try {
        const res = await fetch(`${API_URL}/orders/server-time`);
        const data = await res.json();
        setServerNow(data.now);
      } catch {}
    }

    syncServerTime();

    secondTicker = setInterval(() => {
      setServerNow((prev) => (prev !== null ? prev + 1000 : null));
    }, 1000);

    resyncTicker = setInterval(syncServerTime, 30000);

    return () => {
      clearInterval(secondTicker);
      clearInterval(resyncTicker);
    };
  }, []);

  const canCancelOrder = (date, status) => {
    if (!date || !serverNow) return false;
    if (["Ongoing", "Out for Delivery", "Completed", "Cancelled"].includes(status)) return false;
    const orderTime = new Date(date).getTime();
    return serverNow - orderTime <= 24 * 60 * 60 * 1000;
  };

  const canEditOrder = (date, status) => {
    if (!date || !serverNow) return false;
    if (["Ongoing", "Out for Delivery", "Completed", "Cancelled"].includes(status)) return false;
    const orderTime = new Date(date).getTime();
    return serverNow - orderTime <= 12 * 60 * 60 * 1000;
  };

  const executeCancelOrder = async (reason) => {
    if (!orderToCancel) return;

    try {
      const res = await fetch(`${API_URL}/orders/${orderToCancel}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message);
        return setOrderToCancel(null);
      }

      showToast("Order cancelled successfully!");
    } catch (err) {
      showToast("Failed to cancel order.");
    } finally {
      setOrderToCancel(null);
    }
  };

  const fetchOrders = async () => {
    if (!userId) return;
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
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = () => fetchOrders();

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    fetchOrders();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinUserRoom", userId);

    const statusHandler = (data) => {
      const message = `Your order "${data.service}" is now ${data.status}`;
      showToast(message);
      sendPushNotification("Order Update", message);

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === data.order_id ? { ...o, status: data.status } : o
        )
      );

      setLiveNotifications((prev) => [
        {
          title: data.service,
          status: data.status,
          date: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    };

    const priceHandler = (data) => {
      const msg = `New total price: ₱${data.total}`;
      showToast(msg);
      sendPushNotification("Price Updated", msg);

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === data.order_id
            ? { ...o, price: data.total, _flash: true }
            : o
        )
      );

      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === data.order_id ? { ...o, _flash: false } : o
          )
        );
      }, 1200);

      setLiveNotifications((prev) => [
        {
          title: data.service,
          status: "Price Updated",
          price: data.total,
          date: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    };

    socket.on("orderStatusUpdated", statusHandler);
    socket.on("orderPriceUpdated", priceHandler);

    return () => {
      socket.off("orderStatusUpdated", statusHandler);
      socket.off("orderPriceUpdated", priceHandler);
    };
  }, [userId]);

  if (!isLoggedIn) return null;

  const backendNotifications = orders
    .filter((o) => o.status !== "Cancelled")
    .slice(0, 5)
    .map((o) => ({
      title: o.service,
      date: o.dateOrdered?.slice(0, 10),
      status: o.status,
    }));

  const notifications = [...liveNotifications, ...backendNotifications].slice(0, 5);

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
        <motion.div
          className="md:col-span-2 h-[450px] rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            Project Summary
          </h3>

          <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
            <table className="min-w-full table-fixed border-collapse text-sm md:text-base">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-300">
                <tr className="text-left text-gray-600">
                  <th className="py-2 w-[25%]">Service</th>
                  <th className="w-[20%]">Date Ordered</th>
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
                    <td colSpan={8} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((item, index) => {
                    const orderDate = item.dateOrdered || item.created_at;

                    const disableEdit = !canEditOrder(orderDate, item.status);
                    const disableCancel = !canCancelOrder(orderDate, item.status);

                    return (
                      <motion.tr
                        key={item.enquiryNo}
                        className={`transition-all hover:bg-gray-100 ${
                          item.status === "Cancelled"
                            ? "bg-gray-100 text-gray-400 opacity-70"
                            : ""
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="py-2 px-2 font-medium w-[25%] truncate">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(item)}
                            className="text-left w-full hover:underline"
                          >
                            {item.service}
                          </button>
                        </td>

                        <td className="w-[20%] truncate">
                          {orderDate ? String(orderDate).slice(0, 10) : "—"}
                        </td>

                        <td className="w-[10%] text-center">
                          {item.file1 ? (
                            <button
                              onClick={() => {
                                setPreviewImage(
                                  `http://localhost:5000${item.file1}`
                                );
                                setShowImageModal(true);
                              }}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </td>

                        <td className="w-[15%] text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(item.status)}
                            <span>{item.status}</span>
                          </div>
                        </td>

                        <td className="font-semibold w-[10%]">
                          ₱
                          {Number(
                            item.estimated_price || 0
                          ).toLocaleString("en-PH")}
                        </td>

                        <td
                          className={
                            "font-semibold w-[10%] transition-all " +
                            (item._flash ? "price-flash" : "")
                          }
                        >
                          ₱
                          {Number(
                            item.price || item.total_price || 0
                          ).toLocaleString("en-PH")}
                        </td>

                        <td className="py-2 px-2 w-[20%]">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditOrder(item)}
                              disabled={disableEdit}
                              className={`bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow transition ${
                                disableEdit
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-blue-700"
                              }`}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => setOrderToCancel(item.enquiryNo)}
                              disabled={disableCancel}
                              className={`bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow transition ${
                                disableCancel
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

        <motion.div
          className="rounded-2xl backdrop-blur-xl bg-white/60 shadow-xl border border-gray-300 p-6 flex flex-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Bell size={20} /> Notifications
          </h3>

          <ul className="space-y-3 text-xs flex-1 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <li className="text-center py-2 text-gray-500">
                No notifications yet.
              </li>
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
                    <span className="font-semibold text-gray-700">
                      {note.title}
                    </span>

                    <span
                      className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                        note.status === "Pending"
                          ? "bg-[#D6ECFF] text-[#0057A8]"
                          : note.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : note.status === "Out for Delivery"
                          ? "bg-[#FFE1D8] text-[#B2401F]"
                          : note.status === "Ongoing"
                          ? "bg-[#FFF4CC] text-[#A07900]"
                          : note.status === "Price Updated"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
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

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {editOrder && (
        <EditOrderModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onUpdated={refreshOrders}
        />
      )}

      {orderToCancel && (
        <ConfirmCancelModal
          onClose={() => setOrderToCancel(null)}
          onConfirm={(reason) => executeCancelOrder(reason)}
        />
      )}
    </section>
  );
}

function ConfirmCancelModal({ onClose, onConfirm }) {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");

  const reasonsList = [
    "Changed my mind",
    "Ordered by mistake",
    "Takes too long to process",
    "Wrong item ordered",
    "Other"
  ];

  const toggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleConfirm = () => {
    if (selectedReasons.length === 0) {
      alert("Please select at least one reason.");
      return;
    }

    // Combine the reasons into a single string
    const finalReason = selectedReasons.includes("Other")
      ? `${selectedReasons.filter((r) => r !== "Other").join(", ")} ${
          otherReason ? "- " + otherReason : ""
        }`
      : selectedReasons.join(", ");

    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4 mx-auto">
            <AlertTriangle className="text-red-600" size={32} />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-1">
            Cancel Order?
          </h3>

          <p className="text-gray-600 text-sm mb-4">
            Please tell us why you want to cancel.
          </p>

          {/* REASONS CHECKBOXES */}
          <div className="text-left space-y-2 mb-4">
            {reasonsList.map((reason) => (
              <label key={reason} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={() => toggleReason(reason)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {/* OTHER REASON TEXTAREA */}
          {selectedReasons.includes("Other") && (
            <textarea
              placeholder="Write your reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm mb-4"
              rows="3"
            />
          )}

          <div className="flex gap-3 w-full mt-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
            >
              No, Keep it
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

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
          <button onClick={onClose} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p>
            <strong>Service:</strong> {order.service}
          </p>

          <p>
            <strong>Date Ordered:</strong>{" "}
            {order.dateOrdered?.slice(0, 10)}
          </p>

          <p>
            <strong>Quantity:</strong> {order.quantity}
          </p>

          {order.details && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Order Details</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                {Object.entries(order.details).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

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

function EditOrderModal({ order, onClose, onUpdated }) {
  const [quantity, setQuantity] = useState(order.quantity);
  const [productAttributes, setProductAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState(order.details || {});
  const { showToast } = useToast();

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const res = await fetch(`${API_URL}/attributes/product/${order.product_id}`);
        const data = await res.json();
        setProductAttributes(data);
      } catch {}
    };
    loadAttributes();
  }, [order.product_id]);

  const saveUpdates = async () => {
    try {
      const formattedAttributes = Object.entries(attributeValues).map(
        ([name, value]) => ({ name, value })
      );

      const res = await fetch(`${API_URL}/orders/edit/${order.enquiryNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          attributes: formattedAttributes,
        }),
      });

      const data = await res.json();
      if (!data.success) return showToast(data.message);

      showToast("Order updated!");
      onUpdated();
      onClose();
    } catch {
      showToast("Server Error");
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

        <label className="font-semibold">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="font-semibold mb-2 block">Attributes</label>

        {productAttributes.length === 0 ? (
          <p className="text-gray-500">No attributes for this product.</p>
        ) : (
          productAttributes.map((attr) => (
            <div key={attr.attribute_id} className="mb-3">
              <label className="font-medium">{attr.attribute_name}</label>

              {attr.input_type === "select" ? (
                <select
                  value={attributeValues[attr.attribute_name] || ""}
                  onChange={(e) =>
                    setAttributeValues({
                      ...attributeValues,
                      [attr.attribute_name]: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select option</option>
                  {attr.options.map((op, i) => (
                    <option key={i} value={op.option_value}>
                      {op.option_value}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={attributeValues[attr.attribute_name] || ""}
                  onChange={(e) =>
                    setAttributeValues({
                      ...attributeValues,
                      [attr.attribute_name]: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              )}
            </div>
          ))
        )}

        <div className="flex justify-end gap-3 mt-6">
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
