import React, { useMemo, useState } from "react";
import { X, Edit2, Search, Plus, Archive, Trash2, RotateCcw } from "lucide-react";

const SalesAndExpenseSection = () => {
  const [sales, setSales] = useState([
    { id: 1, item: "Service A", amount: 2500, date: "2025-04-10" },
    { id: 2, item: "Service B", amount: 1800, date: "2025-04-12" },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, item: "Rent", amount: 1200, date: "2025-04-08" },
    { id: 2, item: "Supplies", amount: 600, date: "2025-04-11" },
  ]);

  const [archivedSales, setArchivedSales] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // { source, id }
  const [formData, setFormData] = useState({ id: null, item: "", amount: "", date: "" });
  const [isNew, setIsNew] = useState(false);

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveType, setArchiveType] = useState(null); // "sale" | "expense"

  const openEdit = (source, record) => {
    setSelected({ source, id: record.id });
    setIsNew(false);
    setFormData({ ...record });
  };

  const openAdd = (source) => {
    setSelected({ source, id: null });
    setIsNew(true);
    setFormData({ id: null, item: "", amount: "", date: "" });
  };

  const closeEdit = () => {
    setSelected(null);
    setFormData({ id: null, item: "", amount: "", date: "" });
    setIsNew(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: name === "amount" ? Number(value) : value }));
  };

  const handleSave = () => {
    if (!selected) return;

    if (selected.source === "sale") {
      if (isNew) {
        setSales((prev) => [...prev, { ...formData, id: Date.now() }]);
      } else {
        setSales((prev) => prev.map((r) => (r.id === formData.id ? { ...formData } : r)));
      }
    } else {
      if (isNew) {
        setExpenses((prev) => [...prev, { ...formData, id: Date.now() }]);
      } else {
        setExpenses((prev) => prev.map((r) => (r.id === formData.id ? { ...formData } : r)));
      }
    }
    closeEdit();
  };

  const handleDelete = (source, record) => {
    if (source === "sale") {
      setSales((prev) => prev.filter((r) => r.id !== record.id));
      setArchivedSales((prev) => [...prev, record]);
    } else {
      setExpenses((prev) => prev.filter((r) => r.id !== record.id));
      setArchivedExpenses((prev) => [...prev, record]);
    }
  };

  const handleRestore = (source, record) => {
    if (source === "sale") {
      setArchivedSales((prev) => prev.filter((r) => r.id !== record.id));
      setSales((prev) => [...prev, record]);
    } else {
      setArchivedExpenses((prev) => prev.filter((r) => r.id !== record.id));
      setExpenses((prev) => [...prev, record]);
    }
  };

  const filteredSales = useMemo(
    () =>
      sales.filter(
        (r) =>
          r.item.toLowerCase().includes(search.toLowerCase()) ||
          r.date.includes(search)
      ),
    [sales, search]
  );

  const filteredExpenses = useMemo(
    () =>
      expenses.filter(
        (r) =>
          r.item.toLowerCase().includes(search.toLowerCase()) ||
          r.date.includes(search)
      ),
    [expenses, search]
  );

  const sortedArchivedSales = useMemo(
    () => [...archivedSales].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [archivedSales]
  );

  const sortedArchivedExpenses = useMemo(
    () => [...archivedExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [archivedExpenses]
  );

  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] shadow-2xl text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Sales & Expenses
        </h1>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none w-full text-white placeholder-gray-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Sales Section */}
      <Section
        title="Sales"
        data={filteredSales}
        color="text-green-400"
        source="sale"
        openAdd={openAdd}
        openEdit={openEdit}
        handleDelete={handleDelete}
        openArchive={() => { setArchiveType("sale"); setIsArchiveOpen(true); }}
      />

      {/* Expenses Section */}
      <Section
        title="Expenses"
        data={filteredExpenses}
        color="text-red-400"
        source="expense"
        openAdd={openAdd}
        openEdit={openEdit}
        handleDelete={handleDelete}
        openArchive={() => { setArchiveType("expense"); setIsArchiveOpen(true); }}
      />

      {/* Add/Edit Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-2xl w-full max-w-md border border-white/10 relative">
            <button
              onClick={closeEdit}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {isNew
                ? `Add ${selected.source === "sale" ? "Sale" : "Expense"}`
                : `Edit ${selected.source === "sale" ? "Sale" : "Expense"}`}
            </h2>

            <label className="block text-sm text-gray-300 mb-1">Item</label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <label className="block text-sm text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <label className="block text-sm text-gray-300 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-6 rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-white bg-cyan-600 hover:bg-cyan-700 transition"
              >
                {isNew ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {isArchiveOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-2xl w-full max-w-3xl border border-white/10 relative">
            <button
              onClick={() => setIsArchiveOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {archiveType === "sale" ? "Archived Sales" : "Archived Expenses"}
            </h2>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px] text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="py-3 px-6 font-semibold text-gray-300">Item</th>
                    <th className="py-3 px-6 font-semibold text-gray-300">Amount</th>
                    <th className="py-3 px-6 font-semibold text-gray-300">Date</th>
                    <th className="py-3 px-6 font-semibold text-gray-300 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(archiveType === "sale" ? sortedArchivedSales : sortedArchivedExpenses).map((row) => (
                    <tr key={row.id} className="border-b border-white/10 hover:bg-white/10 transition">
                      <td className="py-3 px-6">{row.item}</td>
                      <td className={`py-3 px-6 font-semibold ${archiveType === "sale" ? "text-green-400" : "text-red-400"}`}>
                        ₱{Number(row.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-6">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleRestore(archiveType, row)}
                          className="flex items-center gap-2 bg-cyan-600 px-3 py-1 rounded-lg hover:bg-cyan-700 transition"
                        >
                          <RotateCcw size={16} /> Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(archiveType === "sale" ? sortedArchivedSales : sortedArchivedExpenses).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 px-6 text-center text-gray-400">
                        No archived records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, data, color, source, openAdd, openEdit, handleDelete, openArchive }) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-4">
      <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
      <div className="flex gap-2">
        <button
          onClick={() => openAdd(source)}
          className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
        >
          <Plus size={16} /> Add
        </button>
        <button
          onClick={openArchive}
          className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition"
        >
          <Archive size={16} /> Archive
        </button>
      </div>
    </div>

    <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[720px] text-sm">
        <thead className="bg-white/10">
          <tr>
            <th className="py-3 px-6 font-semibold text-gray-300">Item</th>
            <th className="py-3 px-6 font-semibold text-gray-300">Amount</th>
            <th className="py-3 px-6 font-semibold text-gray-300">Date</th>
            <th className="py-3 px-6 font-semibold text-gray-300 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-white/10 hover:bg-white/10 transition">
              <td className="py-3 px-6">{row.item}</td>
              <td className={`py-3 px-6 font-semibold ${color}`}>
                ₱{Number(row.amount).toLocaleString()}
              </td>
              <td className="py-3 px-6">{new Date(row.date).toLocaleDateString()}</td>
              <td className="py-3 px-6">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openEdit(source, row)}
                    className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-lg hover:bg-slate-600 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(source, row)}
                    className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 px-6 text-center text-gray-400">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default SalesAndExpenseSection;