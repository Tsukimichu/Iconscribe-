import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { API_URL } from "../../api.js";

const SalesAndExpenseSection = () => {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // =====================================================
  // Fetch sales data from backend
  // =====================================================
  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sales`);
      if (res.data.success) setSales(res.data.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

// =====================================================
// Fetch supplies as expenses
// =====================================================
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/supplies`);
      if (Array.isArray(res.data)) {
        const mapped = res.data.map((s) => ({
          id: s.supply_id,
          supply_name: s.supply_name,
          quantity: s.quantity,
          unit: s.unit,
          price: s.price,
          date: s.created_at || new Date().toISOString(),
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error("Error fetching supplies as expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);


  // =====================================================
  // Computed totals
  // =====================================================
  const totalSales = useMemo(() => sales.reduce((sum, s) => sum + Number(s.amount), 0), [sales]);
  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, e) => sum + ((Number(e.quantity) || 0) * (Number(e.price) || 0)), 0),
    [expenses]
  ); 
  const profit = totalSales - totalExpenses;

  // =====================================================
  // Filter + Sort
  // =====================================================
  const filterAndSort = (data) => {
    let filtered = data.filter((r) => {
      const name = (r.item || r.supply_name || "").toLowerCase();
      return name.includes(search.toLowerCase()) || (r.date || "").includes(search);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "amount") {
        const aAmount = a.amount ?? (a.quantity && a.price ? a.quantity * a.price : 0);
        const bAmount = b.amount ?? (b.quantity && b.price ? b.quantity * b.price : 0);
        return bAmount - aAmount;
      }
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      return (a.item || a.supply_name || "").localeCompare(b.item || b.supply_name || "");
    });
  };

  const filteredSales = useMemo(() => filterAndSort(sales), [sales, search, sortBy]);
  const filteredExpenses = useMemo(() => filterAndSort(expenses), [expenses, search, sortBy]);

  // Group and sum amounts by month
  const monthlyData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const salesByMonth = Array(12).fill(0);
    const expensesByMonth = Array(12).fill(0);

    sales.forEach((s) => {
      const month = new Date(s.date).getMonth();
      salesByMonth[month] += Number(s.amount) || 0;
    });

    expenses.forEach((e) => {
      const month = new Date(e.date).getMonth();
      // calculate total expense per record
      const totalExpense = (Number(e.quantity) || 0) * (Number(e.price) || 0);
      expensesByMonth[month] += totalExpense;
    });

    return { months, salesByMonth, expensesByMonth };
  }, [sales, expenses]);


  const chartOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "45%", endingShape: "rounded" },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: monthlyData.months },
    yaxis: { title: { text: "Amount (₱)" } },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `₱${val.toLocaleString()}` },
    },
    colors: ["#00BFFF", "#FF6347"],
    legend: { position: "top" },
  }), [monthlyData]);

  const chartSeries = useMemo(() => [
    { name: "Sales", data: monthlyData.salesByMonth },
    { name: "Expenses", data: monthlyData.expensesByMonth },
  ], [monthlyData]);

  // =====================================================
  // UI Rendering
  // =====================================================
  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-white shadow-xl min-h-screen text-gray-900">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-4xl font-extrabold text-cyan-700 tracking-tight">Sales & Expenses</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <button
              onClick={() =>
                setSortBy((prev) =>
                  prev === "date" ? "amount" : prev === "amount" ? "item" : "date"
                )
              }
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Sort: {sortBy} <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Sales" value={totalSales} color="text-green-600" />
        <SummaryCard title="Total Expenses" value={totalExpenses} color="text-red-600" />
        <SummaryCard
          title="Profit"
          value={profit}
          color={profit >= 0 ? "text-green-700" : "text-red-700"}
        />
      </div>

        {/* Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Monthly Sales vs Expenses
          </h2>
          <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>

      {/* Sales Section */}
      <Section
        title="Sales"
        data={filteredSales}
        color="text-green-600"
        source="sale"
      />

      {/* Expenses Section */}
      <Section
        title="Expenses"
        data={filteredExpenses}     
        color="text-red-600"
        source="expense"
        type="expense"            
      />
    </div>
  );
};

// =====================================================
// Reusable UI Components
// =====================================================
const SummaryCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
  >
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>₱{value.toLocaleString()}</p>
  </motion.div>
);

// =====================================================
// Section and Table Components
// =====================================================
  const Section = ({ title, data, color, source, type }) => {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
        </div>

        <Table
          data={data}
          color={color}
          source={source}
          type={type} />
      </div>
    );
  };

// =====================================================
// Table Component
// =====================================================
const Table = ({ data, color, type }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto mt-6">
    <table className="w-full text-left border-collapse min-w-[600px] text-sm">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th className="py-3 px-6 font-semibold text-gray-700">Item</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Quantity</th>
          <th className="py-3 px-6 font-semibold text-gray-700 text-right">Amount</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Date</th>
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => {
            let itemName = row.item || row.supply_name;
            let quantity = row.quantity || 1;

            // Extract quantity from "Item x1000" format
            const match = itemName.match(/(.*)\s+x(\d+)$/i);
            if (match) {
              itemName = match[1]; // e.g., "Brochure"
              quantity = Number(match[2]); // e.g., 1000
            }

            return (
              <tr key={row.id || index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium text-gray-800">{itemName}</td>
                <td className="py-3 px-6">{quantity}</td>
                <td className={`py-3 px-6 font-semibold text-right ${color}`}>
                  ₱{type === "expense"
                    ? ((Number(quantity) || 0) * (Number(row.price) || 0)).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : Number(row.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                </td>
                <td className="py-3 px-6">{row.date ? new Date(row.date).toLocaleDateString() : "—"}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="py-6 text-center text-gray-500 italic">
              No records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// =====================================================
// Reusable UI Components
// =====================================================
const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white text-gray-900 rounded-2xl p-6 shadow-2xl w-full max-w-lg border relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

const Button = ({ children, variant, onClick, icon }) => {
  const base = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition";
  const styles = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {icon} {children}
    </button>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
      required
    />
  </div>
);

export default SalesAndExpenseSection;
