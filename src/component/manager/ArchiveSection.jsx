import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { Search, List, RotateCcw, Eye, X } from "lucide-react";

/* ================== SAMPLE DATA ================== */
const initialDatasets = {
  orders: [
    {
      enquiry: "O-001",
      product: "Official Receipts",
      name: "Aldrin Portento",
      ordered: "04/11/2025",
      urgency: "04/24/2025",
      price: "₱1,200",
      deleted: "05/10/2025",
    },
    {
      enquiry: "O-002",
      product: "Yearbook Printing",
      name: "Joshua Valenzuela",
      ordered: "04/15/2025",
      urgency: "04/30/2025",
      price: "₱2,500",
      deleted: "05/11/2025",
    },
    {
      enquiry: "O-003",
      product: "Book Cover Design",
      name: "Aaron Ortasel",
      ordered: "04/20/2025",
      urgency: "05/05/2025",
      price: "₱950",
      deleted: "05/12/2025",
    },
  ],

  products: [
    {
      name: "Official Receipts",
      description: "Printed official receipts with serial tracking.",
      deleted: "05/09/2025",
    },
    {
      name: "Yearbook",
      description: "High-quality yearbook printing with matte finish.",
      deleted: "05/12/2025",
    },
    {
      name: "Book",
      description: "Custom paperback and hardbound book printing services.",
      deleted: "05/14/2025",
    },
  ],

  supplies: [
    { name: "Ink Cartridge", quantity: 20, price: "₱800", deleted: "05/11/2025" },
    { name: "Bond Paper (A4)", quantity: 50, price: "₱2,000", deleted: "05/12/2025" },
    { name: "Staple Wires", quantity: 100, price: "₱500", deleted: "05/13/2025" },
  ],
};

/* ================== Reducer for archive state ================== */
const archiveReducer = (state, action) => {
  switch (action.type) {
    case "RESTORE": {
      const { category, identifier, key } = action.payload;
      const updated = state[category].filter((item) => item[key] !== identifier);
      return { ...state, [category]: updated };
    }
    case "SORT_ORDERS": {
      const { asc } = action.payload;
      const sorted = [...state.orders].sort((a, b) =>
        asc ? a.enquiry.localeCompare(b.enquiry) : b.enquiry.localeCompare(a.enquiry)
      );
      return { ...state, orders: sorted };
    }
    default:
      return state;
  }
};

/* ================== Small internal components ================== */

