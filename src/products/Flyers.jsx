import Nav from "../component/navigation";
import sampleFlyer from "../assets/Posters.png"; 
import { ArrowBigLeft, Upload, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { Contact, MessageCircle, XCircle } from "lucide-react";
import UploadSection from "../component/UploadSection.jsx";
import { useToast } from "../component/ui/ToastProvider.jsx";
import { computeQuotation } from "../utils/computeQuatation.js";
import { API_URL } from "../api.js";

function Flyers() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
    const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    });

    const [quantity, setQuantity] = useState("");
    const [size, setSize] = useState("");
    const [paperType, setPaperType] = useState(""); 
    const [color, setColor] = useState("");
    const [lamination, setLamination] = useState("");
    const [backToBack, setBackToBack] = useState(false);
    const [customization, setCustomization] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const { showToast } = useToast();

    const [estimatedPrice, setEstimatedPrice] = useState(0);

    const [agreed, setAgreed] = useState(false);


    

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
                id: data.data.id || data.data.user_id || "",
                name: data.data.name || "",
                email: data.data.email || "",
                address: data.data.address || "",
                phone: data.data.phone || "",
              });
            }
          })
          .catch((err) => console.error("Error fetching profile:", err));
      }, [isLoggedIn]);




  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login")
    } else {
      setShowConfirm(true);
    }
  };

    const [visible, setVisible] = useState(true);

    useEffect(() => {
      fetch(`${API_URL}/product-status`)
        .then((res) => res.json())
        .then((data) => {
          const product = data.find((p) => p.product_name === "Flyers");
          if (product && (product.status === "Inactive" || product.status === "Archived")) {
            setVisible(false);
          }
        })
        .catch((err) => console.error("Error loading product status:", err));
    }, []);

    if (!visible) return null;

    const handleConfirmOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast(" Please log in to place an order.", "error");
          return;
        }

        // Use attributes array (not custom_details)
        const attributes = [
          { name: "Customization", value: customization ? "Yes" : "No" },
          { name: "Flyer Size", value: size },
          { name: "Paper Type", value: paperType },
          { name: "Color", value: color },
          { name: "Lamination", value: lamination },
          { name: "Print", value: backToBack ? "Back-to-back" : "Single side" },
          { name: "Message", value: message },
        ].filter(attr => attr.value && attr.value.toString().trim() !== "");

        // Create order first
        const response = await fetch(`${API_URL}/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userProfile.id,
            product_id: 6, 
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
          showToast(" Failed to place order.", "error");
          return;
        }

        // Get the created order item ID
        const orderItemId =
          data.order_item_id || data.orderItemId || data.id || data.order_id;

        if (!orderItemId) {
          showToast(" Order created but missing ID from server.", "error");
          return;
        }

        // Upload file if available
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
          console.log(" Upload result:", uploadData);

          if (uploadData.success) {
            showToast(" Order placed and file uploaded successfully!", "success");
          } else {
            showToast(" Order placed, but file upload failed.", "warning");
          }
        } else {
          showToast(" Order placed successfully!", "success");
        }

        // Reset form fields
        setShowConfirm(false);
        setQuantity("");
        setSize("");
        setColor("");
        setPaperType("");
        setLamination("");
        setMessage("");
        setFile(null);
        setCustomization(false);
        setBackToBack(false);

        navigate("/dashboard");
      } catch (error) {
        console.error("Order error:", error);
        showToast(" Something went wrong. Please try again later.", "error");
      }
    };


    const sizeDimensions = {
      A4: { width: 21, height: 29.7 },
      A5: { width: 14.8, height: 21 },
      DL: { width: 10, height: 21 },
      Custom: { width: 21, height: 21 },
    };


    useEffect(() => {
      if (!quantity || !size) {
        setEstimatedPrice(0);
        return;
      }

      const { width, height } = sizeDimensions[size] || sizeDimensions["Custom"];
      const colored = color === "Yes";

      const result = computeQuotation({
        width,
        height,
        copies: Number(quantity),
        colored,
        paperCost: 20,
        plateCost: 500,
        runCost: 400,
        multiplier: 2,
      });

      if (result) {
        setEstimatedPrice(result.total);
      }
    }, [quantity, size, color]);



    
          

  return (
    <>
      <Nav />
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2 sm:p-2">
          {isLoggedIn ? (
            <>
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

              {/* Preview + Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Preview */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black flex justify-center">
                    Flyers
                  </h2>
                  <p className="text-lg text-black mb-6 leading-relaxed text-center max-w-xl">
                    Get your flyers printed with vibrant colors, premium paper,
                    and professional finishes — perfect for marketing and events.
                  </p>

                  <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
                    <img
                      src={sampleFlyer}
                      alt="Sample Flyer"
                      className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                </div>

                {/* Right: Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
                  {/* Name, Email, Location, Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">Name</label>
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
                        <label className="block text-base font-semibold text-black">Email</label>
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
                        <label className="block text-base font-semibold text-black">Location</label>
                        <input
                          type="text"
                          placeholder="Enter your location"
                          value={userProfile.address}
                          onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">Contact Number</label>
                        <input
                          type="text"
                          placeholder="Enter contact number"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                    </div>

                  {/* Quantity + Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies <span className="text-sm text-gray-700">(min 1000)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="1000"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Flyer Size
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
                        <option>DL</option>
                      </select>
                    </div>
                  </div>

                  {/* Paper Type + Finish */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Paper Type
                      </label>
                      <select
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select paper</option>
                        <option>Glossy</option>
                        <option>Matte</option>
                        <option>Premium Card</option>
                      </select>
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-black">
                          Lamination
                        </label>
                        <select
                          value={lamination}
                          onChange={(e) => setLamination(e.target.value)} 
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                            <option value="">Select Lamination</option>
                            <option>Gloss</option>
                            <option>Matte</option>
                            <option>UV Coated</option>
                        </select>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color
                      </label>
                      <select
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Yes/No</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div className="mt-4 flex items-center gap-3 p-3">
                        <input
                          type="checkbox"
                          id="backToBack"
                          className="w-6 h-6 scale-125 cursor-pointer"
                        />
                        <label htmlFor="backToBack" className="text-lg font-bold cursor-pointer">
                          Print Back-to-Back
                        </label>
                    </div>
                  </div>
                  {/* Upload + Message */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <UploadSection
                        uploadCount={1}          
                        hasCustomization={true} 
                        onUploadComplete={(res) => {
                          if (res?.files?.[0]) setFile(res.files[0]);
                        }}
                      />
                    {/* Notes */}
                    <div className="flex flex-col gap-3 mt-0">
                      <label className="block text-base font-semibold text-black">
                        Additional Notes <span className="text-sm text-gray-700">(optional)</span>
                      </label>
                      <textarea
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-41 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        placeholder="Enter a Message"
                      ></textarea>
                    </div>
                    <div className="border border-blue-200 bg-blue-50 rounded-2xl shadow-sm p-5 text-right">
                      <p className="text-base text-gray-700 font-medium">Estimated Price</p>
                      <p className="text-3xl font-bold text-blue-700 mt-1">
                        {estimatedPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
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
                  Flyer Printing Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full rounded-2xl flex items-center justify-center overflow-hidden group">
                  <img
                    src={sampleFlyer}
                    alt="Sample Flyer"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">Flyers</h2>
                  <p className="text-lg text-black leading-relaxed">
                    Print eye-catching flyers to promote your business, events,
                    or campaigns. Choose from various sizes, paper types, and
                    finishes.
                  </p>

                  {/* Quantity + Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies <span className="text-sm text-gray-700">(min 1000)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="1000"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Flyer Size
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select size</option>
                        <option>A4</option>
                        <option>A5</option>
                        <option>DL</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>

                  {/* Paper Type + Finish */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Paper Type
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select paper</option>
                        <option>Glossy</option>
                        <option>Matte</option>
                        <option>Premium Card</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Lamination
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select Lamination</option>
                        <option>Gloss</option>
                        <option>Matte</option>
                        <option>UV Coated</option>
                      </select>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select paper</option>
                        <option>Glossy</option>
                        <option>Matte</option>
                        <option>Premium Card</option>
                      </select>
                    </div>
                    <div className="mt-4 flex items-center gap-3 p-3">
                        <input
                          type="checkbox"
                          id="backToBack"
                          className="w-6 h-6 scale-125 cursor-pointer"
                        />
                        <label htmlFor="backToBack" className="text-lg font-bold cursor-pointer">
                          Print Back-to-Back
                        </label>
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
                          <Contact className="text-blue-600 w-6 h-6" /> Contact Us
                        </h3>

                        <div className="space-y-4 text-black">
                          <div className="flex items-center gap-2">
                            <Contact className="text-green-600 w-5 h-5" />
                            <span className="font-medium">+63 912 345 6789</span>
                          </div>
                          <a
                            href="mailto:iconscribe@email.com"
                            className="flex items-center gap-2 text-blue-700 hover:underline"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">iconscribe@email.com</span>
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

export default Flyers;
