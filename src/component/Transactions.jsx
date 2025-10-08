import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, Clock, Truck } from "lucide-react";

function Transactions() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userId = localStorage.getItem("user_id");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("isLoggedIn:", isLoggedIn);
  console.log("userId:", userId);

useEffect(() => {
  if (isLoggedIn && userId) {
    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => {
        console.log("API response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched orders in UI:", data);
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
}, [isLoggedIn, userId]);


  if (!isLoggedIn) return null;

  return (
    <section className="relative w-full px-6 py-30 bg-white text-gray-800">
      <motion.h2
        className="text-4xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Transactions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="md:col-span-2 rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col "
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-6">Project Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300">
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
                      key={item.enquiryNo}
                      className="transition-all hover:bg-gray-100 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-2 px-2 font-medium">{item.service}</td>
                      <td>{item.dateOrdered?.slice(0, 10)}</td>
                      <td className="font-semibold">{item.urgency}</td>
                      <td className="font-semibold flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {item.status}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg shadow transition">
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col "
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
