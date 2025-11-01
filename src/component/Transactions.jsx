import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Eye, CheckCircle, Clock, Truck, X } from "lucide-react";

function Transactions() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;


  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  function handleImagePreview(image) {
    setPreviewImage(image);
    setShowImageModal(true);
  }


  const [selectedOrder, setSelectedOrder] = useState(null);

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
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, userId]);

  if (!isLoggedIn) return null;

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300 sticky top-0 bg-white">
                  <th className="py-2">Service</th>
                  <th>Date Ordered</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      className="transition-all hover:bg-gray-100 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-2 px-2 font-medium">{item.service || item.product_name}</td>
                      <td>{item.dateOrdered?.slice(0, 10) || item.created_at?.slice(0, 10)}</td>
                      <td className="font-semibold">{item.urgency}</td>
                      <td className="font-semibold flex items-center gap-2">
                        <span
                          className={`cursor-pointer ${item.image ? "opacity-90 hover:opacity-100" : ""}`}
                          onClick={() => item.image && handleImagePreview(item.image)}
                          title={item.image ? "Preview image" : "No image"}
                        >
                          {getStatusIcon(item.status)}
                        </span>
                        {item.status}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(item)} // 👈 Opens modal
                          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg shadow transition"
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
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
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
              Official Receipts <span>04/11/2025</span>
            </li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
              Book <span>04/11/2025</span>
            </li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
              Service Approved <span>04/11/2025</span>
            </li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
              Completed <span>04/11/2025</span>
            </li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
              Out for Delivery <span>04/11/2025</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Order View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Order Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
              <p>
                <strong>Status:</strong>{" "}
                <span className="inline-flex items-center gap-2">
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </p>

            <div className="space-y-3 text-gray-700">
              <p><strong>Service:</strong> {selectedOrder.service || selectedOrder.product_name}</p>
              <p><strong>Date Ordered:</strong> {selectedOrder.dateOrdered?.slice(0,10) || selectedOrder.created_at?.slice(0,10)}</p>
              <p><strong>Urgency:</strong> {selectedOrder.urgency}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>

              {/* Custom Details */}
              {selectedOrder.custom_details && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Custom Details</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {(() => {
                      let details;

                      // Try to parse JSON if it's a string
                      try {
                        details =
                          typeof selectedOrder.custom_details === "string"
                            ? JSON.parse(selectedOrder.custom_details)
                            : selectedOrder.custom_details;
                      } catch {
                        // Fallback if parsing fails
                        details = { Info: selectedOrder.custom_details };
                      }

                      // Render details properly
                      return Object.entries(details).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </p>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Uploaded Files */}
              {selectedOrder.details && Object.keys(selectedOrder.details).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Order Details</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {Object.entries(selectedOrder.details).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {showImageModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-[90%] max-h-[85vh] rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="absolute top-6 right-6 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
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