const CategoryTabs = ({ active, onChange }) => {
  const cats = ["orders", "products", "supplies"];
  return (
    <div className="flex gap-3">
      {cats.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          aria-label={`Show ${cat}`}
          className={`capitalize px-4 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
            active === cat
              ? "bg-cyan-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const EmptyState = ({ category }) => {
  const messages = {
    orders: "No deleted orders found.",
    products: "No deleted products found.",
    supplies: "No deleted supplies found.",
  };
  return (
    <div className="p-8 text-center text-gray-500 animate-fadeIn">
      <div className="text-2xl mb-2">📭</div>
      <div className="font-medium">{messages[category]}</div>
      <div className="text-sm mt-1 text-gray-400">
        Try a different category or search term.
      </div>
    </div>
  );
};

/* ================== Main Component ================== */
const ArchiveSection = () => {
  const [category, setCategory] = useState("orders");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [archives, dispatch] = useReducer(archiveReducer, initialDatasets);

  const closeBtnRef = useRef(null);
  const activeData = archives[category] || [];

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return activeData;
    return activeData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(debouncedSearch)
    );
  }, [debouncedSearch, activeData]);

  const handleSort = useCallback(() => {
    if (category !== "orders") return;
    dispatch({ type: "SORT_ORDERS", payload: { asc: sortAsc } });
    setSortAsc((s) => !s);
  }, [category, sortAsc]);

  const handleRestore = useCallback(
    (identifier) => {
      const key = category === "orders" ? "enquiry" : "name";
      if (!identifier) return;
      if (!window.confirm("Are you sure you want to restore this record?")) return;

      dispatch({ type: "RESTORE", payload: { category, identifier, key } });
      setToast({ text: "Item restored successfully" });
      setTimeout(() => setToast(null), 2500);
    },
    [category]
  );

  useEffect(() => {
    if (!selectedItem) return;
    const onKey = (e) => e.key === "Escape" && setSelectedItem(null);
    document.addEventListener("keydown", onKey);
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedItem]);

  const renderHeaders = () => {
    switch (category) {
      case "orders":
        return (
          <>
            <th className="py-3 px-6">Enquiry No.</th>
            <th className="py-3 px-6">Product/Service</th>
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Date Ordered</th>
            <th className="py-3 px-6">Urgency</th>
            <th className="py-3 px-6">Price</th>
            <th className="py-3 px-6">Date Deleted</th>
            <th className="py-3 px-6">Action</th>
          </>
        );
      case "products":
        return (
          <>
            <th className="py-3 px-6">Product Name</th>
            <th className="py-3 px-6">Description</th>
            <th className="py-3 px-6">Date Deleted</th>
            <th className="py-3 px-6">Action</th>
          </>
        );
      case "supplies":
        return (
          <>
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Quantity</th>
            <th className="py-3 px-6">Price</th>
            <th className="py-3 px-6">Date Deleted</th>
            <th className="py-3 px-6">Action</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderRow = (item) => {
    switch (category) {
      case "orders":
        return (
          <>
            <td className="py-3 px-6">{item.enquiry}</td>
            <td className="py-3 px-6">{item.product}</td>
            <td className="py-3 px-6">{item.name}</td>
            <td className="py-3 px-6">{item.ordered}</td>
            <td className="py-3 px-6">{item.urgency}</td>
            <td className="py-3 px-6">{item.price}</td>
            <td className="py-3 px-6 text-gray-600">{item.deleted}</td>
          </>
        );
      case "products":
        return (
          <>
            <td className="py-3 px-6 font-medium">{item.name}</td>
            <td className="py-3 px-6 text-gray-600">{item.description}</td>
            <td className="py-3 px-6 text-gray-600">{item.deleted}</td>
          </>
        );
      case "supplies":
        return (
          <>
            <td className="py-3 px-6 font-medium">{item.name}</td>
            <td className="py-3 px-6">{item.quantity}</td>
            <td className="py-3 px-6">{item.price}</td>
            <td className="py-3 px-6 text-gray-600">{item.deleted}</td>
          </>
        );
      default:
        return null;
    }
  };

  const getIdentifier = (item) => item.enquiry || item.name || item.quantity;

  return (
    <div className="p-6 bg-white min-h-screen transition-all">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">Archive</h1>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <CategoryTabs active={category} onChange={setCategory} />

        <div className="relative w-full sm:w-64">
          <input
            id="archive-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {category === "orders" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSort}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <List size={18} /> Sort by Enquiry
          </button>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {filteredData.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>{renderHeaders()}</tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr
                  key={getIdentifier(item) + "-" + idx}
                  className="border-b hover:bg-cyan-50 transition"
                >
                  {renderRow(item)}
                  <td className="py-3 px-6 flex gap-2">
                    <button
                      aria-label={`Restore ${item.name || item.enquiry}`}
                      onClick={() => handleRestore(getIdentifier(item))}
                      className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <RotateCcw size={16} /> Restore
                    </button>
                    <button
                      aria-label={`View details for ${item.name || item.enquiry}`}
                      onClick={() => setSelectedItem({ ...item, _category: category })}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal with soft frosted background */}
      {selectedItem && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-white/40 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedItem._category || category} details`}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative animate-fadeInScale">
            <button
              ref={closeBtnRef}
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800 capitalize">
              {selectedItem._category || category} Details
            </h2>

            <div className="grid grid-cols-1 gap-2 text-gray-700">
              {Object.entries(selectedItem)
                .filter(([k]) => !["_category"].includes(k))
                .map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <div className="w-36 text-gray-500 capitalize">
                      {key.replace("_", " ")}:
                    </div>
                    <div className="font-medium">{String(value)}</div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleRestore(getIdentifier(selectedItem));
                  setSelectedItem(null);
                }}
                className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <RotateCcw size={16} /> Restore
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          aria-live="polite"
          className="fixed right-6 bottom-6 z-50 pointer-events-none bg-white rounded-md shadow-lg px-4 py-2 border border-gray-200 animate-fadeIn"
        >
          <div className="text-sm text-gray-800">{toast.text}</div>
        </div>
      )}
    </div>
  );
};

export default ArchiveSection;
