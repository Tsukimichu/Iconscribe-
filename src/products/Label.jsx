import Nav from "../component/navigation";
import label from "../assets/ICONS.png";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UploadSection from "../component/UploadSection.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";
import {API_URL} from "../api.js";

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
  const [file, setFile] = useState(null);
  const [visible, setVisible] = useState(true);


  const [estimatedPrice, setEstimatedPrice] = useState(0);


  const [agreed, setAgreed] = useState(false);


  const priceConfig = {
    base: 1.5, // base price per label
    size: {
      "2” x 2”": 0.3,
      "3” x 3”": 0.5,
      "Custom Size": 0.8,
    },
    paperType: {
      Matte: 0.5,
      Glossy: 0.7,
      Transparent: 1.0,
      "Waterproof Vinyl": 1.3,
    },
  };

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

    fetch(`${API_URL}/profile`, {
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
    fetch(`${API_URL}/product-status`)
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
    const response = await fetch(`${API_URL}/orders/create`, {
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
        `${API_URL}/orders/upload/single/${orderItemId}`,
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

useEffect(() => {
  if (!quantity || quantity < 100) {
    setEstimatedPrice(0);
    return;
  }

  const q = Number(quantity);
  const sizeCost = priceConfig.size[size] || 0;
  const paperCost = priceConfig.paperType[paperType] || 0;

  const total = q * (priceConfig.base + sizeCost + paperCost);
  setEstimatedPrice(total);
}, [quantity, size, paperType]);



  return (
    <>
      <Nav />
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2 sm:p-2">
          {/* Header */}
          {/* Back Button + Title */}
                <div className="relative flex items-center justify-center mb-10 w-full">
                  {/* Back Button - stays on the left */}
                  <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 p-2 hover:bg-gray-200 rounded-full transition"
                  >
                    <ArrowBigLeft className="w-7 h-7" />
                  </button>

                  {/* Centered Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-black text-center">
                    Product Request
                  </h2>
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
              <div className="border border-blue-200 bg-blue-50 rounded-2xl shadow-sm p-5 text-right">
                <p className="text-base text-gray-700 font-medium">Estimated Price</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">
                  ₱{estimatedPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 italic mt-1">
                  *Final price may vary depending on specifications
                </p>
              </div>
              <div class="max-w-md mx-auto mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-xl shadow-sm">
                <p class="text-yellow-800 text-sm font-medium">
                  📌 The products take about <span class="font-semibold">2–3 weeks</span> to be completed and prepared for delivery.
                </p>
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
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
                      
                      <h2 className="text-xl font-bold text-black mb-4">Confirm Your Order</h2>

                      {/* TERMS AND CONDITIONS CARD */}
                      <div className="border rounded-xl p-4 h-64 overflow-y-auto text-sm text-black bg-gray-50 mb-4">
                        <h3 className="text-lg font-semibold mb-2">ICONScribe – Terms and Conditions</h3>

                        <p className="font-semibold mt-2">1. Acceptance of Terms</p>
                        <p>By creating an account, placing an order, or using the System, you agree to these Terms and Conditions.</p>

                        <p className="font-semibold mt-2">2. User Accounts</p>
                        <ul className="list-disc ml-5">
                          <li>Provide accurate information when signing up.</li>
                          <li>You are responsible for safeguarding your login details.</li>
                          <li>Any activity under your account is your responsibility.</li>
                        </ul>

                        <p className="font-semibold mt-2">3. Ordering Process</p>
                        <ul className="list-disc ml-5">
                          <li>All orders are final once submitted.</li>
                          <li>ICONScribe may accept or reject orders due to availability or policy issues.</li>
                          <li>Order confirmation will be sent via system, email, or SMS.</li>
                        </ul>

                        <p className="font-semibold mt-2">4. Pricing and Payment</p>
                        <ul className="list-disc ml-5">
                          <li>Prices are in PHP and may change without notice.</li>
                          <li>Only Cash is accepted.</li>
                          <li>Failure to pay may result in order cancellation.</li>
                        </ul>

                        <p className="font-semibold mt-2">5. Delivery and Pick-Up</p>
                        <ul className="list-disc ml-5">
                          <li>Clients may choose Delivery or Pick-Up.</li>
                          <li>Delivery: must provide complete and accurate address. Fees may apply.</li>
                          <li>Pick-Up: orders must be claimed at the ICONScribe location.</li>
                        </ul>

                        <p className="font-semibold mt-2">6. Modifications and Cancellations</p>
                        <ul className="list-disc ml-5">
                          <li>Cancellations allowed within 24 hours after placing the order.</li>
                          <li>No cancellations after 24 hours.</li>
                          <li>Processed/printed orders may not be modified.</li>
                        </ul>

                        <p className="font-semibold mt-2">7. Refund and Return Policy</p>
                        <p>Refunds/reprints only if:</p>
                        <ul className="list-disc ml-5">
                          <li>Product is damaged.</li>
                          <li>Error was caused by ICONScribe.</li>
                        </ul>

                        <p>Not liable for errors caused by:</p>
                        <ul className="list-disc ml-5">
                          <li>Incorrect details provided by client.</li>
                          <li>Low-quality or incorrect uploaded files.</li>
                          <li>Changes requested after processing.</li>
                        </ul>

                        <p>Refund requests must be submitted within [Insert # of days].</p>

                        <p className="font-semibold mt-2">8. Client Responsibilities</p>
                        <ul className="list-disc ml-5">
                          <li>Provide accurate details and correct files.</li>
                          <li>No illegal, inappropriate, or copyrighted uploads.</li>
                          <li>Use the system responsibly.</li>
                        </ul>

                        <p className="font-semibold mt-2">9. System Availability</p>
                        <p>The system may experience downtime or updates.</p>

                        <p className="font-semibold mt-2">10. Data Privacy</p>
                        <p>Your information is protected under the ICONScribe Privacy Policy.</p>

                        <p className="font-semibold mt-2">11. Limitation of Liability</p>
                        <p>ICONScribe is not responsible for:</p>
                        <ul className="list-disc ml-5">
                          <li>Losses caused by incorrect client information.</li>
                          <li>User-uploaded content issues.</li>
                          <li>Technical delays or emergencies.</li>
                          <li>Indirect or consequential damages.</li>
                        </ul>

                        <p className="font-semibold mt-2">12. Changes to Terms</p>
                        <p>ICONScribe may update these Terms at any time.</p>

                        <p className="font-semibold mt-2">13. Contact Information</p>
                        <p>[iconscribe@gmail.com / Phone Number / Bantad, Boac, Marinduque]</p>
                      </div>

                      {/* AGREEMENT CHECKBOX */}
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="checkbox"
                          id="agree"
                          className="w-4 h-4"
                          checked={agreed}
                          onChange={() => setAgreed(!agreed)}
                        />
                        <label htmlFor="agree" className="text-sm text-black">
                          I have read and agree to the Terms and Conditions
                        </label>
                      </div>

                      {/* BUTTONS */}
                      <div className="flex justify-end gap-3">
                        <button
                          className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-black"
                          onClick={() => setShowConfirm(false)}
                        >
                          Cancel
                        </button>

                        <button
                          onClick={agreed ? handleConfirmOrder : () => alert("Please agree to the Terms and Conditions first.")}
                          className={`px-4 py-2 rounded-xl text-white transition ${
                            agreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                          }`}
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
