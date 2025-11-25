import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api"; // FIXED: use API_URL
import {
  ArrowBigLeft,
  ShoppingCart,
  Phone,
  Mail,
  Contact,
  MessageCircle,
  XCircle,
} from "lucide-react";
import UploadSection from "../component/UploadSection";
import Navigation from "../component/navigation";
import { useToast } from "../component/ui/ToastProvider";

// FIXED: correct base URL for images
const BASE_URL = API_URL.replace("/api", "");

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // --------------------------------------------------------
  // AUTH LISTENER
  // --------------------------------------------------------
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // --------------------------------------------------------
  // LOAD PRODUCT
  // --------------------------------------------------------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const blocked = [
          "name",
          "email",
          "location",
          "contact",
          "phone",
          "note",
          "message",
        ];

        const filtered = (data.attributes || []).filter(
          (a) =>
            !blocked.some((b) =>
              a.attribute_name?.toLowerCase().includes(b)
            )
        );

        setAttributes(filtered);

        const defaults = {};
        filtered.forEach((attr) => {
          const first = attr.options?.[0];
          defaults[attr.attribute_name] =
            typeof first === "string" ? first : first?.value || "";
        });

        setSelected((p) => ({ ...p, ...defaults }));
      } catch (err) {
        console.error("Product load error", err);
        showToast("Failed to load product", "error");
      }
    };

    loadProduct();
  }, [id, showToast]);

  // --------------------------------------------------------
  // LOAD USER PROFILE
  // --------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !d.data) return;

        const profile = {
          id: d.data.user_id,
          name: d.data.name || "",
          email: d.data.email || "",
          address: d.data.address || "",
          phone: d.data.phone || "",
        };

        setUserProfile(profile);

        // prefill
        setSelected((p) => ({
          ...p,
          name: profile.name,
          email: profile.email,
          location: profile.address,
          contact_number: profile.phone,
        }));
      })
      .catch((err) => console.error("Profile error:", err));
  }, [isLoggedIn]);

  // --------------------------------------------------------
  // ESTIMATED PRICE
  // --------------------------------------------------------
  useEffect(() => {
    if (!product) return;
    const base = Number(product.base_price || 0);
    setEstimatedPrice(base * Number(quantity || 0));
  }, [product, quantity]);

  // --------------------------------------------------------
  // SKELETON
  // --------------------------------------------------------
  if (!product) {
    return (
      <div className="p-10 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-96 bg-blue-100 rounded-xl mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-10 bg-blue-100 rounded"></div>
              ))}
          </div>
          <div className="h-32 bg-blue-100 rounded mt-6"></div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------------
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/login");
    setShowConfirm(true);
  };

  const submitOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const user_id = userProfile.id || localStorage.getItem("user_id");

      const formattedAttributes = attributes.map((attr) => ({
        name: attr.attribute_name,
        value: selected[attr.attribute_name],
      }));

      const payload = {
        user_id,
        product_id: product.product_id,
        quantity,
        status: "Pending",
        estimated_price: estimatedPrice || 0,
        name: userProfile.name,
        email: userProfile.email,
        location: userProfile.address,
        contact_number: userProfile.phone,
        notes,
        attributes: formattedAttributes,
      };

      const res = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) {
        showToast("Order failed", "error");
        return;
      }

      const orderId = result.order_item_id;

      if (file) {
        const fd = new FormData();
        fd.append("file1", file);

        await fetch(`${API_URL}/orders/upload/double/${orderId}`, {
          method: "POST",
          body: fd,
        });
      }

      showToast("Order placed successfully!", "success");
      setShowConfirm(false);
      setAgreed(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Order error:", err);
      showToast("Error placing order", "error");
    }
  };

  // =====================================================
  // LOGGED-IN VIEW
  // =====================================================
  const loggedInView = (
    <div className="w-full h-full bg-white flex items-center justify-center p-5">
      <div className="w-full max-w-[120rem] p-2">
        {/* TITLE */}
        <div className="relative flex items-center justify-center mb-10 w-full">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowBigLeft className="w-7 h-7" />
          </button>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center">
            Product Request
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-black">
              {product.product_name}
            </h2>
            <p className="text-lg text-black mb-6 text-center max-w-xl">
              {product.description}
            </p>

            {/* FIXED IMAGE URL */}
            <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
              <img
                src={
                  product.image
                    ? `${BASE_URL}/uploads/products/${product.image}`
                    : "/no-image.png"
                }
                alt={product.product_name}
                className="w-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT */}
          <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
            {/* USER INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, name: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, email: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Location</label>
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, address: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold">Contact Number</label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, phone: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                />
              </div>
            </div>

            {/* QUANTITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* ATTRIBUTES */}
            {attributes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attributes.map((attr) => (
                  <div key={attr.attribute_name}>
                    <label className="font-semibold">
                      {attr.attribute_name}
                    </label>
                    <select
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                      value={selected[attr.attribute_name] || ""}
                      onChange={(e) =>
                        setSelected((p) => ({
                          ...p,
                          [attr.attribute_name]: e.target.value,
                        }))
                      }
                    >
                      {attr.options.map((opt, i) => {
                        const val = typeof opt === "string" ? opt : opt.value;
                        return (
                          <option key={i} value={val}>
                            {val}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* UPLOAD + NOTES + PRICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UPLOAD */}
              <div>
                <UploadSection
                  uploadCount={1}
                  onUploadComplete={(res) => {
                    if (res?.files?.[0]) setFile(res.files[0]);
                  }}
                />
              </div>

              {/* NOTES */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="font-semibold">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl h-32"
                    placeholder="Add extra notes"
                  ></textarea>
                </div>

                <div className="mt-4 border border-blue-200 bg-blue-50 rounded-2xl p-5 text-right">
                  <p className="text-gray-700">Estimated Price</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {estimatedPrice.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    * Final price may vary depending on specifications.
                  </p>
                </div>

                <div className="max-w-md mx-auto mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-xl shadow-sm">
                  <p className="text-yellow-800 text-sm font-medium">
                    📌 The products take about{" "}
                    <span className="font-semibold">2–3 weeks</span> to be
                    completed and prepared for delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTACT + SUBMIT */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:gap-4">
                <span className="flex items-center gap-1 font-medium text-blue-700">
                  <Phone size={16} /> #09123456789
                </span>

                <a
                  href="mailto:iconscribe@gmail.com"
                  className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
                >
                  <Mail size={16} /> iconscribe@gmail.com
                </a>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* CONFIRMATION MODAL */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
              <h2 className="text-xl font-bold text-black mb-4">
                Confirm Your Order
              </h2>

              <div className="border rounded-xl p-4 h-64 overflow-y-auto text-sm text-black bg-gray-50 mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  ICONScribe – Terms and Conditions
                </h3>

                <p>
                  By placing an order, you agree to the following terms and
                  conditions.
                </p>

                <p className="font-semibold mt-2">1. Orders</p>
                <p>Orders are final after submission.</p>

                <p className="font-semibold mt-2">2. Pricing</p>
                <p>Prices may change without notice.</p>

                <p className="font-semibold mt-2">3. Delivery</p>
                <p>Delivery or pickup options available.</p>

                <p className="font-semibold mt-2">4. Refunds</p>
                <p>Refunds available only for proven errors or defects.</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="agree"
                  className="w-4 h-4"
                  checked={agreed}
                  onChange={() => setAgreed((a) => !a)}
                />
                <label htmlFor="agree" className="text-sm text-black">
                  I agree to the Terms & Conditions
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-black"
                  onClick={() => {
                    setShowConfirm(false);
                    setAgreed(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={
                    agreed
                      ? submitOrder
                      : () =>
                          alert(
                            "Please agree to the terms and conditions first."
                          )
                  }
                  className={`px-4 py-2 rounded-xl text-white transition ${
                    agreed
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =====================================================
  // LOGGED-OUT VIEW
  // =====================================================
  const loggedOutView = (
    <div className="w-full h-full bg-white flex items-center justify-center p-5">
      <div className="w-full max-w-[120rem] p-2">
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowBigLeft className="w-7 h-7" />
          </button>
          <h2 className="text-4xl font-bold text-black">Service Request</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
          {/* LEFT */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
            <img
              src={
                product.image
                  ? `${BASE_URL}/uploads/products/${product.image}`
                  : "/no-image.png"
              }
              alt={product.product_name}
              className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          </div>

          {/* RIGHT */}
          <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
            <h2 className="text-4xl font-bold text-black">
              {product.product_name}
            </h2>

            <p className="text-lg text-black leading-relaxed">
              {product.description}
            </p>

            {/* SAMPLE ATTRIBUTE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-semibold text-black">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  min="1"
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                />
              </div>

              {attributes[0] && (
                <div>
                  <label className="block text-base font-semibold text-black">
                    {attributes[0].attribute_name}
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                    {attributes[0].options.map((opt, i) => {
                      const val = typeof opt === "string" ? opt : opt.value;
                      return (
                        <option key={i} value={val}>
                          {val}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                onClick={() => setShowContactModal(true)}
              >
                Contact Us
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
              >
                Log In to Order
              </button>
            </div>

            {showContactModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowContactModal(false)}
                  >
                    <XCircle className="w-6 h-6" />
                  </button>

                  <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <Contact className="text-blue-600 w-6 h-6" /> Contact Us
                  </h3>

                  <div className="space-y-4 text-black">
                    <div className="flex items-center gap-2">
                      <Contact className="text-green-600 w-5 h-5" />
                      <span className="font-medium">+63 912 345 6789</span>
                    </div>
                    <a
                      href="mailto:iconscribe@gmail.com"
                      className="flex items-center gap-2 text-blue-700 hover:underline"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">
                        iconscribe@gmail.com
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navigation />
      {isLoggedIn ? loggedInView : loggedOutView}
    </>
  );
};

export default ProductView;