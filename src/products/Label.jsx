import Nav from "../component/navigation";
import label from "../assets/ICONS.png";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UploadSection from "../component/UploadSection.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";

function Label() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [quantity, setQuantity] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [size, setSize] = useState("2” x 2”");
  const [paperType, setPaperType] = useState("Matte");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null); // ✅ added file state
  const [visible, setVisible] = useState(true);

  // --- Auth Check ---
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // --- Fetch User Profile ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserProfile({
            id: data.data.user_id || "",
            name: data.data.name || "",
            email: data.data.email || "",
            address: data.data.address || "",
            phone: data.data.phone || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [isLoggedIn]);

  // --- Product visibility ---
  useEffect(() => {
    fetch("http://localhost:5000/api/product-status")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p.product_name === "Label");
        if (product && (product.status === "Inactive" || product.status === "Archived")) {
          setVisible(false);
        }
      })
      .catch((err) => console.error("Error loading product status:", err));
  }, []);
  if (!visible) return null;

  // --- Place Order (open confirm modal) ---
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  // --- Confirm Order ---
const handleConfirmOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast(" Please log in to place an order.", "error");
      navigate("/login");
      return;
    }

    // Use attributes instead of custom_details
    const attributes = [
      { name: "Name", value: userProfile.name },
      { name: "Email", value: userProfile.email },
      { name: "Address", value: userProfile.address },
      { name: "Phone", value: userProfile.phone },
      { name: "Size", value: size },
      { name: "Paper Type", value: paperType },
      { name: "Message", value: message },
    ].filter((attr) => attr.value && attr.value.trim() !== "");

    // Create order
    const response = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userProfile.id,
        product_id: 8,
        quantity,
        urgency: "Normal",
        status: "Pending",
        attributes,
      }),
    });

    const data = await response.json();
    console.log(" Order creation response:", data);

    if (!data.success) {
      showToast(" Failed to place order. Please try again.", "error");
      return;
    }

    // Extract order item ID
    const orderItemId =
      data.order_item_id || data.orderItemId || data.id || data.order_id;

    if (!orderItemId) {
      showToast("⚠️ Order created but missing ID from server.", "error");
      return;
    }

    // Upload file if provided
    if (file) {
      const formData = new FormData();
      formData.append("file1", file);

      const uploadRes = await fetch(
        `http://localhost:5000/api/orders/upload/single/${orderItemId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      console.log(" Upload response:", uploadData);

      if (uploadData.success) {
        showToast(" Order placed and file uploaded successfully!", "success");
      } else {
        showToast(" Order placed, but file upload failed.", "warning");
      }
    } else {
      showToast(" Order placed successfully!", "success");
    }

    // Step 4: Reset fields
    setShowConfirm(false);
    setQuantity("");
    setSize("2” x 2”");
    setPaperType("Matte");
    setMessage("");
    setFile(null);
    navigate("/dashboard");
  } catch (error) {
    console.error("Error placing order:", error);
    showToast(" An error occurred while placing your order.", "error");
  }
};


  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="w-full max-w-[95rem] mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Label Printing</h1>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Custom waterproof or adhesive labels for packaging, branding, and
                products. Choose from matte, glossy, or transparent finishes with
                full-color printing.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={label}
                  alt="Label Preview"
                  className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-8" onSubmit={handlePlaceOrder}>
              {/* Upload + Customize */}
              {isLoggedIn && (
                <UploadSection
                  uploadCount={1}
                  hasCustomization={true} 
                  onUploadComplete={(res) => {
                    if (res?.files?.[0]) setFile(res.files[0]);
                  }}
                />
              )}

              {/* Quantity + Size */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Number of Copies  
                    <span> (100)</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option>2” x 2”</option>
                    <option>3” x 3”</option>
                    <option>Custom Size</option>
                  </select>
                </div>
              </div>

              {/* Paper Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Paper Type
                </label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="mt-1 w-[320px] border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option>Matte</option>
                  <option>Glossy</option>
                  <option>Transparent</option>
                  <option>Waterproof Vinyl</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Message <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-28 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Add special instructions..."
                ></textarea>
              </div>

              {!isLoggedIn && (
                <p className="text-xs text-gray-500">
                  Please log in to upload or customize a design.
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-12 py-4 text-lg rounded-xl font-semibold"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">
              Confirm Your Order
            </h2>
            <p className="text-base text-black mb-6">
              Are you sure you want to place this order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-black"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                onClick={handleConfirmOrder}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Label;
