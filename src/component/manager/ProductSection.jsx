import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, List, X, Edit, Image as ImageIcon } from "lucide-react";
import { API_URL } from "../../api.js";

// 🔹 FINAL FIX A — use SOCKET URL for correct image path
const BASE_URL = import.meta.env.VITE_SOCKET_URL;

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  default: "bg-green-100 text-green-700",
};

const ProductSection = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("General");
  const [status, setStatus] = useState("active");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  // --------------------------------------------------
  // Load products + attributes
  // --------------------------------------------------
  useEffect(() => {
    fetchProducts();
    fetchAttributes();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();

      const normalized = (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        status: (p.status || "Active").toLowerCase(),
      }));

      setServices(normalized);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const fetchAttributes = async () => {
    try {
      const res = await fetch(`${API_URL}/attributes`);
      const data = await res.json();

      const safe = (data || []).map((a) => ({
        ...a,
        options: Array.isArray(a.options) ? a.options : [],
      }));

      setAvailableAttributes(safe);
    } catch (err) {
      console.error("Error loading attributes:", err);
    }
  };

  // --------------------------------------------------
  // Status Toggle
  // --------------------------------------------------
  const updateProductStatus = async (productId, newStatus) => {
    setServices((prev) =>
      prev.map((s) =>
        s.product_id === productId ? { ...s, status: newStatus } : s
      )
    );

    try {
      await fetch(`${API_URL}/products/${productId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Error updating product status:", err);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.product_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || s.status === filter;

    return matchesSearch && matchesFilter;
  });

  // --------------------------------------------------
  // Load product attributes
  // --------------------------------------------------
  const loadProductAttributes = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/attributes/product/${productId}`);
      const data = await res.json();

      setSelectedAttributes((data || []).map((a) => a.attribute_name));
    } catch (err) {
      console.error("Error loading product attributes:", err);
    }
  };

  // --------------------------------------------------
  // Open Popup
  // --------------------------------------------------
  const openPopup = (type, service = null) => {
    setPopupType(type);
    setSelectedService(service);

    if (type === "edit" && service) {
      setTitle(service.product_name);
      setDescription(service.description || "");
      setProductType(service.product_type || "General");
      setStatus(service.status || "active");

      setImage(null);

      // 🔥 FINAL IMAGE FIX (using VITE_SOCKET_URL)
      setImagePreview(
        service.image ? `${BASE_URL}/uploads/products/${service.image}` : null
      );

      loadProductAttributes(service.product_id);
    } else {
      setTitle("");
      setDescription("");
      setProductType("General");
      setStatus("active");
      setImage(null);
      setImagePreview(null);
      setSelectedAttributes([]);
    }

    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setSelectedService(null);

    setTitle("");
    setDescription("");
    setProductType("General");
    setStatus("active");
    setImage(null);
    setImagePreview(null);
    setSelectedAttributes([]);
    setIsSaving(false);
  };

  // --------------------------------------------------
  // Save attributes
  // --------------------------------------------------
  const saveAttributesForProduct = async (productId) => {
    try {
      await fetch(`${API_URL}/attributes/product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attributes: selectedAttributes }),
      });
    } catch (err) {
      console.error("Error saving attributes:", err);
    }
  };

  // --------------------------------------------------
  // Submit Create / Edit
  // --------------------------------------------------
  const handleConfirm = async () => {
    const dbStatus = status === "inactive" ? "Inactive" : "Active";

    try {
      setIsSaving(true);

      // CREATE
      if (popupType === "create") {
        if (!title.trim()) {
          alert("Product name is required");
          setIsSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append("product_name", title.trim());
        formData.append("description", description.trim());
        formData.append("product_type", productType);
        formData.append("status", dbStatus);

        if (image) formData.append("image", image);

        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          body: formData,
        });

        const newProduct = await res.json();

        setServices((prev) => [
          ...prev,
          { ...newProduct, status: newProduct.status.toLowerCase() },
        ]);

        if (selectedAttributes.length > 0) {
          await saveAttributesForProduct(newProduct.product_id);
        }

        closePopup();
        return;
      }

      // EDIT
      if (popupType === "edit" && selectedService) {
        const res = await fetch(
          `${API_URL}/products/${selectedService.product_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_name: title,
              description,
              product_type: productType, // FIX: this was undefined
              status,
            }),
          }
        );

        const updated = await res.json();

        // 🔹 update image if selected
        if (image) {
          const imgForm = new FormData();
          imgForm.append("image", image);

          const imgRes = await fetch(
            `${API_URL}/products/${selectedService.product_id}/image`,
            {
              method: "PUT",
              body: imgForm,
            }
          );

          const imgUpdated = await imgRes.json();
          updated.image = imgUpdated.image;
        }

        await saveAttributesForProduct(selectedService.product_id);

        setServices((prev) =>
          prev.map((p) =>
            p.product_id === selectedService.product_id
              ? {
                  ...updated,
                  status: updated.status.toLowerCase(),
                }
              : p
          )
        );

        closePopup();
        return;
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }

    setIsSaving(false);
  };

  const handleStatusToggle = (service) => {
    const newStatus = service.status === "active" ? "inactive" : "active";
    updateProductStatus(service.product_id, newStatus);
  };

  const toggleAttribute = (attrName) => {
    setSelectedAttributes((prev) =>
      prev.includes(attrName)
        ? prev.filter((n) => n !== attrName)
        : [...prev, attrName]
    );
  };

  // --------------------------------------------------
  // UI START
  // --------------------------------------------------
  return (
    <div className="p-6 min-h-screen bg-white text-gray-900 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-cyan-700">
          Product Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 border border-gray-300 text-gray-800 focus:ring-2 focus:ring-cyan-400 outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <button
            onClick={() => openPopup("create")}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition shadow-sm"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-gray-200 text-gray-800 px-4 py-2 pr-8 rounded-lg hover:bg-gray-300 transition cursor-pointer focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <List
            className="absolute right-2 top-2.5 text-gray-600 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6">Product Name</th>
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredServices.map((service, idx) => (
                <motion.tr
                  key={service.product_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{service.product_name}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {service.description || "—"}
                  </td>

                  <td className="py-3 px-6">
                    <span
                      className={`inline-block min-w-[80px] text-center px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[service.status] || statusColors.default
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-6 flex gap-3 items-center">
                    {/* Status Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={service.status === "active"}
                        onChange={() => handleStatusToggle(service)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 rounded-full relative ${
                          service.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full
                        after:h-5 after:w-5 after:transition-all ${
                          service.status === "active"
                            ? "after:translate-x-full"
                            : ""
                        }`}
                      ></div>
                    </label>

                    {/* Edit Button */}
                    <button
                      onClick={() => openPopup("edit", service)}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl p-8 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="mb-6 border-b pb-3">
              <h2 className="text-2xl font-extrabold text-cyan-700">
                {popupType === "edit" ? "Edit Product" : "Add Product"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {popupType === "edit"
                  ? "Update product details, attributes, and image."
                  : "Create a new product with attributes and an image."}
              </p>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Text Fields */}
              <div className="space-y-4 md:col-span-2">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Describe this product..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Type & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Product Type
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl"
                    >
                      <option value="General">General</option>
                      <option value="Printing">Printing</option>
                      <option value="Binding">Binding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Attributes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Attributes (multi-select)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    These attributes are defined in Maintenance → Product Attributes.
                  </p>

                  {(() => {
                    const contactNames = [
                      "name",
                      "email",
                      "location",
                      "contact number",
                      "notes",
                      "notes / message",
                    ];

                    const contact = [];
                    const others = [];

                    availableAttributes.forEach((a) => {
                      const n = a.attribute_name.toLowerCase();
                      if (contactNames.includes(n)) contact.push(a);
                      else others.push(a);
                    });

                    const renderAttr = (attr) => (
                      <label
                        key={attr.attribute_name}
                        className="flex items-center gap-2 text-sm text-gray-700 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAttributes.includes(
                            attr.attribute_name
                          )}
                          onChange={() => toggleAttribute(attr.attribute_name)}
                          className="w-4 h-4"
                        />
                        <span>{attr.attribute_name}</span>

                        {attr.input_type === "input" ? (
                          <span className="text-[11px] text-blue-600 font-medium">
                            → Text Input Field
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            ({attr.options.join(", ")})
                          </span>
                        )}
                      </label>
                    );

                    return (
                      <div className="space-y-4 border border-gray-200 rounded-xl p-3 max-h-56 overflow-y-auto">
                        {contact.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                              Contact Information
                            </p>
                            {contact.map(renderAttr)}
                          </div>
                        )}

                        {others.length > 0 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                              Order / Other Details
                            </p>
                            {others.map(renderAttr)}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column — Image */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Image
                </label>

                <div className="w-full h-40 border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 text-sm">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm"
                />

                {popupType === "edit" && !image && imagePreview && (
                  <p className="text-xs text-gray-500">
                    Current image is shown. Upload to replace.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closePopup}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isSaving}
                className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-md transition ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg"
                }`}
              >
                {isSaving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductSection;