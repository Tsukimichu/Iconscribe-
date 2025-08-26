import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, Trash2, Eye, CheckCircle, Clock, Truck } from "lucide-react";

const mockData = [
  { service: "Official Receipts", date: "04/11/2025", urgency: "Minor", urgencyColor: "text-green-600", status: "In review", statusColor: "text-blue-600", actions: ["call", "view"] },
  { service: "Official Receipts", date: "04/11/2025", urgency: "Moderate", urgencyColor: "text-yellow-500", status: "Ongoing", statusColor: "text-purple-600", actions: ["call", "view"] },
  { service: "Book", date: "04/11/2025", urgency: "Moderate", urgencyColor: "text-yellow-500", status: "Pending", statusColor: "text-gray-500", actions: ["call", "view"] },
  { service: "Official Receipts", date: "04/11/2025", urgency: "--", urgencyColor: "text-gray-400", status: "Completed", statusColor: "text-green-700", actions: ["delete", "view"] },
  { service: "Official Receipts", date: "04/11/2025", urgency: "Critical", urgencyColor: "text-red-600", status: "Out for Delivery", statusColor: "text-yellow-700", actions: ["call", "received"] }
];

function Transactions() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) return null;

  return (
    <section className="relative w-full px-6 py-10 bg-white text-gray-800">
      <motion.h2
        className="text-4xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Transactions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="md:col-span-2 rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col transition-all hover:shadow-xl hover:scale-[1.02]"
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
                {mockData.map((item, index) => (
                  <motion.tr
                    key={index}
                    className="transition-all hover:bg-gray-100 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="py-2 px-2 font-medium">{item.service}</td>
                    <td>{item.date}</td>
                    <td className={`${item.urgencyColor} font-semibold`}>{item.urgency}</td>
                    <td className={`${item.statusColor} font-semibold flex items-center gap-2`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {item.actions.includes("call") && (
                          <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow transition">
                            <PhoneCall size={16} />
                          </button>
                        )}
                        {item.actions.includes("view") && (
                          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg shadow transition">
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                        )}
                        {item.actions.includes("delete") && (
                          <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition">
                            <Trash2 size={16} />
                          </button>
                        )}
                        {item.actions.includes("received") && (
                          <button className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded-lg shadow transition">
                            <CheckCircle size={14} className="mr-1" />
                            Received
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl backdrop-blur-xl bg-white/50 shadow-lg border border-gray-200 p-6 flex flex-col transition-all hover:shadow-xl hover:scale-[1.02]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-6">Notifications</h3>
          <ul className="space-y-3 text-sm flex-1">
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">Official Receipts <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">Book <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">Service Approved <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">Completed <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/40 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">Out for Delivery <span>04/11/2025</span></li>
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
