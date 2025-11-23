import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, List, X } from "lucide-react";
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

  const { showToast } = useToast();

  // ----------------- CATEGORY SETS ----------------- //
  const materialCategories = [
    "Ink & Toner",
    "Photo Paper",
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
    "Utilities (Electricity, Water)",
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
      (s) => Number(s.quantity) <= lowStockThreshold
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
  // Group by category
  // ======================================================
  const groupedSupplies = useMemo(() => {
    const groups = {};

    filteredSupplies.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    return groups;
  }, [filteredSupplies]);

  // ======================================================
  // Section grouping
  // ======================================================
  const sectionGroups = useMemo(() => {
    return {
      Materials: Object.entries(groupedSupplies).filter(([category]) =>
        materialCategories.includes(category)
      ),
      Business: Object.entries(groupedSupplies).filter(([category]) =>
        expenseCategories.includes(category)
      ),
      Uncategorized: Object.entries(groupedSupplies).filter(
        ([category]) =>
          !materialCategories.includes(category) &&
          !expenseCategories.includes(category)
      ),
    };
  }, [groupedSupplies]);

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
  // Chart Data
  // ======================================================
  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: supplies.map((s) => s.supply_name) },
    colors: ["#11d8fbff"],
    plotOptions: { bar: { borderRadius: 6 } },
    dataLabels: { enabled: false },
  };

  const barSeries = [{
    name: "Quantity",
    data: supplies.map((s) => s.quantity),
  }];

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="p-6 min-h-screen bg-white text-gray-800 rounded-3xl">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">Expenses Management</h1>

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

        <button
          onClick={() =>
            setSupplies((prev) => [...prev].sort((a, b) =>
              a.supply_name.localeCompare(b.supply_name)
            ))
          }
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <List size={18} /> Sort Items
        </button>
      </div>

      {/* CHART */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Quantity per Item</h2>

          <ReactApexChart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={250}
          />
        </motion.div>
      </div>

      {/* ======================== */}
      {/* CARD DISPLAY INTEGRATED */}
      {/* ======================== */}

      <div className="space-y-10">

        {/* MATERIALS */}
        {sectionGroups.Materials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-cyan-700 mb-4">Materials</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionGroups.Materials.flatMap(([category, items]) =>
                items.map((s) => (
                  <motion.div
                    key={s.supply_id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl shadow-md border ${
                      s.quantity <= lowStockThreshold
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <h3 className="text-xl font-bold">{s.supply_name}</h3>
                    <p className="text-sm text-gray-500">{s.category}</p>

                    <div className="mt-3">
                      <p><b>Qty:</b> {s.quantity} {s.unit}</p>

                      {s.quantity <= lowStockThreshold && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded-full">
                          Low Stock
                        </span>
                      )}

                      <p className="mt-2">
                        <b>Price:</b> ₱{Number(s.price).toFixed(2)}
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Added: {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                    </p>

                    <button
                      onClick={() => openPopup("edit", s)}
                      className="mt-4 w-full py-2 bg-cyan-100 text-cyan-700 rounded-lg font-semibold hover:bg-cyan-200"
                    >
                      Add Stock
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* BUSINESS */}
        {sectionGroups.Business.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Business Expenses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionGroups.Business.flatMap(([category, items]) =>
                items.map((s) => (
                  <motion.div
                    key={s.supply_id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white shadow-md border border-gray-200"
                  >
                    <h3 className="text-xl font-bold">{s.supply_name}</h3>
                    <p className="text-sm text-gray-500">{s.category}</p>

                    <div className="mt-3">
                      <p><b>Type:</b> Business Expense</p>
                      <p><b>Price:</b> ₱{Number(s.price).toFixed(2)}</p>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Date: {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* UNCATEGORIZED */}
        {sectionGroups.Uncategorized.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Uncategorized</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionGroups.Uncategorized.flatMap(([category, items]) =>
                items.map((s) => (
                  <motion.div
                    key={s.supply_id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white shadow-md border border-gray-200"
                  >
                    <h3 className="text-xl font-bold">{s.supply_name}</h3>
                    <p className="text-sm text-gray-500">{s.category}</p>

                    <div className="mt-3">
                      <p><b>Qty:</b> {s.quantity}</p>
                      <p><b>Price:</b> ₱{Number(s.price).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))
              )}
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
                {popupType === "add" ? "Add New Supply" : `Add Stock: ${selectedSupply?.supply_name}`}
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
