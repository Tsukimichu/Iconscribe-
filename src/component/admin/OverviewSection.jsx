import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "react-apexcharts";
import axios from "axios";

const OverviewSection = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderChartData, setOrderChartData] = useState({
    categories: [],
    data: [],
  });

  // Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Fetch product order counts for chart
  useEffect(() => {
    const fetchOrderChartData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/product-order-counts");
        setOrderChartData({
          categories: res.data.map((item) => item.product_name),
          data: res.data.map((item) => Number(item.total_orders)),
        });
      } catch (err) {
        console.error("Error fetching order chart data:", err);
      }
    };
    fetchOrderChartData();
  }, []);

  // Group orders by status for popup display
  const groupByStatus = (status) =>
    orders.filter((order) => order.status === status);

  // Count orders per status for dashboard cards
  const statusCounts = {
    Pending: groupByStatus("Pending").length,
    Ongoing: groupByStatus("Ongoing").length,
    "Out for Delivery": groupByStatus("Out for Delivery").length,
    Completed: groupByStatus("Completed").length,
  };

  const statusCards = [
    { label: "Pending", count: statusCounts["Pending"], color: "from-blue-600 to-cyan-400" },
    { label: "Ongoing", count: statusCounts["Ongoing"], color: "from-yellow-500 to-amber-400" },
    { label: "Out for Delivery", count: statusCounts["Out for Delivery"], color: "from-orange-500 to-red-400" },
    { label: "Completed", count: statusCounts["Completed"], color: "from-green-500 to-emerald-400" },
  ];

  // Chart Data (now dynamic)
  const orderData = {
    series: [
      { name: "Orders", data: orderChartData.data },
    ],
    options: {
      chart: { type: "area", stacked: false, toolbar: { show: false }, background: "transparent" },
      xaxis: { categories: orderChartData.categories },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      legend: { position: "top", horizontalAlign: "left" },
      fill: { opacity: 0.25, gradient: { shade: "light", type: "vertical" } },
      grid: { borderColor: "#e5e7eb" },
      colors: ["#6366f1"],
    },
  };

  const salesData = {
    series: [{ name: "Sales", data: [180, 140, 110, 90, 70] }],
    options: {
      chart: { type: "line", toolbar: { show: false }, background: "transparent" },
      xaxis: { categories: ["Official Receipt", "Calendar", "Yearbook", "Book", "Mug"] },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      colors: ["#22c55e"],
      markers: { size: 5, colors: ["#22c55e"], strokeColors: "#fff", strokeWidth: 2 },
      grid: { borderColor: "#e5e7eb" },
    },
  };

  const reportData = {
    series: [264.64, 230.12, 175.5, 90.2, 250.2],
    options: {
      chart: { type: "donut", background: "transparent" },
      labels: ["Official Receipt", "Calendar", "Book", "Mug", "Yearbook"],
      legend: { position: "bottom" },
      colors: ["#3b82f6", "#facc15", "#ef4444", "#10b981", "#a855f7"],
      plotOptions: { pie: { donut: { size: "70%" } } },
    },
  };

  const expenseData = {
    series: [
      { name: "Paper", data: [80, 95, 70, 85] },
      { name: "Ink", data: [60, 75, 65, 70] },
      { name: "Salary", data: [120, 110, 130, 125] },
      { name: "Misc", data: [30, 45, 25, 40] },
    ],
    options: {
      chart: { type: "bar", stacked: true, toolbar: { show: false }, background: "transparent" },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr"] },
      legend: { position: "bottom" },
      plotOptions: { bar: { borderRadius: 8 } },
      colors: ["#6366f1", "#f97316", "#10b981", "#f43f5e"],
      grid: { borderColor: "#e5e7eb" },
    },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 rounded-3xl bg-white shadow-xl space-y-8 text-gray-900 min-h-screen"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h1 className="text-4xl font-extrabold text-cyan-700">Dashboard</h1>
            <p className="text-gray-600 text-lg">Hello, Admin</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {statusCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(card.label)}
              className={`cursor-pointer flex flex-col justify-center items-center rounded-2xl px-5 py-6 text-center bg-gradient-to-br ${card.color} shadow-lg text-white min-h-[110px]`}
            >
              <p className="text-4xl font-extrabold">{card.count.toString().padStart(2, "0")}</p>
              <p className="text-sm font-medium tracking-wide">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Orders & Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">📦 Total Orders</h2>
            <Chart options={orderData.options} series={orderData.series} type="area" height={260} />
          </motion.div>
          <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">💰 Total Sales</h2>
            <Chart options={salesData.options} series={salesData.series} type="line" height={260} />
          </motion.div>
        </div>

        {/* Reports & Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📊 Reports</h2>
            <Chart options={reportData.options} series={reportData.series} type="donut" height={300} />
          </motion.div>
          <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">💸 Expenses</h2>
            <Chart options={expenseData.options} series={expenseData.series} type="bar" height={300} />
          </motion.div>
        </div>
      </motion.div>

      {/* Orders Popup (Dynamic from Database) */}
      <AnimatePresence>
        {activeFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full space-y-6"
            >
              <h2 className="text-2xl font-bold text-[#243b7d]">{activeFilter} Orders</h2>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th className="p-3 text-left">Order ID</th>
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-600">
                    {groupByStatus(activeFilter).map((order, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3 font-medium">{order.order_id}</td>
                        <td className="p-3">{order.customer_name}</td>
                        <td className="p-3">{order.product_name}</td>
                        <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-3">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveFilter(null)}
                  className="px-5 py-2 rounded-xl bg-[#243b7d] text-white font-semibold hover:bg-[#1e2f66] transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OverviewSection;
