import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Save, X } from "lucide-react";
import { useToast } from "../ui/ToastProvider.jsx";
import { API_URL } from "../../api.js";

const Maintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCountdown, setShowCountdown] = useState(true);
  const { showToast } = useToast();

  const [attributes, setAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [attrOption, setAttrOption] = useState("");
  const [attrPrice, setAttrPrice] = useState("");
  const [selectedAttrForOption, setSelectedAttrForOption] = useState("");

  useEffect(() => {
    fetchStatus();
    fetchAttributes();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/maintenance/status`);
      const data = await res.json();

      setIsMaintenance(data.maintenance || false);
      setMessage(data.message || "");
      setEndDate(data.endTime || "");
      setShowCountdown(data.showCountdown || false);
    } catch (err) {
      console.error("❌ Failed to fetch maintenance:", err);
    }
  };

  const fetchAttributes = async () => {
    try {
      const res = await fetch(`${API_URL}/attributes`);
      const data = await res.json();
      setAttributes(data || []);

      if (!selectedAttrForOption && data.length > 0) {
        setSelectedAttrForOption(data[0].attribute_name);
      }
    } catch (err) {
      console.error("❌ Failed to fetch attributes:", err);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Admin login required.");

      if (isMaintenance) {
        await fetch(`${API_URL}/maintenance/on`, {
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
        await fetch(`${API_URL}/maintenance/off`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      showToast("Maintenance settings updated!");
    } catch (err) {
      alert("Failed to save maintenance.");
    }
  };

  const handleCancel = () => window.location.reload();

  const handleAddAttribute = async () => {
    if (!attrName.trim() || !attrOption.trim()) {
      return alert("Attribute name and first option are required.");
    }

    try {
      await fetch(`${API_URL}/attributes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attribute_name: attrName.trim(),
          option_value: attrOption.trim(),
          price: Number(attrPrice) || 0,
        }),
      });

      setAttrName("");
      setAttrOption("");
      setAttrPrice("");
      fetchAttributes();
      showToast("Attribute created!");
    } catch (err) {
      alert("Failed to add attribute.");
    }
  };

  const handleAddOption = async () => {
    if (!selectedAttrForOption || !attrOption.trim()) {
      return alert("Select an attribute and enter an option.");
    }

    try {
      await fetch(
        `${API_URL}/attributes/${encodeURIComponent(
          selectedAttrForOption
        )}/options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            option_value: attrOption.trim(),
            price: Number(attrPrice) || 0,
          }),
        }
      );

      setAttrOption("");
      setAttrPrice("");
      fetchAttributes();
      showToast("Option added!");
    } catch (err) {
      alert("Failed to add option.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen bg-white text-gray-900 flex justify-center p-6"
    >
      <div className="w-full max-w-6xl">
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-6">
          Maintenance & Attributes Settings
        </h1>

        {/* ──────────────────── TWO-COLUMN GRID ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT CARD – MAINTENANCE SETTINGS */}
          <div className="space-y-8 h-[680px] bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">

            {/* Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
              <div>
                <h2 className="text-lg font-semibold">Enable Maintenance Mode</h2>
                <p className="text-sm text-gray-500">
                  Only admins can access the system while enabled.
                </p>
              </div>
              <button
                onClick={() => setIsMaintenance(!isMaintenance)}
                className={`relative w-14 h-7 rounded-full transition-all ${
                  isMaintenance ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    isMaintenance ? "translate-x-7" : ""
                  }`}
                ></span>
              </button>
            </div>

            {/* Time Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm">Start Date & Time</label>
                <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm">End Date & Time</label>
                <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                  <Clock className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm">Maintenance Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We are undergoing maintenance…"
                className="w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none min-h-[120px] resize-none"
              />
            </div>

            {/* Countdown Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCountdown}
                onChange={() => setShowCountdown(!showCountdown)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm">Show countdown timer</span>
            </label>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="bg-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </div>

          {/* RIGHT CARD – PREVIEW + ADD ATTRIBUTE */}
          <div className="space-y-8">
            
            <div className="space-y-8 h-[680px] bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              {/* Live preview */}
              <div className="h-[200px] bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

                {isMaintenance ? (
                  <div className="border border-yellow-300 bg-yellow-50 text-yellow-800 p-6 rounded-xl shadow-inner">
                    <h3 className="font-bold mb-2">🚧 Maintenance Mode Active</h3>
                    <p>{message || "System is under maintenance."}</p>
                    {showCountdown && endDate && (
                      <p className="mt-2 text-sm">
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

              {/* Create attribute */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Create New Attribute</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                    placeholder="Name"
                    className="border p-2 rounded-lg text-sm"
                  />
                  <input
                    value={attrOption}
                    onChange={(e) => setAttrOption(e.target.value)}
                    placeholder="First Option"
                    className="border p-2 rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    value={attrPrice}
                    onChange={(e) => setAttrPrice(e.target.value)}
                    placeholder="Price (₱)"
                    className="border p-2 rounded-lg text-sm"
                  />
                </div>

                <button
                  onClick={handleAddAttribute}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  + Create Attribute
                </button>
              </div>

              {/* Add option */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Add Option</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={selectedAttrForOption}
                    onChange={(e) => setSelectedAttrForOption(e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  >
                    {attributes.map((a) => (
                      <option key={a.attribute_name} value={a.attribute_name}>
                        {a.attribute_name}
                      </option>
                    ))}
                  </select>

                  <input
                    value={attrOption}
                    onChange={(e) => setAttrOption(e.target.value)}
                    placeholder="Option"
                    className="border p-2 rounded-lg text-sm"
                  />

                  <input
                    type="number"
                    value={attrPrice}
                    onChange={(e) => setAttrPrice(e.target.value)}
                    placeholder="Price (₱)"
                    className="border p-2 rounded-lg text-sm"
                  />
                </div>

                <button
                  onClick={handleAddOption}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────── BOTTOM FULL-WIDTH ATTRIBUTES ───────────────────── */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Existing Attributes</h2>

          {attributes.length === 0 ? (
            <p className="text-sm text-gray-500">No attributes found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {attributes.map((attr) => (
                <div
                  key={attr.attribute_name}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
                >
                  <p className="font-semibold text-gray-800 mb-2">
                    {attr.attribute_name}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {attr.options.map((opt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white border text-xs rounded-full shadow"
                      >
                        {opt.value || opt}
                        {opt.price !== undefined && (
                          <span className="text-blue-600 font-semibold ml-1">
                            ₱{opt.price}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default Maintenance;
