import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, List, X } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const statusColors = {
  Sufficient: "bg-green-100 text-green-600 border border-green-300",
  "Low on Stock": "bg-yellow-100 text-yellow-600 border border-yellow-300",
  "Out of Stock": "bg-red-100 text-red-600 border border-red-300",
};

const chartColors = {
  Sufficient: "#4ccd7bff",
  "Low on Stock": "#fdd63aff",
  "Out of Stock": "#f64242ff",
};

const getStockStatus = (quantity) => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 20) return "Low on Stock";
  return "Sufficient";
};

const SupplyMonitoring = () => {
  const [supplies, setSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [newSupply, setNewSupply] = useState({ supply_name: "", quantity: 0, price: 0 });

  // ✅ Fetch supplies from backend
  const fetchSupplies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/supplies");
      setSupplies(res.data);
    } catch (err) {
      console.error("❌ Error fetching supplies:", err);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const filteredSupplies = supplies.filter((s) =>
    s.supply_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPopup = (type, supply = null) => {
    setPopupType(type);
    setSelectedSupply(supply);
    setNewSupply(supply || { supply_name: "", quantity: 0, price: 0 });
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedSupply(null);
    setNewSupply({ supply_name: "", quantity: 0, price: 0 });
  };

  // ✅ Add, Edit, Delete backend functions
  const handleConfirm = async () => {
    try {
      if (popupType === "delete") {
        await axios.delete(`http://localhost:5000/api/supplies/${selectedSupply.supply_id}`);
        setSupplies((prev) => prev.filter((s) => s.supply_id !== selectedSupply.supply_id));
      } 
      else if (popupType === "add") {
        const newItem = {
          ...newSupply,
          status: getStockStatus(newSupply.quantity),
        };
        const res = await axios.post("http://localhost:5000/api/supplies", newItem);
        // Use the returned supply object (with supply_id)
        setSupplies((prev) => [...prev, res.data]);
      } 
      else if (popupType === "edit") {
        const updatedItem = {
          ...newSupply,
          status: getStockStatus(newSupply.quantity),
        };
        const res = await axios.put(
          `http://localhost:5000/api/supplies/${selectedSupply.supply_id}`,
          updatedItem
        );
        // Use the returned updated supply object
        setSupplies((prev) =>
          prev.map((s) =>
            s.supply_id === selectedSupply.supply_id
              ? { ...s, ...res.data }
              : s
          )
        );
      }

      closePopup();
    } catch (err) {
      console.error("❌ Error updating supply:", err.response?.data || err.message);
    }
  };

  const sortSupplies = () => {
    setSupplies((prev) =>
      [...prev].sort((a, b) => a.supply_name.localeCompare(b.supply_name))
    );
  };

  // ✅ Chart Data
  const barOptions = useMemo(
    () => ({
      chart: { type: "bar", toolbar: { show: false } },
      xaxis: { categories: supplies.map((s) => s.supply_name) },
      colors: ["#11d8fbff"],
      plotOptions: { bar: { borderRadius: 6, horizontal: false } },
      dataLabels: { enabled: false },
    }),
    [supplies]
  );

  const barSeries = useMemo(
    () => [{ name: "Quantity", data: supplies.map((s) => s.quantity) }],
    [supplies]
  );

  const pieData = useMemo(() => {
    const counts = { Sufficient: 0, "Low on Stock": 0, "Out of Stock": 0 };
    supplies.forEach((s) => counts[s.status]++);
    return {
      series: Object.values(counts),
      labels: Object.keys(counts),
      colors: Object.values(chartColors),
    };
  }, [supplies]);

  const pieOptions = useMemo(
    () => ({
      chart: { type: "donut" },
      labels: pieData.labels,
      colors: pieData.colors,
      legend: { position: "bottom" },
      dataLabels: { enabled: true },
    }),
    [pieData]
  );

  return (
    <div className="p-6 min-h-screen bg-white text-gray-800 rounded-3xl">
      {/* ✅ Same design - header, charts, and table untouched */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">Supply Monitoring</h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full 
                       bg-gray-100 border border-gray-300 text-gray-800
                       focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      {/* ✅ Same charts and table layout — no design changes */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          type="button"
          onClick={() => openPopup("add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Supply
        </button>
        <button
          type="button"
          onClick={sortSupplies}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-300 transition"
        >
          <List size={18} /> Sort Items
        </button>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Quantity per Product
          </h2>
          <ReactApexChart options={barOptions} series={barSeries} type="bar" height={250} />
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Stock Status Overview
          </h2>
          <ReactApexChart options={pieOptions} series={pieData.series} type="donut" height={250} />
        </motion.div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-6 font-semibold text-gray-700">Product</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Quantity</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Price</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Total</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSupplies.map((supply, idx) => (
              <motion.tr
                key={supply.supply_id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{supply.supply_name}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[supply.status]}`}
                  >
                    {supply.status}
                  </span>
                </td>
                <td className="py-3 px-6">{supply.quantity}</td>
                <td className="py-3 px-6">₱{supply.price}</td>
                <td className="py-3 px-6 font-semibold text-gray-900">
                  ₱{(supply.quantity * supply.price).toLocaleString()}
                </td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openPopup("edit", supply)}
                    className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openPopup("delete", supply)}
                    className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full relative border border-gray-200"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={closePopup}
              >
                <X size={20} />
              </button>

              {(popupType === "add" || popupType === "edit") && (
                <>
                  <h3 className="text-xl font-bold mb-4">
                    {popupType === "add" ? "Add New Supply" : "Edit Supply"}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Product name"
                      value={newSupply.supply_name}
                      onChange={(e) =>
                        setNewSupply({ ...newSupply, supply_name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newSupply.quantity}
                      onChange={(e) =>
                        setNewSupply({ ...newSupply, quantity: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newSupply.price}
                      onChange={(e) =>
                        setNewSupply({ ...newSupply, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 mb-5 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </div>
                </>
              )}

              {popupType === "delete" && (
                <>
                  <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete{" "}
                    <strong>{selectedSupply?.supply_name}</strong>?
                  </p>
                </>
              )}

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-xl text-white ${
                    popupType === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition`}
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
