import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Clock, Truck, X } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

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
  const [editOrder, setEditOrder] = useState(null);
  const [liveNotifications, setLiveNotifications] = useState([]);



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

  const handleCancelOrder = async (orderItemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderItemId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showToast("Order cancelled successfully!");

      setOrders(prev => prev.map(o =>
        o.enquiryNo === orderItemId
          ? { ...o, status: "Cancelled" }
          : o
      ));
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel order.");
    }
  };

  // Fetch orders and sort latest first
  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    fetchOrders();
  }, [isLoggedIn, userId]);

  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
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

  // Request notification permission on mount
    useEffect(() => {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
          });
        }
      }
    }, []);  

 // Real-time Socket.IO updates
  useEffect(() => {
    if (!userId) return;

    socket.emit("joinUserRoom", userId);

    // STATUS UPDATE
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

      if (Notification.permission === "granted") {
        new Notification("Order Status Update", {
          body: `Your order "${data.service}" is now ${data.status}`,
          icon: "/icons/ICONS.png",
        });
      }
    });

    // PRICE UPDATE
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

      if (Notification.permission === "granted") {
        new Notification("Price Updated!", {
          body: `Your new total is ₱${data.total}`,
          icon: "/icons/ICONS.png",
        });
      }
    });

    return () => {
      socket.off("orderStatusUpdated");
      socket.off("orderPriceUpdated");
    };
  }, [userId]);




  if (!isLoggedIn) return null;

  // Build notifications (latest 5, excluding cancelled)
  const backendNotifications = orders
    .filter(order => order.status !== "Cancelled")
    .slice(0, 5)
    .map(order => ({
      title: order.service || order.product_name,
      date: order.dateOrdered?.slice(0, 10) || order.created_at?.slice(0, 10),
      status: order.status,
    }));

  // Prioritize LIVE notifications on top
  const notifications = [...liveNotifications, ...backendNotifications]
    .slice(0, 5);



    const canEditOrder = (orderDate) => {
      const orderTime = new Date(orderDate).getTime();
      const now = Date.now();
      return now - orderTime <= 12 * 60 * 60 * 1000;
    };
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
                      ["Completed", "Cancelled"].includes(item.status) ||
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
                      {(() => {
                        const disableActions =
                          ["Completed", "Cancelled"].includes(item.status) ||
                          !canEditOrder(item.dateOrdered || item.created_at);

                        return (
                          <>
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

                              {/* FILE COLUMN */}
                              <td className="w-[10%] text-center">
                                {item.file1 ? (
                                  <button
                                    onClick={() => handleImagePreview(`http://localhost:5000${item.file1}`)}
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

                            {/* Estimated Price */}
                          <td className="font-semibold w-[15%]">
                            {formatPrice(item.estimated_price)}
                          </td>

                            {/* Total Price */}
                            <td
                              className={
                                "font-semibold w-[15%] transition-all " +
                                (item._flash ? "price-flash" : "—")
                              }
                            >
                              {formatPrice(item.price || item.total_price)}
                            </td>

                            {/* ACTION BUTTONS */}
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
                                  onClick={() => handleCancelOrder(item.enquiryNo)}
                                  disabled={disableActions}
                                  className={`bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow transition ${
                                    disableActions
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-red-700"
                                  }`}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        );
                      })()}
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
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            Notifications
          </h3>

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
                  className="flex justify-between items-center bg-white p-2 rounded-lg shadow transition hover:shadow-md duration-200 border border-gray-200 text-xs gap-2"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">{note.title}</span>
                   
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

      {/* EDIT ORDER MODAL (PUT IT HERE!) */}
      {editOrder && (
        <EditOrderModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onUpdated={refreshOrders}
        />
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

  function formatPrice(amount) {
    if (!amount || isNaN(amount)) return "—";
    return "₱" + Number(amount).toLocaleString("en-PH");
  }


  function EditOrderModal({ order, onClose, onUpdated }) {
    const [quantity, setQuantity] = useState(order.quantity);
    const [urgency, setUrgency] = useState(order.urgency);
    const [attributes, setAttributes] = useState(
      Object.entries(order.details || {}).map(([name, value]) => ({ name, value }))
    );
    const [newFile1, setNewFile1] = useState(null);
    const [newFile2, setNewFile2] = useState(null);
    const { showToast } = useToast();

    // Save updates
    const handleSave = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/edit/${order.enquiryNo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity, urgency, attributes }),
        });

        const data = await res.json();
        if (!data.success) return showToast(data.message || "Update failed");

        showToast("Order updated successfully!");
        await onUpdated(); 
        onClose();
      } catch (e) {
        showToast("Server error");
      }
    };

    // Replace File 1
    const handleFile1Upload = async () => {
      if (!newFile1) return;

      const formData = new FormData();
      formData.append("file1", newFile1);

      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/upload/single/${order.enquiryNo}`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!data.success) return showToast("Failed to upload file 1");

        showToast("File 1 replaced successfully");

        setNewFile1(null);
        await onUpdated(); 
        onClose();
      } catch (e) {
        showToast("Server error uploading file 1");
      }
    };


    // Replace File 2
    const handleFile2Upload = async () => {
      if (!newFile2) return;

      const formData = new FormData();
      formData.append("file2", newFile2);

      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/upload/double/${order.enquiryNo}`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!data.success) return showToast("Failed to upload file 2");

        showToast("File 2 replaced successfully");
        setNewFile2(null);
        onUpdated();
        onClose();
      } catch (e) {
        showToast("Server error uploading file 2");
      }
    };

        // Add new custom detail field
    const addAttribute = () => {
      setAttributes(prev => [...prev, { name: "", value: "" }]);
    };

    // Update a specific attribute
    const updateAttribute = (index, field, value) => {
      const updated = [...attributes];
      updated[index][field] = value;
      setAttributes(updated);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
        <motion.div
          className="
            bg-white rounded-2xl shadow-2xl 
            w-full max-w-2xl 
            max-h-[85vh] 
            flex flex-col
          "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Edit Order</h2>
            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="px-6 py-4 overflow-y-auto space-y-6 flex-1">

            {/* Quantity */}
            <div>
              <label className="font-semibold">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="font-semibold">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Custom Details */}
            <div>
              <label className="font-semibold">Custom Details</label>

              {attributes.map((attr, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <input
                    placeholder="Name"
                    value={attr.name}
                    onChange={(e) => updateAttribute(i, "name", e.target.value)}
                    className="border p-2 rounded w-1/2"
                  />
                  <input
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => updateAttribute(i, "value", e.target.value)}
                    className="border p-2 rounded w-1/2"
                  />
                </div>
              ))}

              <button
                onClick={addAttribute}
                className="mt-3 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
              >
                + Add Field
              </button>
            </div>

            {/* FILES SECTION */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Files</h3>

              {/* FILE 1 */}
              <div className="border rounded-lg p-4">
                <p className="font-semibold">File 1</p>

                {order.file1 ? (
                  <button
                    onClick={() => window.open(`http://localhost:5000${order.file1}`, "_blank")}
                    className="text-blue-600 underline hover:text-blue-800 mt-1"
                  >
                    View File 1
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">No File 1 uploaded</p>
                )}

                <input
                  type="file"
                  onChange={(e) => setNewFile1(e.target.files[0])}
                  className="mt-3 w-full border p-2 rounded-lg"
                />

                {newFile1 && (
                  <button
                    onClick={handleFile1Upload}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Upload File 1
                  </button>
                )}
              </div>

              {/* FILE 2 */}
              <div className="border rounded-lg p-4">
                <p className="font-semibold">File 2</p>

                {order.file2 ? (
                  <button
                    onClick={() => window.open(`http://localhost:5000${order.file2}`, "_blank")}
                    className="text-blue-600 underline hover:text-blue-800 mt-1"
                  >
                    View File 2
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">No File 2 uploaded</p>
                )}

                <input
                  type="file"
                  onChange={(e) => setNewFile2(e.target.files[0])}
                  className="mt-3 w-full border p-2 rounded-lg"
                />

                {newFile2 && (
                  <button
                    onClick={handleFile2Upload}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Upload File 2
                  </button>
                )}
              </div>
            </div>

            {order.price_history && order.price_history.length > 0 && (
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-lg">Price History</h3>

                {order.price_history.map((p, i) => (
                  <div key={i} className="border-b pb-2">
                    <p><strong>Previous:</strong> {formatPrice(p.old)}</p>
                    <p><strong>New:</strong> {formatPrice(p.new)}</p>
                    <p><strong>Added:</strong> {formatPrice(p.added)}</p>
                    <p className="text-xs text-gray-500">{p.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    );
  }



export default Transactions;
