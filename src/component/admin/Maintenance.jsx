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

  // 🔹 Attributes state
  const [attributes, setAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [attrOption, setAttrOption] = useState("");
  const [attrPrice, setAttrPrice] = useState("");
  const [selectedAttrForOption, setSelectedAttrForOption] = useState("");

  // 🔹 Modal for quick inputs (Name, Email, etc.)
  const [showAttrModal, setShowAttrModal] = useState(false);
  const [modalAttrName, setModalAttrName] = useState("");
  const [modalAttrOption, setModalAttrOption] = useState("N/A");

  // Quick presets for inputs
  const fillPreset = (type) => {
    const presets = {
      name: "Name",
      email: "Email",
      location: "Location",
      contact: "Contact Number",
      notes: "Notes / Message",
    };
    setModalAttrName(presets[type]);
    setModalAttrOption("N/A");
  };

  // 🔹 Group attributes (UI-only grouping)
  const groupAttributes = (attrs) => {
    const contactKeys = [
      "name",
      "email",
      "location",
      "contact number",
      "contact #",
      "notes",
      "notes / message",
      "message",
      "phone",
    ];

    const contact = [];
    const others = [];

    attrs.forEach((attr) => {
      const key = (attr.attribute_name || "").toLowerCase();
      if (contactKeys.some((k) => key.includes(k))) {
        contact.push(attr);
      } else {
        others.push(attr);
      }
    });

    return { contact, others };
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/maintenance/status`);
        const data = await res.json();
        setIsMaintenance(data.maintenance || false);
        setMessage(data.message || "");
        setEndDate(data.endTime || "");
        setShowCountdown(data.showCountdown || false);
      } catch (err) {
        console.error("❌ Failed to fetch maintenance status:", err);
      }
    };

    const fetchAttributes = async () => {
      try {
        const res = await fetch(`${API_URL}/attributes`);
        const data = await res.json();
        setAttributes(data || []);
        if (!selectedAttrForOption && data && data.length > 0) {
          setSelectedAttrForOption(data[0].attribute_name);
        }
      } catch (err) {
        console.error("❌ Failed to fetch attributes:", err);
      }
    };

    fetchStatus();
    fetchAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAttributes = async () => {
    try {
      const res = await fetch(`${API_URL}/attributes`);
      const data = await res.json();
      setAttributes(data || []);
      if (!selectedAttrForOption && data && data.length > 0) {
        setSelectedAttrForOption(data[0].attribute_name);
      }
    } catch (err) {
      console.error("❌ Failed to refresh attributes:", err);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ You must be logged in as admin to change maintenance settings.");
        return;
      }

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
          body: JSON.stringify({}),
        });
      }

      showToast("Maintenance configuration saved to backend!");
    } catch (error) {
      console.error("Failed to save maintenance:", error);
      alert("Failed to save maintenance configuration");
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  // 🔹 Admin: add new attribute + first option (manual, with price)
  const handleAddAttribute = async () => {
    if (!attrName.trim() || !attrOption.trim()) {
      alert("Attribute name and first option are required.");
      return;
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
      await refreshAttributes();
      showToast("New attribute created!");
    } catch (err) {
      console.error("❌ Failed to create attribute:", err);
      alert("Failed to create attribute");
    }
  };

  // 🔹 Save attribute from modal (Name, Email, etc.) — no price (will default 0)
  const saveModalAttribute = async () => {
    if (!modalAttrName.trim()) {
      alert("Attribute name is required.");
      return;
    }

    try {
      await fetch(`${API_URL}/attributes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attribute_name: modalAttrName.trim(),
          option_value: modalAttrOption.trim() || "N/A",
          // no price here (contact info), backend can default to 0
        }),
      });

      setModalAttrName("");
      setModalAttrOption("N/A");
      setShowAttrModal(false);

      await refreshAttributes();
      showToast("New attribute added!");
    } catch (err) {
      console.error("❌ Failed:", err);
      alert("Failed to add attribute.");
    }
  };

  // 🔹 Admin: add option to existing attribute (with price)
  const handleAddOption = async () => {
    if (!selectedAttrForOption || !attrOption.trim()) {
      alert("Select an attribute and type an option.");
      return;
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
      await refreshAttributes();
      showToast("Option added to attribute!");
    } catch (err) {
      console.error("❌ Failed to add option:", err);
      alert("Failed to add option");
    }
  };

  const { contact, others } = groupAttributes(attributes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen bg-white text-gray-900 flex justify-center p-6"
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-6">
          Maintenance & Attributes Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left section - Maintenance settings */}
          <div className="space-y-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
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
                <span className="text-sm text-gray-600">
                  Show countdown timer
                </span>
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

          {/* Right section - Live Preview + Attributes */}
          <div className="space-y-8">
            {/* Live Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              {isMaintenance ? (
                <div className="border border-yellow-300 bg-yellow-50 text-yellow-800 p-6 rounded-xl shadow-inner">
                  <h3 className="font-bold mb-2">🚧 Maintenance Mode Active</h3>
                  <p>
                    {message ||
                      "System is under maintenance. Please check back later."}
                  </p>
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
                <p className="text-gray-500">
                  Maintenance mode is <b>OFF</b>.
                </p>
              )}
            </div>

            {/* Product Attribute Management — Redesigned UI */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md w-full">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-5">
                <span className="w-2 h-6 bg-blue-500 rounded-md"></span>
                Product Attribute Management
              </h2>

              {/* ADD NEW ATTRIBUTE */}
              <div className="border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Create a new attribute and add its first option with an optional price.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                    placeholder="Attribute name"
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                  />

                  <input
                    type="text"
                    value={attrOption}
                    onChange={(e) => setAttrOption(e.target.value)}
                    placeholder="First option"
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                  />

                  <input
                    type="number"
                    value={attrPrice}
                    onChange={(e) => setAttrPrice(e.target.value)}
                    placeholder="Price (₱)"
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setShowAttrModal(true)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
                  >
                    + Add Input (Name / Email / etc.)
                  </button>

                  <button
                    onClick={handleAddAttribute}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    + Create Attribute
                  </button>
                </div>
              </div>

              {/* ADD OPTION TO EXISTING ATTRIBUTE */}
              <div className="border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Add additional options to an existing attribute.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={selectedAttrForOption}
                    onChange={(e) => setSelectedAttrForOption(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select attribute</option>
                    {attributes.map((attr) => (
                      <option key={attr.attribute_name} value={attr.attribute_name}>
                        {attr.attribute_name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={attrOption}
                    onChange={(e) => setAttrOption(e.target.value)}
                    placeholder="Option value"
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                  />

                  <input
                    type="number"
                    value={attrPrice}
                    onChange={(e) => setAttrPrice(e.target.value)}
                    placeholder="Price (₱)"
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <button
                  onClick={handleAddOption}
                  className="mt-3 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  + Add Option
                </button>
              </div>

              {/* ATTRIBUTE LIST DISPLAY */}
              <div className="border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Existing Attributes
                </h3>

                {attributes.length === 0 ? (
                  <p className="text-xs text-gray-500">No attributes available.</p>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">

                    {/* CONTACT GROUP */}
                    {contact.length > 0 && (
                      <div className="border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                        <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                          Contact Information (No pricing)
                        </p>
                        {contact.map((attr) => (
                          <div key={attr.attribute_name} className="mb-3">
                            <p className="text-sm font-bold text-gray-700">
                              {attr.attribute_name}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {attr.options.map((opt, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-xs rounded-full"
                                >
                                  {typeof opt === "string" ? opt : opt.value}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* OTHER ATTRIBUTES */}
                    {others.length > 0 && (
                      <div className="border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
                          Order Details & Custom Attributes
                        </p>

                        {others.map((attr) => (
                          <div key={attr.attribute_name} className="mb-3">
                            <p className="text-sm font-bold text-gray-700">
                              {attr.attribute_name}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-1">
                              {attr.options.map((opt, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-xs rounded-full"
                                >
                                  {opt.value}{" "}
                                  <span className="text-blue-600 font-semibold">
                                    ₱{opt.price}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Modal for quick Name/Email/Location/etc inputs */}
        {showAttrModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Input Field
                </h2>
                <button onClick={() => setShowAttrModal(false)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Preset Buttons */}
              <p className="text-xs text-gray-500 mb-2">
                Quick presets for common fields:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => fillPreset("name")}
                  className="px-3 py-2 text-xs rounded-lg border bg-gray-50 hover:bg-gray-100"
                >
                  Name
                </button>
                <button
                  onClick={() => fillPreset("email")}
                  className="px-3 py-2 text-xs rounded-lg border bg-gray-50 hover:bg-gray-100"
                >
                  Email
                </button>
                <button
                  onClick={() => fillPreset("location")}
                  className="px-3 py-2 text-xs rounded-lg border bg-gray-50 hover:bg-gray-100"
                >
                  Location
                </button>
                <button
                  onClick={() => fillPreset("contact")}
                  className="px-3 py-2 text-xs rounded-lg border bg-gray-50 hover:bg-gray-100"
                >
                  Contact #
                </button>
                <button
                  onClick={() => fillPreset("notes")}
                  className="px-3 py-2 text-xs rounded-lg border bg-gray-50 hover:bg-gray-100 col-span-2"
                >
                  Notes / Message
                </button>
              </div>

              {/* Name Input */}
              <label className="block text-sm font-medium mb-1">
                Attribute Name
              </label>
              <input
                value={modalAttrName}
                onChange={(e) => setModalAttrName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
                placeholder="e.g., Name, Email, Location"
              />

              {/* Option Input */}
              <label className="block text-sm font-medium mb-1">
                Default Option
              </label>
              <input
                value={modalAttrOption}
                onChange={(e) => setModalAttrOption(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-6 text-sm"
                placeholder="e.g., N/A"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAttrModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={saveModalAttribute}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Save Attribute
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Maintenance;