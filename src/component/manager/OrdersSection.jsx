import React from "react";
import { motion } from "framer-motion";
import { Archive, Trash2, Search } from "lucide-react";

const orders = [
  {
    enquiryNo: "001",
    service: "Official Receipts",
    name: "Aldrin Portento",
    dateOrdered: "04/11/2025",
    urgency: { label: "Minor", color: "bg-green-100 text-green-700" },
    status: { label: "In review", color: "bg-blue-100 text-blue-700" },
  },
  {
    enquiryNo: "002",
    service: "Official Receipts",
    name: "Dave Geroleo",
    dateOrdered: "04/11/2025",
    urgency: { label: "Moderate", color: "bg-yellow-100 text-yellow-700" },
    status: { label: "Ongoing", color: "bg-purple-100 text-purple-700" },
  },
  {
    enquiryNo: "003",
    service: "Books",
    name: "Carl Madrigal",
    dateOrdered: "04/11/2025",
    urgency: { label: "Moderate", color: "bg-yellow-100 text-yellow-700" },
    status: { label: "Pending", color: "bg-orange-100 text-orange-700" },
  },
  {
    enquiryNo: "004",
    service: "Official Receipts",
    name: "Mark Matining",
    dateOrdered: "04/11/2025",
    urgency: { label: "--", color: "bg-gray-100 text-gray-500" },
    status: { label: "Completed", color: "bg-green-200 text-green-800" },
  },
  {
    enquiryNo: "005",
    service: "Official Receipts",
    name: "John Portento",
    dateOrdered: "04/11/2025",
    urgency: { label: "Critical", color: "bg-red-100 text-red-700" },
    status: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-700" },
  },
  {
    enquiryNo: "006",
    service: "Yearbook",
    name: "James Palma",
    dateOrdered: "04/11/2025",
    urgency: { label: "--", color: "bg-gray-100 text-gray-500" },
    status: { label: "Completed", color: "bg-green-200 text-green-800" },
  },
];

const OrdersSection = () => {
  const handleArchive = (id) => {
    console.log(`Archived order ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleted order ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-700">Enquiry No.</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Service</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Date Ordered</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Urgency</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{order.enquiryNo}</td>
                <td className="py-3 px-6">{order.service}</td>
                <td className="py-3 px-6">{order.name}</td>
                <td className="py-3 px-6">{order.dateOrdered}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${order.urgency.color}`}
                  >
                    {order.urgency.label}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${order.status.color}`}
                  >
                    {order.status.label}
                  </span>
                </td>
                <td className="py-3 px-6 flex justify-end gap-2">
                  <button
                    onClick={() => handleArchive(order.enquiryNo)}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Archive size={16} /> Archive
                  </button>
                  <button
                    onClick={() => handleDelete(order.enquiryNo)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default OrdersSection;
