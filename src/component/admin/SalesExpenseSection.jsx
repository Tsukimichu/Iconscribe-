import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "react-apexcharts";
import { TrendingUp, TrendingDown, X } from "lucide-react";

const SalesExpenseSection = () => {
  const [activeDetail, setActiveDetail] = useState(null);

  const summaryCards = [
    {
      key: "sales",
      label: "Total Sales",
      value: "₱25,000",
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <TrendingUp className="text-green-600" size={28} />,
    },
    {
      key: "expense",
      label: "Total Expense",
      value: "₱15,000",
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <TrendingDown className="text-red-600" size={28} />,
    },
    {
      key: "profit",
      label: "Net Profit",
      value: "₱10,000",
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-extrabold text-lg">₱</span>
        </div>
      ),
    },
  ];

  // Charts
  const salesChart = {
    series: [{ name: "Sales", data: [5000, 7000, 8000, 5000] }],
    options: {
      chart: { type: "area", toolbar: { show: false } },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr"] },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#10b981"],
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    },
  };

  const expenseChart = {
    series: [{ name: "Expenses", data: [3000, 4000, 5000, 3000] }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr"] },
      colors: ["#ef4444"],
      plotOptions: { bar: { borderRadius: 8, columnWidth: "45%" } },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    },
  };

  const profitChart = {
    series: [{ name: "Net Profit", data: [2000, 3000, 2500, 5000] }],
    options: {
      chart: { type: "line", toolbar: { show: false } },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr"] },
      stroke: { curve: "smooth", width: 3 },
      markers: {
        size: 6,
        colors: ["#fff"],
        strokeColors: "#3b82f6",
        strokeWidth: 2,
      },
      colors: ["#3b82f6"],
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    },
  };

  // Fake Data
  const salesData = [
    { date: "2025-01-10", customer: "John Doe", amount: "₱5,000" },
    { date: "2025-01-15", customer: "Jane Smith", amount: "₱7,000" },
    { date: "2025-02-05", customer: "Michael Lee", amount: "₱8,000" },
  ];
  const expenseData = [
    { date: "2025-01-08", category: "Rent", amount: "₱3,000" },
    { date: "2025-01-20", category: "Supplies", amount: "₱4,000" },
    { date: "2025-02-10", category: "Utilities", amount: "₱5,000" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-6 rounded-3xl bg-white space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-4xl font-extrabold text-[#243b7d]">
              Sales & Expenses
            </h1>
            <p className="text-gray-600 text-lg">
              Financial performance overview
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <motion.div
              key={card.key}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveDetail(card.key)}
              transition={{ type: "spring", stiffness: 300 }}
              className={`cursor-pointer rounded-2xl px-6 py-6 text-center flex flex-col justify-center items-center ${card.bg}`}
            >
              <div className="mb-3">{card.icon}</div>
              <p className={`text-3xl font-bold mb-1 ${card.text}`}>
                {card.value}
              </p>
              <p className="text-sm font-medium text-gray-700">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Monthly Sales
            </h2>
            <Chart
              options={salesChart.options}
              series={salesChart.series}
              type="area"
              height={280}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Monthly Expenses
            </h2>
            <Chart
              options={expenseChart.options}
              series={expenseChart.series}
              type="bar"
              height={280}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Net Profit Trend
            </h2>
            <Chart
              options={profitChart.options}
              series={profitChart.series}
              type="line"
              height={280}
            />
          </div>
        </div>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {activeDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDetail(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>

              {activeDetail === "sales" && (
                <>
                  <h2 className="text-2xl font-bold text-green-700 mb-4">
                    Sales Details
                  </h2>
                  <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Customer</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((sale, i) => (
                        <tr key={i} className="border-t hover:bg-green-50">
                          <td className="px-4 py-2">{sale.date}</td>
                          <td className="px-4 py-2">{sale.customer}</td>
                          <td className="px-4 py-2 font-semibold text-green-700">
                            {sale.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {activeDetail === "expense" && (
                <>
                  <h2 className="text-2xl font-bold text-red-700 mb-4">
                    Expense Details
                  </h2>
                  <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseData.map((exp, i) => (
                        <tr key={i} className="border-t hover:bg-red-50">
                          <td className="px-4 py-2">{exp.date}</td>
                          <td className="px-4 py-2">{exp.category}</td>
                          <td className="px-4 py-2 font-semibold text-red-700">
                            {exp.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesExpenseSection;
