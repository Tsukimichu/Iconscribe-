import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, List, X, ChevronDown } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useToast } from "../ui/ToastProvider.jsx";
import { API_URL } from "../../api.js";

const SupplyMonitoring = () => {
  const [supplies, setSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const lowStockThreshold = 5;
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const { showToast } = useToast();

  // ----------------- CATEGORY SETS ----------------- //
  const materialCategories = [
    "Ink & Toner",
    "Printing Paper",
    "PVC / ID Materials",
    "Binding Materials",
    "Packaging Supplies",
    "Office Consumables",
    "Cleaning & Maintenance Supplies",
    "Accessories",
    "Others",
  ];

  const expenseCategories = [
    "Rent & Lease",
    "Utilities",
    "Transportation",
    "Labor / Salary",
    "Miscellaneous",
  ];

  const emptySupply = {
    supply_name: "",
    quantity: "",
    unit: "",
    price: "",
    category: "",
    expense_type: "Material",
  };

  const [newSupply, setNewSupply] = useState(emptySupply);

  // ======================================================
  // Fetch supplies
  // ======================================================
  const fetchSupplies = async () => {
    try {
      const res = await axios.get(`${API_URL}/supplies`);
      setSupplies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching supplies:", err);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  // ======================================================
  // Low stock alert toast
  // ======================================================
  useEffect(() => {
    if (supplies.length === 0) return;

    const lowStockItems = supplies.filter(
      (s) => Number(s.quantity) <= lowStockThreshold && s.expense_type === "Material"
    );

    if (lowStockItems.length > 0) {
      showToast(`⚠ Low stock detected! (${lowStockItems.length} item/s)`, "warning");
    }
  }, [supplies, showToast]);

  // ======================================================
  // Search filter
  // ======================================================
  const filteredSupplies = supplies.filter((s) => {
    const needle = searchTerm.toLowerCase();
    return (
      s.supply_name?.toLowerCase().includes(needle) ||
      s.category?.toLowerCase().includes(needle) ||
      s.expense_type?.toLowerCase().includes(needle)
    );
  });

  // ======================================================
  // Categorize into: Materials, Business, Utilities, Transport, Misc
  // ======================================================

    const sortedSupplies = useMemo(() => {
      let arr = [...filteredSupplies];

      switch (sortBy) {
        case "name-asc":
          arr.sort((a, b) => a.supply_name.localeCompare(b.supply_name));
          break;
        case "name-desc":
          arr.sort((a, b) => b.supply_name.localeCompare(a.supply_name));
          break;
        case "qty-low":
          arr.sort((a, b) => Number(a.quantity) - Number(b.quantity));
          break;
        case "qty-high":
          arr.sort((a, b) => Number(b.quantity) - Number(a.quantity));
          break;
        case "price-low":
          arr.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "price-high":
          arr.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        default:
          break;
      }

      return arr;
    }, [filteredSupplies, sortBy]);  
 
  const categorizedSupplies = useMemo(() => {
    const groups = {
      Materials: [],
      Business: [],
      Utilities: [],
      Transport: [],
      Miscellaneous: [],
    };

    filteredSupplies.forEach((item) => {
      if (item.expense_type === "Material") {
        groups.Materials.push(item);
      } else {
        const cat = item.category || "";
        if (cat.includes("Utilities")) {
          groups.Utilities.push(item);
        } else if (cat.includes("Transportation")) {
          groups.Transport.push(item);
        } else if (cat.includes("Miscellaneous")) {
          groups.Miscellaneous.push(item);
        } else {
          groups.Business.push(item);
        }
      }
    });

    return groups;
  }, [filteredSupplies]);

  // ======================================================
  // Expense Totals per Category (for color-coded chart)
  // ======================================================
  const expenseTotals = useMemo(() => {
    return {
      Materials: categorizedSupplies.Materials.reduce((sum, s) => sum + Number(s.price || 0), 0),
      Business: categorizedSupplies.Business.reduce((sum, s) => sum + Number(s.price || 0), 0),
      Utilities: categorizedSupplies.Utilities.reduce((sum, s) => sum + Number(s.price || 0), 0),
      Transport: categorizedSupplies.Transport.reduce((sum, s) => sum + Number(s.price || 0), 0),
      Miscellaneous: categorizedSupplies.Miscellaneous.reduce((sum, s) => sum + Number(s.price || 0), 0),
    };
  }, [categorizedSupplies]);


  // ======================================================
  // Chart Data
  // 1) Quantity per Item (existing)
  // 2) Stock level per Material Category (new)
  // EXPENSES CHART (COLOR-CODED BY CATEGORY)
  // ======================================================
  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: {
      categories: ["Materials", "Business", "Utilities", "Transport", "Misc"],
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
      },
    },
    colors: [
      "#22c55e", // Materials
      "#3b82f6", // Business
      "#a855f7", // Utilities
      "#f59e0b", // Transport
      "#6b7280", // Misc
    ],
    dataLabels: { enabled: false },
  };


  const barSeries = [
    {
      name: "Total Expense",
      data: [
        expenseTotals.Materials,
        expenseTotals.Business,
        expenseTotals.Utilities,
        expenseTotals.Transport,
        expenseTotals.Miscellaneous,
      ],
    },
  ];


  const materialStockByCategory = useMemo(() => {
    const totals = {};
    supplies
      .filter((s) => s.expense_type === "Material")
      .forEach((s) => {
        const cat = s.category || "Uncategorized";
        const qty = Number(s.quantity) || 0;
        totals[cat] = (totals[cat] || 0) + qty;
      });
    return totals;
  }, [supplies]);

  const materialBarOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: Object.keys(materialStockByCategory) },
    colors: ["#22c55e"],
    plotOptions: { bar: { borderRadius: 6 } },
    dataLabels: { enabled: false },
  };

  const materialBarSeries = [
    {
      name: "Stock Level",
      data: Object.values(materialStockByCategory),
    },
  ];

  // ======================================================
  // Popup handlers
  // ======================================================
  const openPopup = (type, supply = null) => {
    setPopupType(type);
    setSelectedSupply(supply);

    if (type === "edit" && supply) {
      setNewSupply({
        supply_name: supply.supply_name,
        quantity: "",
        unit: supply.unit,
        price: supply.price,
        category: supply.category,
        expense_type: supply.expense_type,
      });
    } else {
      setNewSupply(emptySupply);
    }

    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setPopupType(null);
    setSelectedSupply(null);
    setNewSupply(emptySupply);
    setIsPopupOpen(false);
  };

  // ======================================================
  // Confirm add / edit
  // ======================================================
  const handleConfirm = async () => {
    try {
      if (!newSupply.supply_name.trim())
        return showToast("Supply name is required.", "error");

      if (!newSupply.category)
        return showToast("Select a category.", "error");

      if (popupType === "add") {
        await axios.post(`${API_URL}/supplies`, {
          ...newSupply,
          quantity: Number(newSupply.quantity) || 0,
          price: Number(newSupply.price) || 0,
        });

        showToast("Supply added successfully!", "success");
      }

      if (popupType === "edit" && selectedSupply) {
        const addQty = Number(newSupply.quantity) || 0;

        if (addQty <= 0)
          return showToast("Enter a valid quantity to add.", "error");

        await axios.put(`${API_URL}/supplies/${selectedSupply.supply_id}`, {
          ...newSupply,
          quantity: Number(selectedSupply.quantity) + addQty,
          price: Number(newSupply.price) || 0,
        });

        showToast(`Added ${addQty} to stock!`, "success");
      }

      await fetchSupplies();
      closePopup();
    } catch (err) {
      console.error(err);
      showToast("Error saving supply.", "error");
    }
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="p-6 min-h-screen bg-white text-gray-800 rounded-3xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">
          Expenses Management
        </h1>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-72 rounded-full bg-gray-100 border border-gray-300"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => openPopup("add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add Expenses
        </button>

        <div className="relative">
           <span className="text-sm text-gray-600 hidden sm:inline">
              Sort:
           </span>
           
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className="flex items-center justify-between w-44 px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-sm text-gray-700 hover:border-cyan-400"
          >
            {sortBy === "default"
              ? "Default"
              : sortBy === "name-asc"
              ? "Name (A–Z)"
              : sortBy === "name-desc"
              ? "Name (Z–A)"
              : sortBy === "qty-low"
              ? "Quantity (v → ʌ)"
              : sortBy === "qty-high"
              ? "Quantity (ʌ → v)"
              : sortBy === "price-low"
              ? "Price (v → ʌ)"
              : "Price (ʌ → v)"}

            <ChevronDown className="w-4 h-4" />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
              <button
                onClick={() => {
                  setSortBy("name-asc");
                  setSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Name (A–Z)
              </button>

              <button
                onClick={() => {
                  setSortBy("name-desc");
                  setSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Name (Z–A)
              </button>

              <div className="border-t my-1" />

              <button
                onClick={() => {
                  setSortBy("qty-low");
                  setSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Quantity (v → ʌ)
              </button>

              <button
                onClick={() => {
                  setSortBy("qty-high");
                  setSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Quantity (ʌ → v)
              </button>

              <div className="border-t my-1" />

              <button
                onClick={() => {
                  setSortBy("price-low");
                  setSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Price (v → ʌ)
              </button>

              <button
                onClick={() => {
                  setSortBy("price-high");
                  setSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Price (ʌ → v)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Expenses Chart
          </h2>

          <ReactApexChart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={250}
          />
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Stock Level per Material Category
          </h2>

          <ReactApexChart
            options={materialBarOptions}
            series={materialBarSeries}
            type="bar"
            height={250}
          />
        </motion.div>
      </div>

      {/* TABLES */}
      <div className="space-y-10">

        {/* MATERIALS */}
        {sortedSupplies.filter(s => s.expense_type === "Material").length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-700">Materials</h2>

              <span className="text-lg font-semibold text-green-600">
                Total: ₱
                {sortedSupplies
                  .filter((s) => s.expense_type === "Material")
                  .reduce((sum, s) => sum + Number(s.price || 0), 0)
                  .toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl shadow-md border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="h-14">
                    <th className="px-6 text-left font-semibold">Name</th>
                    <th className="px-6 text-left font-semibold">Quantity</th>
                    <th className="px-6 text-left font-semibold">Unit</th>
                    <th className="px-6 text-left font-semibold">Category</th>
                    <th className="px-6 text-left font-semibold">Price</th>
                    <th className="px-6 text-left font-semibold">Status</th>
                    <th className="px-6 text-left font-semibold">Date</th>
                    <th className="px-6 text-left font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedSupplies
                    .filter((s) => s.expense_type === "Material")
                    .map((s) => {
                      const isLow = Number(s.quantity) <= lowStockThreshold;

                      return (
                        <tr
                          key={s.supply_id}
                          className="hover:bg-gray-50 h-14 transition"
                        >
                          <td className="px-6">{s.supply_name}</td>
                          <td className="px-6">{s.quantity}</td>
                          <td className="px-6">{s.unit || "—"}</td>
                          <td className="px-6">{s.category}</td>
                          <td className="px-6 text-green-700 font-semibold">
                            ₱{Number(s.price || 0).toLocaleString()}
                          </td>

                          <td className="px-6">
                            {isLow ? (
                              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                                OK
                              </span>
                            )}
                          </td>

                          <td className="px-6 text-xs text-gray-500">
                            {s.created_at
                              ? new Date(s.created_at).toLocaleDateString()
                              : "—"}
                          </td>

                          <td className="px-6 flex gap-2">
                            <button
                              onClick={() => openPopup("edit", s)}
                              className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition shadow-sm"
                            >
                              <List size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BUSINESS EXPENSES */}
        {sortedSupplies.filter(s =>
            s.expense_type !== "Material" &&
            !["Utilities", "Transportation", "Miscellaneous"].includes(s.category)
          ).length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-700">
                Business Expenses
              </h2>

              <span className="text-lg font-semibold text-green-600">
                Total: ₱
                {sortedSupplies
                  .filter(
                    (s) =>
                      s.expense_type !== "Material" &&
                      !["Utilities", "Transportation", "Miscellaneous"].includes(
                        s.category
                      )
                  )
                  .reduce((sum, s) => sum + Number(s.price || 0), 0)
                  .toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl shadow-md border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="h-14">
                    <th className="px-6 text-left font-semibold">Name</th>
                    <th className="px-6 text-left font-semibold">Category</th>
                    <th className="px-6 text-left font-semibold">Price</th>
                    <th className="px-6 text-left font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedSupplies
                    .filter(
                      (s) =>
                        s.expense_type !== "Material" &&
                        !["Utilities", "Transportation", "Miscellaneous"].includes(
                          s.category
                        )
                    )
                    .map((s) => (
                      <tr
                        key={s.supply_id}
                        className="hover:bg-gray-50 h-14 transition"
                      >
                        <td className="px-6">{s.supply_name}</td>
                        <td className="px-6">{s.category}</td>
                        <td className="px-6 text-green-700 font-semibold">
                          ₱{Number(s.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 text-xs text-gray-500">
                          {s.created_at
                            ? new Date(s.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UTILITIES */}
        {sortedSupplies.filter(s => s.category?.includes("Utilities")).length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-700">Utilities</h2>

              <span className="text-lg font-semibold text-indigo-600">
                Total: ₱
                {sortedSupplies
                  .filter((s) => s.category?.includes("Utilities"))
                  .reduce((sum, s) => sum + Number(s.price || 0), 0)
                  .toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl shadow-md border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="h-14">
                    <th className="px-6 text-left font-semibold">Name</th>
                    <th className="px-6 text-left font-semibold">Category</th>
                    <th className="px-6 text-left font-semibold">Price</th>
                    <th className="px-6 text-left font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedSupplies
                    .filter((s) => s.category?.includes("Utilities"))
                    .map((s) => (
                      <tr
                        key={s.supply_id}
                        className="hover:bg-gray-50 h-14 transition"
                      >
                        <td className="px-6">{s.supply_name}</td>
                        <td className="px-6">{s.category}</td>
                        <td className="px-6 text-green-700 font-semibold">
                          ₱{Number(s.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 text-xs text-gray-500">
                          {s.created_at
                            ? new Date(s.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSPORT */}
        {sortedSupplies.filter(s => s.category?.includes("Transportation")).length >
          0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-600">Transport</h2>

              <span className="text-lg font-semibold text-orange-600">
                Total: ₱
                {sortedSupplies
                  .filter((s) => s.category?.includes("Transportation"))
                  .reduce((sum, s) => sum + Number(s.price || 0), 0)
                  .toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl shadow-md border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="h-14">
                    <th className="px-6 text-left font-semibold">Name</th>
                    <th className="px-6 text-left font-semibold">Category</th>
                    <th className="px-6 text-left font-semibold">Price</th>
                    <th className="px-6 text-left font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedSupplies
                    .filter((s) => s.category?.includes("Transportation"))
                    .map((s) => (
                      <tr
                        key={s.supply_id}
                        className="hover:bg-gray-50 h-14 transition"
                      >
                        <td className="px-6">{s.supply_name}</td>
                        <td className="px-6">{s.category}</td>
                        <td className="px-6 text-green-700 font-semibold">
                          ₱{Number(s.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 text-xs text-gray-500">
                          {s.created_at
                            ? new Date(s.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MISCELLANEOUS */}
        {sortedSupplies.filter(s => s.category?.includes("Misc")).length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Miscellaneous</h2>

              <span className="text-lg font-semibold text-gray-700">
                Total: ₱
                {sortedSupplies
                  .filter((s) => s.category?.includes("Misc"))
                  .reduce((sum, s) => sum + Number(s.price || 0), 0)
                  .toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl shadow-md border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="h-14">
                    <th className="px-6 text-left font-semibold">Name</th>
                    <th className="px-6 text-left font-semibold">Category</th>
                    <th className="px-6 text-left font-semibold">Price</th>
                    <th className="px-6 text-left font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedSupplies
                    .filter((s) => s.category?.includes("Misc"))
                    .map((s) => (
                      <tr
                        key={s.supply_id}
                        className="hover:bg-gray-50 h-14 transition"
                      >
                        <td className="px-6">{s.supply_name}</td>
                        <td className="px-6">{s.category}</td>
                        <td className="px-6 text-green-700 font-semibold">
                          ₱{Number(s.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 text-xs text-gray-500">
                          {s.created_at
                            ? new Date(s.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* POPUP */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full relative"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={closePopup}
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold mb-4">
                {popupType === "add"
                  ? "Add New Supply"
                  : `Add Stock: ${selectedSupply?.supply_name}`}
              </h3>

              <div className="space-y-4">
                <select
                  value={newSupply.expense_type}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      expense_type: e.target.value,
                      category: "",
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                >
                  <option value="Material">Material</option>
                  <option value="Business">Business Expense</option>
                </select>

                <input
                  type="text"
                  placeholder="Supply name"
                  value={newSupply.supply_name}
                  readOnly={popupType === "edit"}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      supply_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />

                <input
                  type="number"
                  placeholder={popupType === "edit" ? "Add Quantity" : "Quantity"}
                  value={newSupply.quantity}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />

                <select
                  value={newSupply.category}
                  onChange={(e) =>
                    setNewSupply({ ...newSupply, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                >
                  <option value="">Select Category</option>

                  {(newSupply.expense_type === "Business"
                    ? expenseCategories
                    : materialCategories
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Unit (e.g. pcs, box)"
                  value={newSupply.unit}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      unit: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={newSupply.price}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 rounded-xl border hover:bg-gray-100"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplyMonitoring;