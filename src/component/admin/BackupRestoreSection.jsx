import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, UploadCloud, Database } from "lucide-react";
import { useToast } from "../ui/ToastProvider.jsx";

const BackupRestoreSection = () => {
  const [scheduled, setScheduled] = useState(true);
  const [frequency, setFrequency] = useState("Weekly");
  const [time, setTime] = useState("02:00");
  const [retention, setRetention] = useState("1 month");
  const [scope, setScope] = useState("All");
  const [backups, setBackups] = useState([]);
  const [restores, setRestores] = useState([]);
  const { showToast } = useToast();

  const backupListUrl = "http://localhost:5000/api/backup/list-db";
  const restoreListUrl = "http://localhost:5000/api/backup/restore/list-db";

  // Fetch function must be defined BEFORE useEffect
  const fetchData = async () => {
    try {
      const [backupRes, restoreRes] = await Promise.all([
        fetch(backupListUrl),
        fetch(restoreListUrl),
      ]);

      const backupData = await backupRes.json();
      const restoreData = await restoreRes.json();

      setBackups(Array.isArray(backupData) ? backupData : backupData.data || []);
      setRestores(Array.isArray(restoreData) ? restoreData : restoreData.data || []);
    } catch (error) {
      console.error("Error fetching backup/restore data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create Backup
  const handleCreateBackup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/backup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("Backup created successfully", "success");

        setBackups((prev) => [
          {
            created_at: new Date().toLocaleString(),
            filename: data.filename,
            size: "Pending...",
            status: "Success",
            scope,
          },
          ...prev,
        ]);
      } else {
        showToast("Backup failed", "error");
      }
    } catch (err) {
      console.error("Error creating backup:", err);
      showToast("Backup failed", "error");
    }
  };

  // Download Backup File
  const handleDownload = (filename) => {
    window.open(
      `http://localhost:5000/api/backup/download/${filename}`,
      "_blank"
    );
  };

  // Delete Backup
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this backup?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/backup/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showToast("Backup deleted", "success");
        setBackups((prev) => prev.filter((b) => b.id !== id));
      } else {
        showToast("Failed to delete backup", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting backup", "error");
    }
  };

  // Restore Backup
  const handleRestore = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/backup/restore", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setRestores((prev) => [
        {
          restored_at: new Date().toLocaleString(),
          performed_by: "Admin",
          status: data.success ? "Success" : "Failed",
        },
        ...prev,
      ]);

      showToast(data.message, data.success ? "success" : "error");
    } catch (err) {
      console.error("Error restoring backup:", err);
      showToast("Restore failed", "error");
    }
  };

  const statusColor = (status) =>
    status === "Success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-white p-10 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-cyan-700 flex items-center gap-3">
          <Database size={36} />
          Backup & Restore
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Secure your <strong>Sales</strong>, <strong>Expenses</strong>,{" "}
          <strong>Products</strong>, and <strong>Users</strong> data with
          scheduled backups and quick restores.
        </p>
      </div>

      {/* Backup Controls */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow-inner space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleCreateBackup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition"
          >
            Create Backup
          </button>

          {/* Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Scheduled Backups
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={scheduled}
                onChange={() => setScheduled(!scheduled)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all relative">
                <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform peer-checked:translate-x-7" />
              </div>
            </label>
            <span className="text-sm text-gray-600">
              {scheduled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Sales</option>
            <option>Expenses</option>
            <option>Products</option>
            <option>Users</option>
          </select>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="00:00">12:00 AM</option>
            <option value="02:00">2:00 AM</option>
            <option value="06:00">6:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>

          <select
            value={retention}
            onChange={(e) => setRetention(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option>1 week</option>
            <option>1 month</option>
            <option>3 months</option>
          </select>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Backup History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">File</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.created_at}</td>
                  <td className="p-3">{b.filename}</td>
                  <td className="p-3">{b.size}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleDownload(b.filename)}
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {backups.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    No backups available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restore Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Restore</h2>
        <label
          htmlFor="upload"
          className="flex w-[250px] items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2 rounded-lg cursor-pointer transition"
        >
          <UploadCloud size={18} />
          Upload Backup File
        </label>
        <input
          id="upload"
          type="file"
          className="hidden"
          onChange={(e) => handleRestore(e.target.files[0])}
        />

        <table className="min-w-full text-sm mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Performed by</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {restores.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{r.restored_at}</td>
                <td className="p-3">{r.performed_by}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {restores.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-6">
                  No restore history
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BackupRestoreSection;
