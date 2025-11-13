import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, List, X } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
  import { useToast } from "../ui/ToastProvider.jsx";

const SupplyMonitoring = () => {
  const [supplies, setSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [newSupply, setNewSupply] = useState({
    supply_name: "",
    quantity: 0,
    unit: "",
    price: 0,
  });
  const showToast = useToast();

  // Fetch supplies
  const fetchSupplies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/supplies");
      setSupplies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(" Error fetching supplies:", err);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const filteredSupplies = supplies.filter((s) =>
    s.supply_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open popup
  const openPopup = (type, supply = null) => {
    setPopupType(type);
    setSelectedSupply(supply);

    if (type === "edit" && supply) {
      setNewSupply({
        supply_name: supply.supply_name,
        quantity: 0,
        unit: supply.unit,
        price: supply.price,
      });
    } else {
      setNewSupply({
        supply_name: "",
        quantity: 0,
        unit: "",
        price: 0,
      });
    }

    setIsPopupOpen(true);
  };


  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedSupply(null);
    setNewSupply({
      supply_name: "",
      quantity: 0,
      unit: "",
      price: 0,
    });
  };

  // Confirm add/edit
  const handleConfirm = async () => {
    try {
      if (popupType === "add") {
        await axios.post("http://localhost:5000/api/supplies", {
          supply_name: newSupply.supply_name.trim(),
          quantity: Number(newSupply.quantity),
          unit: newSupply.unit.trim(),
          price: Number(newSupply.price),
        });
      } else if (popupType === "edit" && selectedSupply) {
        // Add quantity to existing stock, update unit & price
        const updatedQuantity =
          Number(selectedSupply.quantity) + Number(newSupply.quantity);

        const payload = {
          supply_name: selectedSupply.supply_name,
          quantity: updatedQuantity,
          unit: newSupply.unit.trim(),
          price: Number(newSupply.price),
        };

        await axios.put(
          `http://localhost:5000/api/supplies/${selectedSupply.supply_id}`,
          payload
        );
        showToast("Expenses updated successfully!", "success");
      }

      await fetchSupplies();
      closePopup();
    } catch (err) {
      console.error("❌ Error saving supply:", err.response?.data || err.message);
    }
  };


  const sortSupplies = () => {
    setSupplies((prev) =>
      [...prev].sort((a, b) => a.supply_name.localeCompare(b.supply_name))
    );
  };

  // Chart Data
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

  return (
    <div className="p-6 min-h-screen bg-white text-gray-800 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">
          Expenses Management
        </h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full bg-gray-100 border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => openPopup("add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Supply
        </button>
        <button
          onClick={sortSupplies}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-300 transition"
        >
          <List size={18} /> Sort Items
        </button>
      </div>

      {/* Chart */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Quantity per Item
          </h2>
          <ReactApexChart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={250}
          />
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
              <th className="py-3 px-6 font-semibold text-gray-700">Item</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Date</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Quantity</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Unit</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Price</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSupplies.map((s, idx) => (
              <motion.tr
                key={s.supply_id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{s.supply_name}</td>
                <td className="py-3 px-6">
                  {s.created_at
                    ? new Date(s.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="py-3 px-6">{s.quantity}</td>
                <td className="py-3 px-6">{s.unit || "—"}</td>
                <td className="py-3 px-6">
                  ₱{(Number(s.price) || 0).toFixed(2)}
                </td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => openPopup("edit", s)}
                    className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition"
                  >
                    <Edit2 size={16} /> Edit
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

              <h3 className="text-xl font-bold mb-4">
                {popupType === "add"
                  ? "Add New Supply"
                  : `Edit Supply: ${selectedSupply?.supply_name}`}
              </h3>

              <div className="space-y-4">
                {/* Supply name - read-only in edit mode */}
                <input
                  type="text"
                  placeholder="Product name"
                  value={newSupply.supply_name}
                  readOnly={popupType === "edit"}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      supply_name: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none ${
                    popupType === "edit"
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />

                {/* Quantity input (additive when editing) */}
                <div>
                  <input
                    type="number"
                    placeholder={popupType === "edit" ? "Add Quantity" : "Quantity"}
                    value={newSupply.quantity}
                    onChange={(e) =>
                      setNewSupply({
                        ...newSupply,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {popupType === "edit" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Current quantity: {selectedSupply?.quantity}
                    </p>
                  )}
                </div>

                {/* Editable Unit */}
                <input
                  type="text"
                  placeholder="Unit"
                  value={newSupply.unit}
                  onChange={(e) => setNewSupply({ ...newSupply, unit: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                {/* Editable Price */}
                <input
                  type="number"
                  placeholder="Price"
                  value={newSupply.price}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>


              <div className="flex justify-center gap-4 mt-6">
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
                  className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition"
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
