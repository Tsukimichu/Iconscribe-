import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  X,
  Edit2,
  Search,
  Plus,
  Archive,
  Trash2,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000/api/sales";

const SalesAndExpenseSection = () => {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [archivedSales, setArchivedSales] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ id: null, item: "", amount: "", date: "" });
  const [isNew, setIsNew] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveType, setArchiveType] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // =====================================================
  // Fetch sales data from backend
  // =====================================================
  const fetchSales = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) setSales(res.data.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

      // Fetch orders from backend for dropdown
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/orders");
          if (res.data) setOrders(res.data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };
      fetchOrders();
    }, []);


  // =====================================================
  // Computed totals
  // =====================================================
  const totalSales = useMemo(() => sales.reduce((sum, s) => sum + Number(s.amount), 0), [sales]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
  const profit = totalSales - totalExpenses;

  // =====================================================
  // Add or Edit
  // =====================================================
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

  const handleSave = async () => {
    if (!formData.item.trim() || !formData.amount || !formData.date) {
      return alert("All fields are required");
    }

    try {
      if (isNew) {
        // Add new sale
        await axios.post(API_URL, {
          order_item_id: null,
          item: formData.item,
          amount: formData.amount,
          date: formData.date,
        });
      } else {
        // Update existing sale
        await axios.put(`${API_URL}/${formData.id}`, {
          item: formData.item,
          amount: formData.amount,
          date: formData.date,
        });
      }
      fetchSales();
      closeEdit();
    } catch (err) {
      console.error("Error saving sale:", err);
      alert("Failed to save record.");
    }
  };

  // =====================================================
  // Delete sale
  // =====================================================
  const handleDelete = (source, record) => {
    setConfirmDelete({ source, record });
  };

  const confirmDeleteAction = async () => {
    const { source, record } = confirmDelete;
    try {
      await axios.delete(`${API_URL}/${record.id}`);
      fetchSales();
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting sale:", err);
    }
  };

  // =====================================================
  // Filter + Sort
  // =====================================================
  const filterAndSort = (data) => {
    let filtered = data.filter(
      (r) => r.item.toLowerCase().includes(search.toLowerCase()) || r.date.includes(search)
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      return a.item.localeCompare(b.item);
    });
  };

  const filteredSales = useMemo(() => filterAndSort(sales), [sales, search, sortBy]);
  const filteredExpenses = useMemo(() => filterAndSort(expenses), [expenses, search, sortBy]);

  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-white shadow-xl min-h-screen text-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-4xl font-extrabold text-cyan-700 tracking-tight">Sales & Expenses</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <button
              onClick={() =>
                setSortBy((prev) =>
                  prev === "date" ? "amount" : prev === "amount" ? "item" : "date"
                )
              }
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Sort: {sortBy} <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Sales" value={totalSales} color="text-green-600" />
        <SummaryCard title="Total Expenses" value={totalExpenses} color="text-red-600" />
        <SummaryCard
          title="Profit"
          value={profit}
          color={profit >= 0 ? "text-green-700" : "text-red-700"}
        />
      </div>

      <Section
        title="Sales"
        data={filteredSales}
        color="text-green-600"
        source="sale"
        openAdd={openAdd}
        openEdit={openEdit}
        handleDelete={handleDelete}
        openArchive={() => {
          setArchiveType("sale");
          setIsArchiveOpen(true);
        }}
      />

      {/* Expenses section (you can connect later to backend) */}
      <Section
        title="Expenses"
        data={filteredExpenses}
        color="text-red-600"
        source="expense"
        openAdd={openAdd}
        openEdit={openEdit}
        handleDelete={handleDelete}
        openArchive={() => {
          setArchiveType("expense");
          setIsArchiveOpen(true);
        }}
      />

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {selected && (
          <Modal onClose={closeEdit}>
            <h2 className="text-lg font-semibold mb-4">
              {isNew
                ? `Add ${selected.source === "sale" ? "Sale" : "Expense"}`
                : `Edit ${selected.source === "sale" ? "Sale" : "Expense"}`}
            </h2>
            
            <label className="block text-sm font-medium mb-1">Select Order</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none mb-4"
              value={formData.order_item_id || ""}
              onChange={(e) => {
                const selected = orders.find((o) => o.id === parseInt(e.target.value));
                setFormData((prev) => ({
                  ...prev,
                  order_item_id: e.target.value,
                  item: selected?.service || "",
                  amount: selected?.price || "",
                }));
              }}
            >
              <option value="">Select order...</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.enquiryNo} - {o.customer_name}
                </option>
              ))}
            </select>

            <FormInput label="Item" name="item" value={formData.item} onChange={handleChange} />

            <FormInput
              label="Amount (₱)"
              type="number"
              min="1"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <FormInput
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={closeEdit}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {isNew ? "Add" : "Save"}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <Modal onClose={() => setConfirmDelete(null)}>
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDelete.record.item}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteAction}>
                Delete
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// UI Components
const SummaryCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
  >
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>₱{value.toLocaleString()}</p>
  </motion.div>
);

const Section = ({ title, data, color, source, openAdd, openEdit, handleDelete }) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-4">
      <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
      <Button variant="primary" onClick={() => openAdd(source)} icon={<Plus size={16} />}>
        Add
      </Button>
    </div>
    <Table data={data} color={color} onEdit={(row) => openEdit(source, row)} onDelete={(row) => handleDelete(source, row)} />
  </div>
);

const Table = ({ data, color, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto mt-6">
    <table className="w-full text-left border-collapse min-w-[800px] text-sm">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th className="py-3 px-6 font-semibold text-gray-700">Item</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Quantity</th>
          <th className="py-3 px-6 font-semibold text-gray-700 text-right">Amount</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Date</th>
          <th className="py-3 px-6 font-semibold text-gray-700 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr
              key={row.id || index}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
             <td className="py-3 px-6">
              {(() => {
                const match = row.item.match(/^(.*)\s+x(\d+)$/i);
                if (match) {
                  const [, name,] = match;
                  return (
                    <>
                      <span className="font-medium text-gray-800">{name.trim()}</span>
                    </>
                  );
                } else {
                  return <span className="font-medium text-gray-800">{row.item}</span>;
                }
              })()}
            </td>

              <td className="py-3 px-6">
              {(() => {
                const match = row.item.match(/^(.*)\s+x(\d+)$/i);
                if (match) {
                  const [, , qty] = match;
                  return (
                    <>
                      <span className="font-medium text-gray-800">{qty}</span>
                    </>
                  );
                } else {
                  return <span className="font-medium text-gray-800">{row.item}</span>;
                }
              })()}
            </td>


              <td className={`py-3 px-6 font-semibold text-right ${color}`}>
                ₱{Number(row.amount).toLocaleString()}
              </td>

              <td className="py-3 px-6">
                {new Date(row.date).toLocaleDateString()}
              </td>

              <td className="py-3 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="py-6 text-center text-gray-500 italic">
              No records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);




const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white text-gray-900 rounded-2xl p-6 shadow-2xl w-full max-w-lg border relative"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X size={20} />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

const Button = ({ children, variant, onClick, icon }) => {
  const base = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition";
  const styles = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {icon} {children}
    </button>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
      required
    />
  </div>
);

export default SalesAndExpenseSection;
