import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Calendar, Clock, Save, X } from "lucide-react";
import { useToast } from "../ui/ToastProvider.jsx";

const Maintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCountdown, setShowCountdown] = useState(true);
  const {showToast} = useToast();

  const [selectedProduct, setSelectedProduct] = useState("Book");
  const [productComponents, setProductComponents] = useState({
    Book: [
      { name: "Paper (Matte)", cost: 15, unit: "per sheet" },
      { name: "Binding Glue", cost: 10, unit: "per use" },
      { name: "Ink", cost: 5, unit: "per page" },
    ],
    Sticker: [
      { name: "Vinyl Sheet", cost: 8, unit: "per piece" },
      { name: "Adhesive", cost: 5, unit: "per ml" },
    ],
  });

  // Component editing logic
  const handleComponentChange = (index, key, value) => {
    const updated = { ...productComponents };
    updated[selectedProduct][index][key] = value;
    setProductComponents(updated);
  };

  const handleAddComponent = (product) => {
    const updated = { ...productComponents };
    updated[product].push({ name: "", cost: "", unit: "" });
    setProductComponents(updated);
  };

  const handleDeleteComponent = (product, index) => {
    const updated = { ...productComponents };
    updated[product].splice(index, 1);
    setProductComponents(updated);
  };

  const handleSaveComponent = (product, index) => {
    const comp = productComponents[product][index];
    alert(` Saved ${comp.name} (${comp.cost} / ${comp.unit}) for ${product}`);
  };


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/maintenance/status");
        const data = await res.json();
        setIsMaintenance(data.maintenance || false);
        setMessage(data.message || "");
        setEndDate(data.endTime || "");
        setShowCountdown(data.showCountdown || false);
      } catch (err) {
        console.error("❌ Failed to fetch maintenance status:", err);
      }
    };
    fetchStatus();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ You must be logged in as admin to change maintenance settings.");
        return;
      }

      if (isMaintenance) {
        // Enable maintenance
        await fetch("http://localhost:5000/api/maintenance/on", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            end_time: endDate,
            show_countdown: showCountdown,
          }),
        });
      } else {
        // Disable maintenance
        await fetch("http://localhost:5000/api/maintenance/off", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });
      }

      showToast(" Maintenance configuration saved to backend!");
    } catch (error) {
      console.error(" Failed to save maintenance:", error);
      alert(" Failed to save maintenance configuration");
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen w-full bg-white text-gray-900 p-10"
    >
      <h1 className="text-4xl font-extrabold text-cyan-700">Maintenance Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left section */}
        <div className="space-y-8 bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          {/* Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <h2 className="text-lg font-semibold">Enable Maintenance Mode</h2>
              <p className="text-sm text-gray-500">
                Visitors cannot access the system. Only admins can log in.
              </p>
            </div>
            <button
              onClick={() => setIsMaintenance(!isMaintenance)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                isMaintenance ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
                  isMaintenance ? "translate-x-7" : ""
                }`}
              ></span>
            </button>
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="We are undergoing maintenance. Please check back soon."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown to visitors during maintenance.
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCountdown}
                onChange={() => setShowCountdown(!showCountdown)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-600">Show countdown timer</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          {isMaintenance ? (
            <div className="border border-yellow-300 bg-yellow-50 text-yellow-800 p-6 rounded-xl shadow-inner">
              <h3 className="font-bold mb-2">🚧 Maintenance Mode Active</h3>
              <p>{message || "System is under maintenance. Please check back later."}</p>
              {showCountdown && endDate && (
                <p className="mt-2 text-sm text-gray-700">
                  Expected end:{" "}
                  <span className="font-medium">
                    {new Date(endDate).toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Maintenance mode is <b>OFF</b>.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Maintenance;
