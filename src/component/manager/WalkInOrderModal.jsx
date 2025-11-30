import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../api";

function WalkInOrderModal({
  show,
  onClose,
  onSubmit,
  newOrder,
  setNewOrder,
  selectedProduct,
  setSelectedProduct,
  orderFiles,
  setOrderFiles,
  showSizeDropdown, // kept for compatibility if you want to reuse later
  setShowSizeDropdown,
  products = [],
}) {
  const [productAttributes, setProductAttributes] = useState([]);
  const [autoPrice, setAutoPrice] = useState(0);

  // --------------------------
  // Load attributes for product
  // --------------------------
  useEffect(() => {
    if (!selectedProduct) {
      setProductAttributes([]);
      return;
    }

    const loadAttributes = async () => {
      try {
        const res = await fetch(
          `${API_URL}/attributes/product/${selectedProduct}/full`
        );
        const data = await res.json();

        const blocked = [
          "name",
          "email",
          "location",
          "contact",
          "phone",
          "note",
          "message",
        ];

        const filtered = (data || []).filter(
          (a) =>
            !blocked.some((b) =>
              (a.attribute_name || "").toLowerCase().includes(b)
            )
        );

        setProductAttributes(filtered);

        // set defaults for each attribute (only in newOrder)
        setNewOrder((prev) => {
          const updated = { ...prev };
          filtered.forEach((attr) => {
            const first = attr.options?.[0];
            const val =
              typeof first === "string"
                ? first
                : first?.option_value || first?.value || "";
            if (val && !updated[attr.attribute_name]) {
              updated[attr.attribute_name] = val;
            }
          });
          return updated;
        });
      } catch (err) {
        console.error("❌ Error loading product attributes (walk-in):", err);
      }
    };

    loadAttributes();
  }, [selectedProduct, setNewOrder]);

  // --------------------------
  // Auto estimate (simple rule)
  // --------------------------
  useEffect(() => {
    if (!selectedProduct) {
      setAutoPrice(0);
      return;
    }

    const qty = Number(newOrder.quantity || 0);
    if (!qty) {
      setAutoPrice(0);
      return;
    }

    // base price from product (if any)
    const prod = products.find(
      (p) => String(p.product_id) === String(selectedProduct)
    );
    const basePerCopy = prod && prod.base_price ? Number(prod.base_price) : 0;
    let total = basePerCopy * qty;

    // add price from selected attribute options
    productAttributes.forEach((attr) => {
      const selValue = newOrder[attr.attribute_name];
      if (!selValue) return;

      const opt = (attr.options || []).find((o) => {
        const val =
          typeof o === "string" ? o : o.option_value || o.value || "";
        return val === selValue;
      });

      if (!opt || typeof opt === "string") return;

      const price = Number(opt.price || 0);
      total += price * qty;
    });

    setAutoPrice(total);
  }, [selectedProduct, products, productAttributes, newOrder]);

  // Safely get the selected product object
  const selectedProductObj = products.find(
    (p) => String(p.product_id) === String(selectedProduct)
  );

  const finalPrice = newOrder.price
    ? Number(newOrder.price)
    : Number(autoPrice || 0);

  // Local submit with basic validation (no UI changes)
  const handleSubmit = () => {
    if (!newOrder.customer_name || !newOrder.service || !newOrder.price) {
      alert("Please fill out customer name, service, and price.");
      return;
    }

    // Build REAL FormData
    const form = new FormData();

    form.append("order_type", "walk-in");
    form.append("user_id", "");
    form.append("product_id", newOrder.product_id);
    form.append("quantity", newOrder.quantity || 1);
    form.append("status", "Pending");
    form.append("estimated_price", Number(newOrder.price));

    form.append("walk_in_name", newOrder.customer_name);
    form.append("walk_in_email", newOrder.email || "");
    form.append("walk_in_contact", newOrder.contact_number || "");
    form.append("walk_in_location", newOrder.location || "");

    // Attributes array
    form.append(
      "attributes",
      JSON.stringify(
        productAttributes.map((a) => ({
          name: a.attribute_name,
          value: newOrder[a.attribute_name] || "",
        }))
      )
    );

    // Attach files
    orderFiles.forEach((file) => {
      form.append("files", file);
    });

    // Send FormData to parent handler
    onSubmit(form);
  };


  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
          >
            {/* HEADER */}
            <h2 className="text-3xl font-extrabold text-cyan-700 text-center mb-6">
              Add Walk-In Order
            </h2>

            {/* CUSTOMER INFORMATION */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newOrder.customer_name}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      customer_name: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={newOrder.email}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newOrder.contact_number}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      contact_number: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={newOrder.location}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* PRODUCT SECTION */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Select Product & Options
              </h3>

              {/* Product Dropdown (dynamic) */}
              <select
                value={selectedProduct || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedProduct(value);

                  const prod = products.find(
                    (p) => String(p.product_id) === String(value)
                  );
                  setNewOrder((prev) => ({
                    ...prev,
                    service: prod ? prod.product_name : "",
                    product_id: prod ? prod.product_id : null,
                  }));
                }}
                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">Choose Product...</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_name}
                  </option>
                ))}
              </select>

              {/* Product-specific fields */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Number of Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="e.g. 100"
                  />
                </div>

                {/* Optional free-form details */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Extra Details (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newOrder.details || ""}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        details: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    placeholder="Notes about this job..."
                  />
                </div>
              </div>

              {/* Dynamic attributes based on product */}
              {selectedProductObj && productAttributes.length > 0 && (
                <div className="mt-5 border border-gray-200 rounded-xl p-4 bg-white max-h-64 overflow-y-auto">
                  <p className="text-xs text-gray-500 mb-2">
                    These fields depend on the selected product. They are the
                    same attributes customers can select online.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productAttributes.map((attr) => (
                      <div key={attr.attribute_id}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {attr.attribute_name}
                        </label>

                        {attr.input_type === "select" ? (
                          <select
                            className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                            value={newOrder[attr.attribute_name] || ""}
                            onChange={(e) =>
                              setNewOrder((prev) => ({
                                ...prev,
                                [attr.attribute_name]: e.target.value,
                              }))
                            }
                          >
                            {(attr.options || [])
                              .filter(
                                (opt) => opt.option_value || opt.value || opt
                              )
                              .map((opt, i) => {
                                const val =
                                  typeof opt === "string"
                                    ? opt
                                    : opt.option_value || opt.value;
                                return (
                                  <option key={i} value={val}>
                                    {val}
                                  </option>
                                );
                              })}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                            value={newOrder[attr.attribute_name] || ""}
                            onChange={(e) =>
                              setNewOrder((prev) => ({
                                ...prev,
                                [attr.attribute_name]: e.target.value,
                              }))
                            }
                            placeholder={`Enter ${attr.attribute_name}`}
                          />
                        )}

                        {/* Show per-option extra price note if it's select */}
                        {attr.input_type === "select" && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            {(() => {
                              const sel = newOrder[attr.attribute_name];
                              const opt = (attr.options || []).find((o) => {
                                const v =
                                  typeof o === "string"
                                    ? o
                                    : o.option_value || o.value || "";
                                return v === sel;
                              });
                              if (!opt || typeof opt === "string") return null;
                              const p = Number(opt.price || 0);
                              if (!p) return null;
                              return `+₱${p.toFixed(2)} per copy`;
                            })()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FILE UPLOAD */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Upload Files (Optional)
              </h3>

              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setOrderFiles(Array.from(e.target.files || []))}
                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
              />

              {orderFiles && orderFiles.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {orderFiles.length} file(s) selected.
                </p>
              )}
            </div>

            {/* PRICE SUMMARY */}
            <div className="bg-green-50 border border-green-300 rounded-2xl p-4 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">
                    System Estimated Price (based on attributes)
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    ₱{Number(autoPrice || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    You can override this below. Final price will be saved to
                    the order.
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 text-right sm:text-left">
                    Final Price (required)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newOrder.price}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-xl px-3 py-2 w-full text-right focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Enter final agreed price"
                  />
                </div>
              </div>

              <div className="mt-3 text-center">
                <p className="text-lg font-extrabold text-green-800">
                  Total to be recorded: ₱{finalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium shadow-sm transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md transition"
              >
                Add Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WalkInOrderModal;