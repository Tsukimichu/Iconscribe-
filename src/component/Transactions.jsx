import React from "react";
import { PhoneCall, Trash2, Eye, CheckCircle, Clock, Truck } from "lucide-react";

const mockData = [
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "Minor",
    urgencyColor: "text-green-500",
    status: "In review",
    statusColor: "text-blue-500",
    bg: "bg-gray-100",
    actions: ["call", "view"]
  },
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "Moderate",
    urgencyColor: "text-orange-500",
    status: "Ongoing",
    statusColor: "text-purple-500",
    bg: "bg-gray-100",
    actions: ["call", "view"]
  },
  {
    service: "Book",
    date: "04/11/2025",
    urgency: "Moderate",
    urgencyColor: "text-orange-500",
    status: "Pending",
    statusColor: "text-gray-500",
    bg: "bg-rose-200",
    actions: ["call", "view"]
  },
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "--",
    urgencyColor: "text-gray-400",
    status: "Completed",
    statusColor: "text-green-600",
    bg: "bg-green-200",
    actions: ["delete", "view"]
  },
  {
    service: "Official Receipts",
    date: "04/11/2025",
    urgency: "Critical",
    urgencyColor: "text-red-600",
    status: "Out for Delivery",
    statusColor: "text-yellow-600",
    bg: "bg-yellow-200",
    actions: ["call", "received"]
  }
];

function Transactions() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) return null;

  return (
    <div className="w-full bg-gradient-to-br from-[#d5e0f5] to-[#b3c7e6] py-16 px-4 md:px-20 rounded-t-3xl shadow-inner">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#243b7d]">Transactions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Summary */}
        <div className="md:col-span-2 bg-[#f7f9fc] rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-[#243b7d]">Project Summary</h3>
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Service</th>
                <th>Date Ordered</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item, index) => (
                <tr
                  key={index}
                  className={`${item.bg} rounded-lg overflow-hidden my-1`}
                >
                  <td className="py-3 px-2">{item.service}</td>
                  <td>{item.date}</td>
                  <td className={`${item.urgencyColor} font-medium`}>
                    {item.urgency}
                  </td>
                  <td className={`${item.statusColor} font-medium flex items-center gap-2`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {item.actions.includes("call") && (
                        <button className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-full">
                          <PhoneCall size={16} />
                        </button>
                      )}
                      {item.actions.includes("view") && (
                        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-lg">
                          <Eye size={14} className="mr-1" />
                          View Details
                        </button>
                      )}
                      {item.actions.includes("delete") && (
                        <button className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full">
                          <Trash2 size={16} />
                        </button>
                      )}
                      {item.actions.includes("received") && (
                        <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded-lg">
                          <CheckCircle size={14} className="mr-1" />
                          Received
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="bg-[#f7f9fc] rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-[#243b7d]">Notifications</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between bg-gray-100 px-3 py-2 rounded-md">Official Receipts <span>04/11/2025</span></li>
            <li className="flex justify-between bg-rose-200 px-3 py-2 rounded-md">Book <span>04/11/2025</span></li>
            <li className="flex justify-between bg-gray-100 px-3 py-2 rounded-md">Service Approved <span>04/11/2025</span></li>
            <li className="flex justify-between bg-green-200 px-3 py-2 rounded-md">Completed <span>04/11/2025</span></li>
            <li className="flex justify-between bg-yellow-200 px-3 py-2 rounded-md">Out for Delivery <span>04/11/2025</span></li>
            <li className="flex justify-between bg-gray-100 px-3 py-2 rounded-md">Book <span>04/11/2025</span></li>
          </ul>
        </div>
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
