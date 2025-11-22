import Nav from "../component/navigation";
import or from "../assets/CallingCard.png";
import { ArrowBigLeft, Upload, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { Contact, MessageCircle, XCircle } from "lucide-react";
import UploadSection from "../component/UploadSection";
import { useToast } from "../component/ui/ToastProvider";
import{ API_URL } from "../api";

function CallingCard() {
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

      const [size, setSize] = useState("");
      const [paperType, setPaperType] = useState("");
      const [color, setColor] = useState("");
      const [lamination, setLamination] = useState("");
      const [customization, setCustomization] = useState(false);
      const [backToBack, setBackToBack] = useState(false);
      const [message, setMessage] = useState("");
      const [file, setFile] = useState("");
 
      const {showToast} = useToast();
      const [quantity, setQuantity] = useState("");
      const [showConfirm, setShowConfirm] = useState(false);
      const [showContactModal, setShowContactModal] = useState(false);

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
                business: data.data.business || "",
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
          const product = data.find((p) => p.product_name === "Calling Card");
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

        // ALWAYS RECALCULATE FINAL PRICE HERE
        const finalEstimatedPrice = estimatedPrice; 

        const attributes = [
          { name: "Customization", value: customization ? "Yes" : "No" },
          { name: "Name", value: userProfile.name },
          { name: "Email", value: userProfile.email },
          { name: "Address", value: userProfile.address },
          { name: "Phone", value: userProfile.phone },
          { name: "Business", value: userProfile.business },
          { name: "Number of Cards", value: quantity },
          { name: "Size", value: size },
          { name: "Type of Paper", value: paperType },
          { name: "Color", value: color },
          { name: "Lamination", value: lamination },
          { name: "Print", value: backToBack ? "Back to back" : "Single side" },
          { name: "Message", value: message },
          { name: "estimatedPrice", value: finalEstimatedPrice.toFixed(2) } // ⭐ add this for transparency
        ].filter((attr) => attr.value && attr.value.toString().trim() !== "");

        const response = await fetch(`${API_URL}/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userProfile.id,
            product_id: 5,
            quantity,
            urgency: "Normal",
            status: "Pending",
            estimated_price: finalEstimatedPrice,   // ⭐⭐ FIXED — finally sending to backend
            attributes,
          }),
        });

        const data = await response.json();
        console.log(" Order response:", data);

        if (!data.success) {
          showToast(" Failed to place order.", "error");
          return;
        }

        const orderItemId = data.order_item_id || data.orderItemId;

        if (!orderItemId) {
          showToast("Order created but missing ID.", "error");
          return;
        }

        // Upload File
        if (file) {
          const formData = new FormData();
          formData.append("file1", file);
          const uploadRes = await fetch(
            `${API_URL}/orders/upload/single/${orderItemId}`,
            { method: "POST", body: formData }
          );
          const uploadData = await uploadRes.json();

          if (uploadData.success) {
            showToast(" Order placed and file uploaded successfully!", "success");
          } else {
            showToast(" Order placed, but file upload failed.", "warning");
          }
        } else {
          showToast(" Order placed successfully!", "success");
        }

        // Reset form
        setShowConfirm(false);
        setQuantity("");
        setSize("");
        setPaperType("");
        setColor("");
        setLamination("");
        setBackToBack(false);
        setMessage("");
        setFile(null);
        setCustomization(false);

        // ⭐⭐ Redirect after success
        navigate("/dashboard");

      } catch (error) {
        console.error("Order error:", error);
        showToast(" Something went wrong. Please try again later.", "error");
      }
    };

    useEffect(() => {
      const baseRatePerCard = 2.5; // base price per calling card
      const paperRates = {
        Matte: 1.0,
        Glossy: 1.2,
        Textured: 1.3,
      };
      const colorRates = {
        "Full Color": 1.4,
        "Black & White": 1.0,
      };
      const laminationRates = {
        "Gloss Lamination": 1.15,
        "Matte Lamination": 1.1,
        None: 1.0,
      };
      const sizeRates = {
        "2” x 3.5” (Standard)": 1.0,
        "Custom Size": 1.25,
      };

      if (!quantity) {
        setEstimatedPrice(0);
        return;
      }

      const paperMultiplier = paperRates[paperType] || 1;
      const colorMultiplier = colorRates[color] || 1;
      const laminationMultiplier = laminationRates[lamination] || 1;
      const sizeMultiplier = sizeRates[size] || 1;
      const backToBackMultiplier = backToBack ? 1.15 : 1.0;
      const customizationMultiplier = customization ? 1.1 : 1.0;

      const total =
        quantity *
        baseRatePerCard *
        paperMultiplier *
        colorMultiplier *
        laminationMultiplier *
        sizeMultiplier *
        backToBackMultiplier *
        customizationMultiplier;

      setEstimatedPrice(total);
    }, [quantity, size, paperType, color, lamination, backToBack, customization]);





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
                    Calling Card
                  </h2>
                  <p className="text-lg text-black mb-6 leading-relaxed text-center max-w-xl">
                    A calling card is a small card with your contact details,
                    often shared for personal or professional introductions.
                  </p>

                  <div className="relative w-full max-w-3xl overflow-hidden group">
                    <img
                      src={or}
                      alt="Sample Calling Card"
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

                  {/* Business/Personal Label + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Card Title (e.g. Business or Personal)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter title for card"
                        value={userProfile.business}
                        onChange={(e) => setUserProfile({ ...userProfile, business: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Cards{" "}
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

                  {/* Size + Paper Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Size
                      </label>
                      <select
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select size</option>
                        <option>2” x 3.5” (Standard)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Type of Paper
                      </label>
                      <select
                        value={paperType}
                        onChange={e => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      >
                        <option value="">Select type</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Textured</option>
                      </select>
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
                    {/* Options + Message */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-base font-semibold text-black mb-3">
                          Message{" "}
                          <span className="text-sm text-gray-700">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-41 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          placeholder="Enter message"
                        ></textarea>
                      </div>
                      <div className="mt-4 border border-blue-200 bg-blue-50 rounded-2xl shadow-sm p-5 text-right">
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
                  Service Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                  <img
                    src={or}
                    alt="Sample Calling Card"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">
                    Calling Card
                  </h2>
                  <p className="text-lg text-black leading-relaxed">
                    A calling card is a small card with your contact details,
                    often shared for personal or professional introductions.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quas mollitia pariatur saepe totam quaerat voluptate
                    deleniti nihil culpa modi? Nihil quasi est odit ut ratione
                    aspernatur dicta odio non nemo.
                  </p>

                  {/* Copies + Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Cards{" "}
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
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select size</option>
                        <option>2” x 3.5” (Standard)</option>
                        <option>Custom Size</option>
                      </select>
                    </div>
                  </div>

                  {/* Paper Type + Color + Lamination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Type of Paper
                      </label>
                      <select
                        value={paperType}
                        onChange={e => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      >
                        <option value="">Select type</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Textured</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color
                      </label>
                      <select
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select Color</option>
                        <option>Full Color</option>
                        <option>Black & White</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Lamination
                      </label>
                      <select
                        value={lamination}
                        onChange={e => setLamination(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      >
                        <option value="">Select option</option>
                        <option>Gloss Lamination</option>
                        <option>Matte Lamination</option>
                        <option>None</option>
                      </select>
                    </div>

                    <div className="mt-4 flex items-center gap-3 p-3">
                      <input
                        type="checkbox"
                        checked={backToBack}
                        onChange={e => setBackToBack(e.target.checked)}
                        id="backToBack"
                        className="w-6 h-6 scale-125 cursor-pointer"
                      />
                      <label
                        htmlFor="backToBack"
                        className="text-lg font-bold cursor-pointer"
                      >
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

export default CallingCard;
