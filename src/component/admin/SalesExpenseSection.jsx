import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "react-apexcharts";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../api";

const SalesExpenseSection = () => {
  const [activeDetail, setActiveDetail] = useState(null);

  const [sales, setSales] = useState([]);
  const [supplies, setSupplies] = useState([]);

  // =======================================================
  // LOAD SALES & EXPENSES (SUPPLIES)
  // =======================================================
  useEffect(() => {
    loadSales();
    loadSupplies();
  }, []);

  const loadSales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sales`);
      if (res.data.success) setSales(res.data.data);
    } catch (err) {
      console.error("Sales fetch error:", err);
    }
  };

  const loadSupplies = async () => {
    try {
      const res = await axios.get(`${API_URL}/supplies`);
      if (Array.isArray(res.data)) setSupplies(res.data);
    } catch (err) {
      console.error("Supplies fetch error:", err);
    }
  };

  // =======================================================
  // COMPUTED TOTALS
  // =======================================================
  const totalSales = useMemo(() => {
    return sales.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  }, [sales]);

  const totalExpenses = useMemo(() => {
    return supplies.reduce((sum, s) => sum + Number(s.price || 0), 0);
  }, [supplies]);

  const netProfit = totalSales - totalExpenses;

  // =======================================================
  // MONTHLY CHARTS
  // =======================================================
  const monthlySales = {};
  const monthlyExpenses = {};

  sales.forEach((s) => {
    const month = new Date(s.date).toLocaleString("default", { month: "short" });
    monthlySales[month] = (monthlySales[month] || 0) + Number(s.amount || 0);
  });

  supplies.forEach((s) => {
    const month = new Date(s.created_at).toLocaleString("default", { month: "short" });
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + Number(s.price || 0);
  });

  const months = [...new Set([...Object.keys(monthlySales), ...Object.keys(monthlyExpenses)])];

  // CHART CONFIG
  const salesChart = {
    series: [{ name: "Sales", data: months.map((m) => monthlySales[m] || 0) }],
    options: {
      chart: { type: "area", toolbar: { show: false } },
      xaxis: { categories: months },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#10b981"],
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    },
  };

  const expenseChart = {
    series: [{ name: "Expenses", data: months.map((m) => monthlyExpenses[m] || 0) }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: months },
      colors: ["#ef4444"],
      plotOptions: { bar: { borderRadius: 8, columnWidth: "45%" } },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    },
  };

  const profitChart = {
    series: [{ name: "Net Profit", data: months.map((m) => (monthlySales[m] || 0) - (monthlyExpenses[m] || 0)) }],
    options: {
      chart: { type: "line", toolbar: { show: false } },
      xaxis: { categories: months },
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

  // =======================================================
  // SUMMARY CARDS
  // =======================================================
  const summaryCards = [
    {
      key: "sales",
      label: "Total Sales",
      value: `₱${totalSales.toLocaleString()}`,
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <TrendingUp className="text-green-600" size={28} />,
    },
    {
      key: "expense",
      label: "Total Expense",
      value: `₱${totalExpenses.toLocaleString()}`,
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <TrendingDown className="text-red-600" size={28} />,
    },
    {
      key: "profit",
      label: "Net Profit",
      value: `₱${netProfit.toLocaleString()}`,
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-extrabold text-lg">₱</span>
        </div>
      ),
    },
  ];

  // =======================================================
  // POPUP DATA
  // =======================================================

  const salesDetails = sales.map((s) => ({
    date: new Date(s.date).toLocaleDateString(),
    customer: s.item,
    amount: `₱${Number(s.amount).toLocaleString()}`,
  }));

  const expenseDetails = supplies.map((s) => ({
    date: s.created_at ? new Date(s.created_at).toLocaleDateString() : "—",
    category: s.category,
    name: s.supply_name,
    amount: `₱${Number(s.price).toLocaleString()}`,
  }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-6 rounded-3xl bg-white space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-cyan-700">Sales & Expenses</h1>
        <p className="text-gray-600 text-lg">Financial performance overview</p>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <motion.div
              key={card.key}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveDetail(card.key)}
              transition={{ type: "spring", stiffness: 250 }}
              className={`cursor-pointer rounded-2xl px-6 py-6 text-center ${card.bg} shadow-sm`}
            >
              <div className="mb-3">{card.icon}</div>
              <p className={`text-3xl font-bold mb-1 ${card.text}`}>{card.value}</p>
              <p className="text-sm font-medium text-gray-700">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Monthly Sales</h2>
            <Chart {...salesChart} height={280} />
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Monthly Expenses</h2>
            <Chart {...expenseChart} height={280} />
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Profit</h2>
            <Chart {...profitChart} height={280} />
          </div>
        </div>
      </motion.div>

      {/* POPUP */}
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
              className="bg-white rounded-2xl p-6 w-full max-w-2xl relative"
            >
              <button
                onClick={() => setActiveDetail(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>

              {/* SALES */}
              {activeDetail === "sales" && (
                <>
                  <h2 className="text-2xl font-bold text-green-700 mb-4">Sales Details</h2>
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesDetails.map((s, i) => (
                        <tr key={i} className="border-t hover:bg-green-50">
                          <td className="px-4 py-2">{s.date}</td>
                          <td className="px-4 py-2">{s.customer}</td>
                          <td className="px-4 py-2 font-semibold text-green-700">{s.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* EXPENSES */}
              {activeDetail === "expense" && (
                <>
                  <h2 className="text-2xl font-bold text-red-700 mb-4">Expense Details</h2>
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseDetails.map((e, i) => (
                        <tr key={i} className="border-t hover:bg-red-50">
                          <td className="px-4 py-2">{e.date}</td>
                          <td className="px-4 py-2">{e.name}</td>
                          <td className="px-4 py-2">{e.category}</td>
                          <td className="px-4 py-2 font-semibold text-red-700">{e.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* PROFIT */}
              {activeDetail === "profit" && (
                <>
                  <h2 className="text-2xl font-bold text-blue-700 mb-4">Profit Breakdown</h2>
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="px-4 py-2">Month</th>
                        <th className="px-4 py-2">Sales</th>
                        <th className="px-4 py-2">Expenses</th>
                        <th className="px-4 py-2">Net Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months.map((m, i) => (
                        <tr key={i} className="border-t hover:bg-blue-50">
                          <td className="px-4 py-2">{m}</td>
                          <td className="px-4 py-2">₱{(monthlySales[m] || 0).toLocaleString()}</td>
                          <td className="px-4 py-2">₱{(monthlyExpenses[m] || 0).toLocaleString()}</td>
                          <td className="px-4 py-2 font-semibold text-blue-700">
                            ₱{((monthlySales[m] || 0) - (monthlyExpenses[m] || 0)).toLocaleString()}
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
