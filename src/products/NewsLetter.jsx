import Nav from "../component/navigation";
import newsletterImg from "../assets/NewsLetter.png";
import { ArrowBigLeft, Upload, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Contact, MessageCircle, XCircle } from "lucide-react";
import UploadSection from "../component/UploadSection.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";
import  { computeQuotation } from "../utils/computeQuotation.js";
import {API_URL} from "../api.js";

function Newsletters() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    business: "",
  });

  const [quantity, setQuantity] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [file, setFile] = useState(null);

  const [paperType, setPaperType] = useState("");
  const [layout, setLayout] = useState("");
  const [size, setSize] = useState("");
  const [message, setMessage] = useState("");

  const { showToast } = useToast();


  // --- Price Estimation ---
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const priceConfig = {
    base: 3.0, // base per piece
    color: {
      "Black & White": 0.5,
      "Full Color": 1.2,
    },
    layout: {
      "Single Page": 0.3,
      "Multi-Page": 1.0,
    },
    size: {
      A4: 0.8,
      A5: 0.5,
      "Letter (8.5”x11”)": 0.9,
      "Legal (8.5”x14”)": 1.1,
    },
  };


  // Check login status
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // Fetch user profile if logged in
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
            business: data.data.business_name || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [isLoggedIn]);

  // Handle place order button
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  // Check product visibility
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/product-status`)
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p.product_name === "Newsletter");
        if (product && (product.status === "Inactive" || product.status === "Archived")) {
          setVisible(false);
        }
      })
      .catch((err) => console.error("Error loading product status:", err));
  }, []);

  if (!visible) return null;

  // Full order + upload logic
const handleConfirmOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast(" You must be logged in to place an order.", "error");
      navigate("/login");
      return;
    }

    // Use attributes array (matches backend schema)
    const attributes = [
      { name: "Name", value: userProfile.name },
      { name: "Email", value: userProfile.email },
      { name: "Address", value: userProfile.address },
      { name: "Phone", value: userProfile.phone },
      { name: "Business", value: userProfile.business },
      { name: "Quantity", value: quantity },
      { name: "Size", value: size },
      { name: "Paper Type", value: paperType },
      { name: "Layout", value: layout },
      { name: "Message", value: message },
    ].filter((attr) => attr.value && attr.value.toString().trim() !== "");

    // Create order
    const response = await fetch(`${API_URL}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userProfile.id,
        product_id: 9,
        quantity,
        urgency: "Normal",
        status: "Pending",
        attributes, 
        estimated_price: estimatedPrice || 0,
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
      showToast(" Order created but missing ID from server.", "error");
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
      console.log(" File upload response:", uploadData);

      if (uploadData.success) {
        showToast(" Order placed and file uploaded successfully!", "success");
      } else {
        showToast(" Order placed, but file upload failed.", "warning");
      }
    } else {
      showToast(" Order placed successfully!", "success");
    }

    // Reset all inputs
    setShowConfirm(false);
    setQuantity("");
    setPaperType("");
    setLayout("");
    setSize("");
    setMessage("");
    setFile(null);

    navigate("/dashboard");
  } catch (error) {
    console.error(" Error placing order:", error);
    showToast(" Something went wrong while placing your order.", "error");
  }
};


  const sizeMap = {
    A4: { width: 8.27, height: 11.69 },
    A5: { width: 5.83, height: 8.27 },
    "Letter (8.5”x11”)": { width: 8.5, height: 11 },
    "Legal (8.5”x14”)": { width: 8.5, height: 14 },
  };


  useEffect(() => {
    const q = Number(quantity);
    if (!q || !size) {
      setEstimatedPrice(0);
      return;
    }

    const { width, height } = sizeMap[size] || { width: 8.5, height: 11 };
    const isColored = paperType === "Full Color";

    const result = computeQuotation({
      width,
      height,
      copies: q,
      colored: isColored,
    });

    if (result) {
      setEstimatedPrice(result.total);
    } else {
      setEstimatedPrice(0);
    }
  }, [quantity, size, paperType]);






  return (
    <>
      <Nav />
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2 sm:p-2">
          {isLoggedIn ? (
            <>
              {/* Back Button + Title */}
              <div className="flex items-center gap-3 mb-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowBigLeft className="w-7 h-7" />
                </button>
                <h2 className="text-4xl font-bold text-black ml-200">
                  Service Request
                </h2>
              </div>

              {/* Preview + Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Preview */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black flex justify-center">
                    Newsletters
                  </h2>
                  <p className="text-lg text-black mb-6 leading-relaxed text-center max-w-xl">
                    A professional newsletter helps you connect with your
                    audience, share updates, and build stronger brand
                    communication.
                  </p>

                  <div className="relative w-full max-w-3xl overflow-hidden group">
                    <img
                      src={newsletterImg}
                      alt="Sample Newsletter"
                      className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                </div>

                {/* Right: Form */}
                <form
                  onSubmit={handlePlaceOrder}
                  className="space-y-6 text-black"
                >
                  {/* Name, Email, Location, Contact */}
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}  
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your location"
                          value={userProfile.address}
                          onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter contact number"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}  
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                    </div>
                  </>

                  {/* Business Name + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter business name"
                        value={userProfile.business}
                        onChange={(e) => setUserProfile({ ...userProfile, business: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies{" "}
                        <span className="text-sm text-gray-700">(min 100)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="100"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Paper Type + Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color
                      </label>
                      <select 
                      value={paperType}
                      onChange={(e) => setPaperType(e.target.value)}  
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select print type</option>
                        <option>Black & White</option>
                        <option>Full Color</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Layout
                      </label>
                      <select
                      value={layout}
                      onChange={(e) => setLayout(e.target.value)}
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select layout</option>
                        <option>Single Page</option>
                        <option>Multi-Page</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload + Size + Message */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <UploadSection
                        uploadCount={1}
                        hasCustomization={true} 
                        onUploadComplete={(res) => {
                          if (res?.files?.[0]) setFile(res.files[0]);
                        }}
                      />
                    {/* Size + Message */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Size
                        </label>
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        >
                          <option value="">Select size</option>
                          <option>A4</option>
                          <option>A5</option>
                          <option>Letter (8.5”x11”)</option>
                          <option>Legal (8.5”x14”)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Message{" "}
                          <span className="text-sm text-gray-700">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-23 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          placeholder="Enter message"
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
                    </div>
                  </div>

                  {/* Price + Contact */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <p className="text-sm text-black">
                        If you have any questions:
                      </p>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                        <span className="flex items-center gap-1 font-medium text-blue-700">
                          <Phone size={16} /> #09123456789
                        </span>
                        <a
                          href="mailto:iconscribe@email.com"
                          className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
                        >
                          <Mail size={16} /> iconscribe@email.com
                        </a>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            // Not logged in view — similar adjustments here
            <>
              {/* Back Button + Title */}
              <div className="flex items-center gap-3 mb-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowBigLeft className="w-7 h-7" />
                </button>
                <h2 className="text-4xl font-bold text-black ml-200">
                  Service Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                  <img
                    src={newsletterImg}
                    alt="Sample Newsletter"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">
                    Newsletters
                  </h2>
                  <p className="text-lg text-black leading-relaxed">
                    A professional newsletter helps you keep your customers
                    informed, share updates, and promote new offers.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quas mollitia pariatur saepe totam quaerat voluptate
                    deleniti nihil culpa modi? Nihil quasi est odit ut ratione
                    aspernatur dicta odio non nemo.
                  </p>

                  {/* Print Type + Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Print Type
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select print type</option>
                        <option>Black & White</option>
                        <option>Full Color</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Layout
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select layout</option>
                        <option>Single Page</option>
                        <option>Multi-Page</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity + Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies{" "}
                        <span className="text-sm text-gray-700">(min 100)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="100"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Size
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select size</option>
                        <option>A4</option>
                        <option>A5</option>
                        <option>Letter (8.5”x11”)</option>
                        <option>Legal (8.5”x14”)</option>
                      </select>
                    </div>
                  </div>

                  {/* Price + Place Order */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-0">
                    <div className="flex justify-end gap-4">
                      {/* Contact Us Button */}
                      <button
                        type="button"
                        onClick={() => setShowContactModal(true)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                      >
                        Contact Us
                      </button>

                      {/* Place Order Button */}
                      <button
                        type="submit"
                        onClick={handlePlaceOrder}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                      >
                        Log In to Order
                      </button>
                    </div>
                  </div>

                  {/* Contact Modal */}
                  {showContactModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadeIn">
                        <button
                          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowContactModal(false)}
                        >
                          <XCircle className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                          <Contact className="text-blue-600 w-6 h-6" /> Contact
                          Us
                        </h3>

                        <div className="space-y-4 text-black">
                          <div className="flex items-center gap-2">
                            <Contact className="text-green-600 w-5 h-5" />
                            <span className="font-medium">
                              +63 912 345 6789
                            </span>
                          </div>
                          <a
                            href="mailto:iconscribe@email.com"
                            className="flex items-center gap-2 text-blue-700 hover:underline"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">
                              iconscribe@email.com
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
            {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">
              Confirm Your Newsletter Order
            </h2>
            <p className="text-base text-black mb-6">
              Are you sure you want to place this newsletter order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-black"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
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

export default Newsletters;
