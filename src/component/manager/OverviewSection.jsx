import React, { useState, useEffect, useRef,useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useToast } from "../ui/ToastProvider.jsx";
import { API_URL } from "../../api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const OverviewSection = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const previousOrderIds = useRef(new Set());
  const [showNotifications, setShowNotifications] = useState(false);
  const [orderChartData, setOrderChartData] = useState({
    categories: [],
    data: [],
  });

  const [salesChartData, setSalesChartData] = useState({
    categories: [],
    data: [],
  });
  const [productTotals, setProductTotals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const { showToast } = useToast();
  const prevOrderCount = useRef(0); 
  const isFirstLoad = useRef(true);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      const fetchedOrders = Array.isArray(res.data) ? res.data : res.data.data || [];

      setOrders(fetchedOrders);

      // --- Sales chart logic ---
      const salesMap = {};
      fetchedOrders.forEach(order => {
        const key = order.product_name;
        const saleAmount = Number(order.total_price || 0);
        salesMap[key] = (salesMap[key] || 0) + saleAmount;
      });

      setSalesChartData({
        categories: Object.keys(salesMap),
        data: Object.values(salesMap),
      });

    // --- New orders notification logic  ---
    const currentIds = new Set(fetchedOrders.map(o => o.order_id));
    const newOnes = [...currentIds].filter(id => !previousOrderIds.current.has(id));

    if (!isFirstLoad.current && newOnes.length > 0) {
      const newOrdersList = fetchedOrders.filter(o => newOnes.includes(o.order_id));

      setNewOrders(prev => [...newOrdersList, ...prev].slice(0, 10));

      showToast(`${newOrdersList.length} new order${newOrdersList.length > 1 ? "s" : ""} received!`, "info");
    }

    // Update reference for next poll
    previousOrderIds.current = currentIds;
    isFirstLoad.current = false;

    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };
    // Fetch product totals for sales chart
    useEffect(() => {
      const fetchProductTotals = async () => {
        try {
          const res = await axios.get(`${API_URL}/sales/product-totals`);
          setProductTotals(res.data);
        } catch (err) {
          console.error("❌ Error fetching product totals:", err);
        }
      };

      fetchProductTotals();
    }, []);

  // Fetch on mount and poll every 5s
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch product order counts for chart
  useEffect(() => {
    const fetchOrderChartData = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/product-order-counts`);
        const items = Array.isArray(res.data) ? res.data 
                    : Array.isArray(res.data.data) ? res.data.data 
                    : [];

        setOrderChartData({
          categories: items.map((item) => item.product_name),
          data: items.map((item) => Number(item.total_orders)),
        });
      } catch (err) {
        console.error("Error fetching order chart data:", err);
      }
    };
    fetchOrderChartData();
  }, []);

  // Fetch supplies as expenses
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

  // Prepare series for stacked column chart
  const dynamicExpenseSeries = useMemo(() => {
    if (!expenses.length) return [];

    const monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const grouped = {};

    expenses.forEach((exp) => {
      const supply = exp.supply_name;
      const month = new Date(exp.date).toLocaleString("en-US", { month: "short" });

      if (!grouped[supply]) {
        grouped[supply] = monthList.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
      }

      grouped[supply][month] += Number(exp.price) || 0;
    });

    return Object.entries(grouped).map(([name, monthValues]) => ({
      name,
      data: monthList.map((m) => monthValues[m]),
    }));
  }, [expenses]);


 const totalSalesChart = useMemo(() => {
  return {
    series: [{ name: "Total Sales", data: productTotals.map((p) => Number(p.total_sales) || 0),},],
    options: { chart: { type: "area",stacked: false, toolbar: { show: false }, background: "transparent",},
      xaxis: { categories: productTotals.map((p) => p.product_name), },
      stroke: {curve: "smooth",width: 3,}, dataLabels: { enabled: false,},
      legend: { position: "top", horizontalAlign: "left", },
      fill: { opacity: 0.25, gradient: { shade: "light", type: "vertical",},},
      grid: { borderColor: "#e5e7eb",},
      colors: ["#22c55e"],
    },
  };
}, [productTotals]);

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

  // Chart Data
  const orderData = useMemo(() => ({
    series: [{ name: "Orders", data: orderChartData.data || [] }],
    options: {
      chart: { type: "area", stacked: false, toolbar: { show: false }, background: "transparent" },
      xaxis: { categories: orderChartData.categories || [] },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      legend: { position: "top", horizontalAlign: "left" },
      fill: { opacity: 0.25, gradient: { shade: "light", type: "vertical" } },
      grid: { borderColor: "#e5e7eb" },
      colors: ["#6366f1"],
    },
  }), [orderChartData]);

  // After fetching orderChartData
  const reportChartData = {
    series: orderChartData.data,
    options: {
      chart: { type: "donut", background: "transparent" },
      labels: orderChartData.categories, 
      legend: { position: "bottom" },
      colors: ["#3b82f6", "#facc15", "#ef4444", "#10b981", "#a855f7", "#f97316", "#8b5cf6"], // extend colors if more products
      plotOptions: { pie: { donut: { size: "70%" } } },
    },
  };

  const chartOptions = useMemo(() => ({
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: { bar: { borderRadius: 8 } },
    xaxis: { categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
    colors: ["#6366f1", "#f97316", "#10b981", "#f43f5e", "#3b82f6", "#8b5cf6", "#f59e0b"],
    legend: { position: "bottom" },
    grid: { borderColor: "#e5e7eb" },
    dataLabels: { enabled: false },
    yaxis: { title: { text: "Amount (₱)" } },
    tooltip: { y: { formatter: (val) => `₱${val.toLocaleString()}` } },
  }), []);

  const safeDate = (value) => {
    if (!value) return "";

    const d = new Date(value);

    return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
  };

  const productLookup = useRef({});

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await axios.get(`${API_URL}/products`);
          const products = Array.isArray(res.data) ? res.data : [];

          const map = {};
          products.forEach((p) => {
            map[p.product_id] = p.product_name;
          });

          productLookup.current = map;
        } catch (err) {
          console.error("Error loading products:", err);
        }
      };

      fetchProducts();
    }, []);

  const handleExportAll = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Full Business Report", 14, 16);

    let y = 26;

    // ============================
    // ORDERS SECTION
    // ============================
    doc.setFontSize(14);
    doc.text("Orders", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Customer", "Product", "Qty", "Amount (Php)", "Date", "Status"]],
      body: orders.map((o) => [
        o.customer_name || "",
        o.service || "",
        o.quantity || 1,
        `Php ${Number(o.total_price || 0).toLocaleString()}`,
        safeDate(o.dateOrdered),
        o.status || "",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    y = doc.lastAutoTable.finalY + 12;

    // ============================
    // SALES TOTALS
    // ============================
    doc.setFontSize(14);
    doc.text("Sales Totals", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Item", "Total Sales (Php)"]],
      body: productTotals.map((p) => [
        p.product_name || productLookup.current[p.product_id] || "Unknown",
        `Php ${Number(p.total_sales || 0).toLocaleString()}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    y = doc.lastAutoTable.finalY + 12;

    // ============================
    // ORDERS PER PRODUCT
    // ============================
    doc.setFontSize(14);
    doc.text("Total Orders Per Product", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Product", "Total Orders"]],
      body: orderChartData.categories.map((name, i) => [
        name || "Unknown",
        orderChartData.data[i] || 0,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [245, 158, 11] },
    });

    y = doc.lastAutoTable.finalY + 12;

    // ============================
    // EXPENSES
    // ============================
    doc.setFontSize(14);
    doc.text("Expenses", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Item", "Qty", "Amount (Php)", "Date"]],
      body: expenses.map((exp) => [
        exp.supply_name || "",
        exp.quantity || 0,
        `Php ${(Number(exp.quantity) * Number(exp.price)).toLocaleString()}`,
        safeDate(exp.date),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [239, 68, 68] },
    });

    doc.save("Full_Report.pdf");

    showToast({
      type: "success",
      message: "PDF report generated successfully!",
    });
  };

  const aggregatedSales = useMemo(() => {
    const map = {};

    orders.forEach(order => {
      let productName = order.product_name || "Unknown";
      let quantity = order.quantity || 1;

      // Check if product name has "x1000" style
      const match = productName.match(/(.*)\s+x(\d+)$/i);
      if (match) {
        productName = match[1];
        quantity = Number(match[2]);
      }

      if (!map[productName]) {
        map[productName] = { totalSales: 0, totalQuantity: 0 };
      }

      map[productName].totalSales += Number(order.total_price || 0);
      map[productName].totalQuantity += quantity;
    });

    return Object.entries(map).map(([name, values]) => ({
      product_name: name,
      total_sales: values.totalSales,
      total_quantity: values.totalQuantity,
    }));
  }, [orders]);


return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 rounded-3xl bg-white shadow-xl space-y-8 text-gray-900 min-h-screen"
      >
      {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 relative">
          <div>
            <h1 className="text-4xl font-extrabold text-cyan-700">Dashboard</h1>
            <p className="text-gray-600 text-lg">Hello, Manager</p>
          </div>

          {/* Notification Bell + Export */}
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button
                onClick={() => setShowNotifications((p) => !p)}
                className="relative p-3 rounded-full hover:bg-gray-100 transition"
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {newOrders.length > 0 && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-b-gray-200 font-semibold text-gray-700">
                      Notifications
                    </div>
                    {newOrders.length > 0 ? (
                      <ul className="max-h-60 overflow-y-auto divide-y">
                        {newOrders.map((order, i) => (
                          <li key={i} className="p-3 hover:bg-gray-50 text-sm">
                            <p className="text-gray-600">
                              {order.customer_name} — {order.service}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.dateOrdered).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-gray-500 text-center">
                        No new orders
                      </p>
                    )}
                    <div className="border-t border-t-gray-200">
                      <button
                        onClick={() => {
                          setNewOrders([]);
                          setShowNotifications(false);
                        }}
                        className="w-full text-sm py-2 text-center text-blue-600 hover:bg-blue-50 hover:rounded-b-lg "
                      >
                        Clear Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleExportAll}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Generate Report
            </button>
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
            <h2 className="text-lg font-semibold text-gray-700 mb-3"> Total Orders</h2>
            {orderData.series[0].data.length === 0 ? (
                <p className="text-center text-gray-500">Loading chart...</p>
              ) : (
                <Chart options={orderData.options} series={orderData.series} type="area" height={260} />
              )}
          </motion.div >
          <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Total Sales</h2>
            <ReactApexChart
              options={totalSalesChart.options}
              series={totalSalesChart.series}
              type="area"
              height={260}
            />
          </motion.div>
          </div>
        {/* Reports & Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2"> Reports</h2>
          <Chart options={reportChartData.options} series={reportChartData.series} type="donut" height={300} />
        </motion.div>
          <motion.div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2"> Expenses</h2>
              <ReactApexChart options={chartOptions} series={dynamicExpenseSeries} type="bar" height={300} />
          </motion.div>
        </div>
      </motion.div>

      {/* Orders Popup */}
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
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-600">
                    {groupByStatus(activeFilter).map((order, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">{order.customer_name}</td>
                        <td className="p-3">{order.service}</td>
                        <td className="p-3">{new Date(order.dateOrdered).toLocaleDateString()}</td>
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