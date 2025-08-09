import React from "react";
import { motion } from "framer-motion";
import { Plus, FileText, List, Edit, Trash2 } from "lucide-react";

const expenses = [
  { name: "OR Paper", category: "Paper", date: "04/11/2025", quantity: 20, amount: "₱5,000" },
  { name: "Red Ink", category: "Ink", date: "04/12/2025", quantity: 10, amount: "₱2,500" },
  { name: "Gasoline", category: "Gas", date: "04/12/2025", quantity: 6, amount: "₱800" },
  { name: "Mug", category: "Misc.", date: "04/12/2025", quantity: 30, amount: "₱2,000" },
];

const sales = [
  { name: "Official Receipt", date: "04/11/2025", quantity: 30 },
  { name: "Calendar", date: "04/12/2025", quantity: 60 },
];

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const ActionButton = ({ icon: Icon, label }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-medium transition"
  >
    <Icon size={14} /> {label}
  </motion.button>
);

const SalesAndExpenseSection = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 p-6"
    >
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight"
      >
        Sales & Expense
      </motion.h1>

      {/* Expenses Table */}
      <motion.div
        variants={tableVariants}
        className="overflow-x-auto rounded-lg shadow mb-8"
      >
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
          <div className="flex gap-2">
            <ActionButton icon={Plus} label="Add" />
            <ActionButton icon={FileText} label="Report" />
            <ActionButton icon={List} label="Sort" />
          </div>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Category</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Date</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">Quantity</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <motion.tbody initial="hidden" animate="visible">
            {expenses.map((item, i) => (
              <motion.tr
                key={i}
                custom={i}
                variants={rowVariants}
                className={`border-t border-gray-200 hover:bg-gray-50 transition ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-right font-semibold">{item.amount}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>

      {/* Sales Table */}
      <motion.div
        variants={tableVariants}
        className="overflow-x-auto rounded-lg shadow"
      >
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Sales</h2>
          <div className="flex gap-2">
            <ActionButton icon={Plus} label="Add" />
            <ActionButton icon={FileText} label="Report" />
            <ActionButton icon={List} label="Sort" />
          </div>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">Quantity</th>
            </tr>
          </thead>
          <motion.tbody initial="hidden" animate="visible">
            {sales.map((item, i) => (
              <motion.tr
                key={i}
                custom={i}
                variants={rowVariants}
                className={`border-t border-gray-200 hover:bg-gray-50 transition ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4 flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Edit size={14} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full">
                    <Trash2 size={14} />
                  </motion.button>
                </td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default SalesAndExpenseSection;
