import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, Trash2, Eye, CheckCircle, Clock, Truck } from "lucide-react";

const mockData = [
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "Minor",
    urgencyColor: "text-green-400",
    status: "In review",
    statusColor: "text-blue-400",
    actions: ["call", "view"]
  },
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "Moderate",
    urgencyColor: "text-yellow-400",
    status: "Ongoing",
    statusColor: "text-purple-400",
    actions: ["call", "view"]
  },
  {
    service: "Book",
    date: "04/11/2025",
    urgency: "Moderate",
    urgencyColor: "text-yellow-400",
    status: "Pending",
    statusColor: "text-gray-400",
    actions: ["call", "view"]
  },
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "--",
    urgencyColor: "text-gray-400",
    status: "Completed",
    statusColor: "text-green-500",
    actions: ["delete", "view"]
  },
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "Critical",
    urgencyColor: "text-red-500",
    status: "Out for Delivery",
    statusColor: "text-yellow-500",
    actions: ["call", "received"]
  }
];

function Transactions() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 md:px-20 py-16">
      {/* Heading */}
      <motion.h2
        className="text-4xl font-extrabold text-center mb-12 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Transactions
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Project Summary */}
        <motion.div
          className="md:col-span-2 rounded-2xl backdrop-blur-xl bg-white/10 shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-white">
            Project Summary
          </h3>
          <table className="w-full text-sm md:text-base text-white">
            <thead>
              <tr className="text-left text-gray-300 border-b border-white/10">
                <th className="py-3">Service</th>
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
                  className="transition-all hover:scale-[1.01] hover:bg-white/10 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-3 px-2 font-medium">{item.service}</td>
                  <td>{item.date}</td>
                  <td className={`${item.urgencyColor} font-semibold`}>{item.urgency}</td>
                  <td className={`${item.statusColor} font-semibold flex items-center gap-2`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {item.actions.includes("call") && (
                        <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-sm transition">
                          <PhoneCall size={16} />
                        </button>
                      )}
                      {item.actions.includes("view") && (
                        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg shadow-sm transition">
                          <Eye size={14} className="mr-1" />
                          View
                        </button>
                      )}
                      {item.actions.includes("delete") && (
                        <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition">
                          <Trash2 size={16} />
                        </button>
                      )}
                      {item.actions.includes("received") && (
                        <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded-lg shadow-sm transition">
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
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="rounded-2xl backdrop-blur-xl bg-white/10 shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-white">
            Notifications
          </h3>
          <ul className="space-y-3 text-sm text-white">
            <li className="flex justify-between bg-white/10 px-4 py-2 rounded-lg">Official Receipts <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/10 px-4 py-2 rounded-lg">Book <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/10 px-4 py-2 rounded-lg">Service Approved <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/10 px-4 py-2 rounded-lg">Completed <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/10 px-4 py-2 rounded-lg">Out for Delivery <span>04/11/2025</span></li>
            <li className="flex justify-between bg-white/10 px-4 py-2 rounded-lg">Book <span>04/11/2025</span></li>
          </ul>
        </motion.div>
      </div>
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
