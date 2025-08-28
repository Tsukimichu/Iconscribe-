import React, { useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

const OverviewSection = () => {
  const [activeFilter, setActiveFilter] = useState(null);

  const statusCards = [
    { label: "In Review", count: 6, color: "from-blue-500 to-cyan-400" },
    { label: "Ongoing", count: 1, color: "from-purple-500 to-pink-400" },
    { label: "Pending", count: 1, color: "from-yellow-500 to-amber-400" },
    { label: "Out for Delivery", count: 1, color: "from-orange-500 to-red-400" },
    { label: "Completed", count: 7, color: "from-green-500 to-emerald-400" },
  ];

  // Orders chart
  const orderData = {
    series: [
      { name: "Jan", data: [120, 90, 70, 50, 30] },
      { name: "Feb", data: [100, 80, 60, 40, 25] },
      { name: "Mar", data: [140, 110, 90, 60, 45] },
      { name: "Apr", data: [160, 130, 100, 80, 55] },
    ],
    options: {
      chart: {
        type: "area",
        stacked: false,
        toolbar: { show: false },
        animations: { enabled: true, speed: 700 },
        background: "transparent",
        foreColor: "#cbd5e1",
      },
      theme: { mode: "dark" },
      xaxis: { categories: ["Official Receipt", "Calendar", "Yearbook", "Book", "Mug"] },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      legend: { position: "top", horizontalAlign: "left" },
      fill: { opacity: 0.25, gradient: { shade: "dark", type: "vertical" } },
      grid: { borderColor: "rgba(255,255,255,0.1)" },
      colors: ["#6366f1", "#f97316", "#10b981", "#22d3ee"],
      tooltip: { theme: "dark" },
    },
  };

  // Sales chart
  const salesData = {
    series: [{ name: "Sales", data: [180, 140, 110, 90, 70] }],
    options: {
      chart: { 
        type: "line", 
        toolbar: { show: false }, 
        animations: { enabled: true }, 
        background: "transparent",
        foreColor: "#cbd5e1",
      },
      theme: { mode: "dark" },
      xaxis: { categories: ["Official Receipt", "Calendar", "Yearbook", "Book", "Mug"] },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      colors: ["#22c55e"],
      markers: { size: 5, colors: ["#22c55e"], strokeColors: "#1e293b", strokeWidth: 2 },
      grid: { borderColor: "rgba(255,255,255,0.1)" },
      tooltip: { theme: "dark" },
    },
  };

  // Report chart
  const reportData = {
    series: [264.64, 230.12, 175.5, 90.2, 250.2],
    options: {
      chart: { type: "donut", background: "transparent", foreColor: "#cbd5e1" },
      theme: { mode: "dark" },
      labels: ["Official Receipt", "Calendar", "Book", "Mug", "Yearbook"],
      legend: { position: "bottom", labels: { colors: "#cbd5e1" } },
      colors: ["#3b82f6", "#facc15", "#ef4444", "#10b981", "#a855f7"],
      plotOptions: { pie: { donut: { size: "70%" } } },
      tooltip: { theme: "dark" },
    },
  };

  // Expense chart
  const expenseData = {
    series: [
      { name: "Paper", data: [80, 95, 70, 85] },
      { name: "Ink", data: [60, 75, 65, 70] },
      { name: "Salary", data: [120, 110, 130, 125] },
      { name: "Misc", data: [30, 45, 25, 40] },
    ],
    options: {
      chart: { type: "bar", stacked: true, toolbar: { show: false }, background: "transparent", foreColor: "#cbd5e1" },
      theme: { mode: "dark" },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr"], labels: { style: { colors: "#cbd5e1" } } },
      legend: { position: "bottom", labels: { colors: "#cbd5e1" } },
      plotOptions: { bar: { borderRadius: 8 } },
      colors: ["#6366f1", "#f97316", "#10b981", "#f43f5e"],
      grid: { borderColor: "rgba(255,255,255,0.1)" },
      tooltip: { theme: "dark" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] shadow-2xl space-y-8 text-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
            Overview
          </h1>
          <p className="text-gray-400 text-lg">Hello, Manager 🚀</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {statusCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveFilter(card.label)}
            className={`cursor-pointer rounded-2xl px-5 py-6 text-center bg-gradient-to-br ${card.color} shadow-xl relative overflow-hidden`}
          >
            <p className="text-4xl font-extrabold">{card.count.toString().padStart(2, "0")}</p>
            <p className="text-sm font-medium tracking-wide">{card.label}</p>
            {activeFilter === card.label && (
              <motion.div
                layoutId="activeCard"
                className="absolute inset-0 rounded-2xl border-4 border-white/50"
                transition={{ type: "spring", stiffness: 250 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Orders & Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1e293b]/80 p-6 rounded-2xl shadow-lg border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-3">📦 Total Orders</h2>
          <Chart options={orderData.options} series={orderData.series} type="area" height={260} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#1e293b]/80 p-6 rounded-2xl shadow-lg border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-3">💰 Total Sales</h2>
          <Chart options={salesData.options} series={salesData.series} type="line" height={260} />
        </motion.div>
      </div>

      {/* Reports & Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#1e293b]/80 p-6 rounded-2xl shadow-lg border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-2">📊 Reports</h2>
          <Chart options={reportData.options} series={reportData.series} type="donut" height={300} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#1e293b]/80 p-6 rounded-2xl shadow-lg border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-2">💸 Expenses</h2>
          <Chart options={expenseData.options} series={expenseData.series} type="bar" height={300} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewSection;
