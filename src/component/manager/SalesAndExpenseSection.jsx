import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { API_URL } from "../../api.js";

const SalesAndExpenseSection = () => {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  // ===========================================================
  // FIXED: Sales fetch normalization
  // ===========================================================
  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sales`);

      const mappedSales = (res.data?.data || []).map((s) => ({
        id: s.id || s.sale_id,
        item:
          s.item || 
          s.order_item_name ||
          s.product_name ||
          s.service_name ||
          s.template_title ||
          s.category_name ||
          s.description ||
          s.file_name ||
          s.filetype ||
          s.type ||
          s.name ||
          "Unnamed Order",
        amount: Number(s.amount || s.total || 0),
        quantity: Number(s.quantity || 1),
        date:
          s.date ||
          s.created_at ||
          s.date_created ||
          new Date().toISOString(),
      }));


      setSales(mappedSales);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  // ===========================================================
  // Expenses as supplies
  // ===========================================================
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/supplies`);
      if (Array.isArray(res.data)) {
        const mapped = res.data.map((s) => ({
          id: s.supply_id,
          supply_name: s.supply_name || "Unknown",
          quantity: Number(s.quantity) || 0,
          unit: s.unit,
          price: Number(s.price) || 0,
          date: s.created_at || new Date().toISOString(),
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error("Error fetching supplies as expenses:", err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchExpenses();
  }, []);

  // ===========================================================
  // Helpers
  // ===========================================================
  const parseDateSafe = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const categorizeRecord = (record, type) => {
    const name = String(record.item || record.supply_name || "").toLowerCase();
    if (!name) return "Other";
    if (name.includes("id")) return "ID";
    if (name.includes("photo")) return "Photo";
    if (name.includes("tarpaulin") || name.includes("tarp")) return "Tarpaulin";
    if (name.includes("sticker")) return "Stickers";
    if (name.includes("card")) return "Cards";
    if (name.includes("calendar")) return "Calendar";
    return type === "expense" ? "Supplies" : "Other";
  };

  const categories = useMemo(() => {
    const set = new Set();
    sales.forEach((s) => set.add(categorizeRecord(s, "sale")));
    expenses.forEach((e) => set.add(categorizeRecord(e, "expense")));
    return ["All", ...Array.from(set)];
  }, [sales, expenses]);

  // ===========================================================
  // Filter and Sort
  // ===========================================================
  const filterAndSort = (records, type) =>
    records
      .filter((r) => {
        const name = String(r.item || r.supply_name || "").toLowerCase();
        const date = parseDateSafe(r.date);
        const searchLower = search.toLowerCase();

        if (search) {
          const haystack = [
            r.item,
            r.supply_name,
            r.quantity,
            r.amount,
            new Date(r.date).toLocaleDateString(),
            new Date(r.date).toLocaleDateString("en-US", { month: "long" }),
            new Date(r.date).toLocaleDateString("en-US", { month: "short" }),
          ]
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(searchLower)) return false;
        }

        if (dateFrom) {
          const from = parseDateSafe(dateFrom);
          if (from && date && date < from) return false;
        }
        if (dateTo) {
          const to = parseDateSafe(dateTo);
          if (to && date && date > to) return false;
        }

        const cat = categorizeRecord(r, type);
        if (categoryFilter !== "All" && cat !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "amount") {
          const aAmount = Number(a.amount || 0);
          const bAmount = Number(b.amount || 0);
          return bAmount - aAmount;
        }
        if (sortBy === "date") {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        return String(a.item || a.supply_name || "").localeCompare(
          String(b.item || b.supply_name || "")
        );
      });

  const filteredSales = useMemo(
    () => filterAndSort(sales, "sale"),
    [sales, search, sortBy, dateFrom, dateTo, categoryFilter]
  );
  const filteredExpenses = useMemo(
    () => filterAndSort(expenses, "expense"),
    [expenses, search, sortBy, dateFrom, dateTo, categoryFilter]
  );

  // ===========================================================
  // Totals
  // ===========================================================
  const totalSales = useMemo(
    () => filteredSales.reduce((sum, s) => sum + Number(s.amount || 0), 0),
    [filteredSales]
  );

  const totalExpenses = useMemo(
    () =>
      filteredExpenses.reduce(
        (sum, e) =>
          sum + Number(e.quantity || 0) * Number(e.price || 0),
        0
      ),
    [filteredExpenses]
  );

  const profit = totalSales - totalExpenses;

  // ===========================================================
  // Charts (unchanged)
  // ===========================================================
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const monthlyData = useMemo(() => {
    const salesByMonth = Array(12).fill(0);
    const expensesByMonth = Array(12).fill(0);

    filteredSales.forEach((s) => {
      const d = parseDateSafe(s.date);
      if (!d) return;
      salesByMonth[d.getMonth()] += Number(s.amount || 0);
    });

    filteredExpenses.forEach((e) => {
      const d = parseDateSafe(e.date);
      if (!d) return;
      expensesByMonth[d.getMonth()] +=
        Number(e.quantity || 0) * Number(e.price || 0);
    });

    return { salesByMonth, expensesByMonth };
  }, [filteredSales, filteredExpenses]);

  const monthlyChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "45%" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2 },
    xaxis: { categories: months },
    yaxis: { title: { text: "Amount (₱)" } },
    colors: ["#00BFFF", "#FF6347"],
    legend: { position: "top" },
  };

  const monthlyChartSeries = [
    { name: "Sales", data: monthlyData.salesByMonth },
    { name: "Expenses", data: monthlyData.expensesByMonth },
  ];

  // ===========================================================
  // Weekly data (unchanged)
  // ===========================================================
  const getWeekKey = (dateVal) => {
    const d = parseDateSafe(dateVal);
    if (!d) return null;

    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);

    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  };

  const weeklyData = useMemo(() => {
    const salesMap = new Map();
    const expMap = new Map();

    filteredSales.forEach((s) => {
      const key = getWeekKey(s.date);
      if (!key) return;
      salesMap.set(key, (salesMap.get(key) || 0) + Number(s.amount || 0));
    });

    filteredExpenses.forEach((e) => {
      const key = getWeekKey(e.date);
      if (!key) return;
      expMap.set(
        key,
        (expMap.get(key) || 0) +
          Number(e.quantity || 0) * Number(e.price || 0)
      );
    });

    const labels = Array.from(new Set([...salesMap.keys(), ...expMap.keys()])).sort();
    const salesArr = labels.map((k) => salesMap.get(k) || 0);
    const expArr = labels.map((k) => expMap.get(k) || 0);

    return { labels, salesArr, expArr };
  }, [filteredSales, filteredExpenses]);

  const weeklyChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories: weeklyData.labels },
    yaxis: { title: { text: "Amount (₱)" } },
    colors: ["#0070f3", "#ff7d7d"],
    legend: { position: "top" },
  };

  const weeklyChartSeries = [
    { name: "Sales", data: weeklyData.salesArr },
    { name: "Expenses", data: weeklyData.expArr },
  ];

  // ===========================================================
  // Donut chart
  // ===========================================================
  const donutChartOptions = {
    labels: ["Profit", "Expenses"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };

  const donutChartSeries = [
    profit > 0 ? profit : 0,
    totalExpenses > 0 ? totalExpenses : 0,
  ];

  // ===========================================================
  // Top products
  // ===========================================================
  const topProducts = useMemo(() => {
    const map = new Map();

    filteredSales.forEach((s) => {
      const name = s.item || "Unknown";
      map.set(name, (map.get(name) || 0) + Number(s.amount || 0));
    });

    const arr = Array.from(map.entries()).map(([name, total]) => ({
      name,
      total,
    }));

    arr.sort((a, b) => b.total - a.total);

    return arr.slice(0, 5);
  }, [filteredSales]);

  // ===========================================================
  // Export
  // ===========================================================
  const exportToExcel = (type) => {
    const records = type === "sales" ? filteredSales : filteredExpenses;

    const rows = records.map((r) => ({
      Type: type === "sales" ? "Sale" : "Expense",
      Item: r.item || r.supply_name || "",
      Quantity: r.quantity || 1,
      Amount:
        type === "sales"
          ? Number(r.amount || 0)
          : Number(r.quantity || 0) * Number(r.price || 0),
      Date: r.date ? new Date(r.date).toLocaleDateString() : "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      type === "sales" ? "Sales" : "Expenses"
    );

    XLSX.writeFile(wb, type === "sales" ? "sales.xlsx" : "expenses.xlsx");
  };

  const exportToPdfReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Sales & Expenses Report", 14, 18);

    doc.setFontSize(10);
    doc.text(`Total Sales: ₱${totalSales.toLocaleString()}`, 14, 26);
    doc.text(`Total Expenses: ₱${totalExpenses.toLocaleString()}`, 14, 32);
    doc.text(`Profit: ₱${profit.toLocaleString()}`, 14, 38);

    const rows = [
      ...filteredSales.map((r) => ({
        type: "Sale",
        item: r.item || "",
        qty: r.quantity || 1,
        amount: Number(r.amount || 0),
        date: r.date ? new Date(r.date).toLocaleDateString() : "",
      })),
      ...filteredExpenses.map((r) => ({
        type: "Expense",
        item: r.supply_name || "",
        qty: r.quantity || 1,
        amount: Number(r.quantity || 0) * Number(r.price || 0),
        date: r.date ? new Date(r.date).toLocaleDateString() : "",
      })),
    ];

    doc.autoTable({
      startY: 44,
      head: [["Type", "Item", "Qty", "Amount", "Date"]],
      body: rows.map((r) => [
        r.type,
        r.item,
        r.qty,
        `₱${r.amount.toLocaleString()}`,
        r.date,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 112, 243] },
    });

    doc.save("sales-expenses-report.pdf");
  };

  // ===========================================================
  // UI
  // ===========================================================
  const sortLabel =
    sortBy === "date" ? "Date" : sortBy === "amount" ? "Amount" : "Name";

  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-white shadow-xl min-h-screen text-gray-900">

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-cyan-700 tracking-tight">
            Sales & Expenses
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search item or date..."
                className="pl-8 pr-3 py-2 rounded-full bg-gray-100 border border-gray-300 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <span className="self-center text-xs text-gray-500">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setSortBy((prev) =>
                  prev === "date"
                    ? "amount"
                    : prev === "amount"
                    ? "name"
                    : "date"
                )
              }
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
            >
              Sort: {sortLabel} <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pt-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "sales", label: "Sales" },
            { id: "expenses", label: "Expenses" },
            { id: "reports", label: "Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-xl border-b-2 ${
                activeTab === tab.id
                  ? "border-cyan-500 text-cyan-700 bg-white"
                  : "border-transparent text-gray-500 hover:text-cyan-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard title="Total Sales" value={totalSales} color="text-green-600" />
            <SummaryCard title="Total Expenses" value={totalExpenses} color="text-red-600" />
            <SummaryCard
              title="Profit"
              value={profit}
              color={profit >= 0 ? "text-green-700" : "text-red-700"}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Monthly Sales vs Expenses
              </h2>
              <ReactApexChart
                options={monthlyChartOptions}
                series={monthlyChartSeries}
                type="bar"
                height={320}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Weekly Trend
              </h2>
              <ReactApexChart
                options={weeklyChartOptions}
                series={weeklyChartSeries}
                type="line"
                height={320}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Profit vs Expenses
              </h2>
              <ReactApexChart
                options={donutChartOptions}
                series={donutChartSeries}
                type="donut"
                height={280}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Top Products (by Sales)
              </h2>

              {topProducts.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No sales data for this filter.
                </p>
              ) : (
                <ol className="space-y-2">
                  {topProducts.map((p, idx) => (
                    <li
                      key={p.name}
                      className="flex justify-between items-center border-b pb-2 last:border-b-0"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-700">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-gray-800">
                          {p.name}
                        </span>
                      </span>

                      <span className="font-semibold text-green-700">
                        ₱{p.total.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "sales" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-green-700">Sales Records</h2>
            <button
              onClick={() => exportToExcel("sales")}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export Sales to Excel
            </button>
          </div>
          <Table data={filteredSales} color="text-green-600" type="sale" />
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-red-700">Expense Records</h2>
            <button
              onClick={() => exportToExcel("expenses")}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Export Expenses to Excel
            </button>
          </div>
          <Table data={filteredExpenses} color="text-red-600" type="expense" />
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <button
              onClick={() => exportToExcel("sales")}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export Sales to Excel
            </button>

            <button
              onClick={() => exportToExcel("expenses")}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Export Expenses to Excel
            </button>

            <button
              onClick={exportToPdfReport}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Export Full Report (PDF)
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Combined Records (Preview)
            </h2>

            <Table
              data={[
                ...filteredSales.map((s) => ({ ...s, _type: "sale" })),
                ...filteredExpenses.map((e) => ({ ...e, _type: "expense" })),
              ]}
              color="text-cyan-700"
              type="mixed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================================
// Components
// ===========================================================
const SummaryCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
  >
    <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
    <p className={`text-2xl font-bold mt-1 ${color}`}>
      ₱{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  </motion.div>
);

const Table = ({ data, color, type }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto mt-2">
    <table className="w-full text-left border-collapse min-w-[700px] text-sm">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          {type === "mixed" && (
            <th className="py-3 px-6 font-semibold text-gray-700">Type</th>
          )}
          <th className="py-3 px-6 font-semibold text-gray-700">Item</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Quantity</th>
          <th className="py-3 px-6 font-semibold text-gray-700 text-right">
            Amount
          </th>
          <th className="py-3 px-6 font-semibold text-gray-700">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => {
            let itemName = String(row.item || row.supply_name || "");
            let quantity = Number(row.quantity || 1);

            let amount = 0;
            if (type === "expense") amount = quantity * Number(row.price || 0);
            else if (type === "sale") amount = Number(row.amount || 0);
            else amount = row._type === "expense"
              ? quantity * Number(row.price || 0)
              : Number(row.amount || 0);

            return (
              <tr
                key={row.id || index}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {type === "mixed" && (
                  <td className="py-3 px-6 text-xs uppercase text-gray-500">
                    {row._type === "expense" ? "Expense" : "Sale"}
                  </td>
                )}
                <td className="py-3 px-6 font-medium text-gray-800">
                  {itemName}
                </td>
                <td className="py-3 px-6">{quantity}</td>
                <td className={`py-3 px-6 font-semibold text-right ${color}`}>
                  ₱
                  {amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-3 px-6">
                  {row.date
                    ? new Date(row.date).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={type === "mixed" ? 5 : 4}
              className="py-6 text-center text-gray-500 italic"
            >
              No records found for this filter.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default SalesAndExpenseSection;