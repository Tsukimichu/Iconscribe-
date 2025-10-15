import Nav from "../component/navigation";
import or from "../assets/Brochure.png";
import { ArrowBigLeft, Upload, Phone, Mail, Contact, MessageCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UploadSection from "../component/UploadSection";
import { useToast } from "../component/ui/ToastProvider";


function Brochure() {
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
  const [size, setSize] = useState("");
  const [paperType, setPaperType] = useState("");
  const [color, setColor] = useState("");
  const [lamination, setLamination] = useState("");
  const [backToBack, setBackToBack] = useState(false);
  const [customization, setCustomization] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);


  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // Fetch user profile
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

  // Check if product is visible
  useEffect(() => {
    fetch("http://localhost:5000/api/product-status")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p.product_name === "Brochure");
        if (product && (product.status === "Inactive" || product.status === "Archived")) {
          setVisible(false);
        }
      })
      .catch((err) => console.error("Error loading product status:", err));
  }, []);

  if (!visible) return null;

  // Place Order button handler
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  // Confirm and send order to backend
  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("You must be logged in to place an order.", "error");
        return;
      }

      // Build attributes array
      const attributes = [
        { name: "Customization", value: customization ? "Yes" : "No" },
        { name: "Number of Copies", value: quantity },
        { name: "Size", value: size },
        { name: "Type of Paper", value: paperType },
        { name: "Colored", value: color },
        { name: "Lamination", value: lamination },
        { name: "Print", value: backToBack ? "Back to back" : "Single side" },
        { name: "Message", value: message },
      ].filter(attr => attr.value && attr.value !== "");

      // Create the order in backend
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          product_id: 3, 
          quantity,
          urgency: "Normal",
          status: "Pending",
          attributes,
        }),
      });

      const data = await res.json();
      console.log(" Order created:", data);

      if (!data.success) {
        showToast("Failed to place order.", "error");
        return;
      }

      // Get correct order_item_id
      const orderItemId =
        data.order_item_id || data.orderItemId || data.id || data.order_id;

      if (!orderItemId) {
        showToast("Order created, but missing ID from server.", "error");
        return;
      }

      // Upload file
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
          showToast("Order placed and file uploaded successfully!", "success");
        } else {
          showToast("Order placed, but file upload failed.", "warning");
        }
      } else {
        showToast("Order placed successfully!", "success");
      }

      // Reset form
      setShowConfirm(false);
      setQuantity("");
      setSize("");
      setPaperType("");
      setColor("");
      setLamination("");
      setBackToBack(false);
      setCustomization(false);
      setMessage("");
      setFile(null);

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error placing order:", err);
      showToast("Something went wrong while placing the order.", "error");
    }
  };


  return (
    <>
      <Nav />
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2 sm:p-2">
          {/* Logged In View */}
          {isLoggedIn ? (
            <>
              {/* Back Button + Title */}
              <div className="flex items-center gap-32 mb-10">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black">Brochure</h2>
                  <p className="text-lg text-black mb-6 text-center max-w-xl">
                    Professionally print brochures with multiple paper options, finishes, and customizations.
                  </p>
                  <img src={or} alt="Brochure" className="w-full max-w-3xl rounded-2xl shadow-md object-contain" />
                </div>

                {/* Right Side Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold">Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Quantity + Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Number of Copies (min 1000)</label>
                      <input
                        type="number"
                        min="1000"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold">Size</label>
                      <select value={size} onChange={(e) => setSize(e.target.value)} className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black" required>
                        <option value="">Select size</option>
                        <option>11”x17”</option>
                        <option>17”x22”</option>
                        <option>22”x34”</option>
                        <option>8.5”x14”</option>
                      </select>
                    </div>
                  </div>

                  {/* Paper Type + Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Type of Paper</label>
                      <select value={paperType} onChange={(e) => setPaperType(e.target.value)} className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black" required>
                        <option value="">Select type</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Book Paper</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold">Colored</label>
                      <select value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black" required>
                        <option value="">Yes/No</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>

                  {/* color + lamination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Lamination
                      </label>
                       <select value={lamination} onChange={(e) => setLamination(e.target.value)} className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black" required>
                        <option value="">Select Lamination type</option>
                        <option>Yes</option>
                        <option>No</option>
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
                    {/* Size + Message */}
                    <div className="flex flex-col gap-3 mt-9  ">
              
                      <div className="flex items-center gap-3 p-3">
                        <input
                          type="checkbox"
                          id="backToBack"
                          className="w-6 h-6 scale-125 cursor-pointer"
                          checked={backToBack}
                          onChange={(e) => setBackToBack(e.target.checked)}
                        />
                        <label htmlFor="backToBack" className="text-lg font-bold cursor-pointer">
                          Print Back-to-Back
                        </label>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Message{" "}
                          <span className="text-sm text-gray-700">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-48 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          placeholder="Enter message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
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
                    alt="Sample OR"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">
                    Brochure
                  </h2>
                  <p className="text-lg text-black leading-relaxed">
                    Official receipt, often known as an OR, is a record that
                    confirms the completion of a service-related sale
                    transaction.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas mollitia pariatur saepe totam quaerat 
                    voluptate deleniti nihil culpa modi? Nihil quasi est odit ut ratione aspernatur dicta odio non nemo.
                  </p>

                  {/* Paper Type + Pack Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies{" "}
                        <span className="text-sm text-gray-700">(min 1000)</span>
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
                          Size
                        </label>
                        <select
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        >
                          <option value="">Select size</option>
                          <option>11”x17”</option>
                          <option>17”x22”</option>
                          <option>22”x34”</option>
                          <option>81/2”x14”</option>
                        </select>
                      </div>
                  </div>

                  {/* Business Name + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Type of Paper
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select Calendar type</option>
                        <option>Single Month (12 pages)</option>
                        <option>Double Month (6 pages)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select Color</option>
                        <option>11”x17”</option>
                        <option>17”x22”</option>
                        <option>22”x34”</option>
                        <option>81/2”x14”</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Lamination
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select Calendar type</option>
                        <option>Single Month (12 pages)</option>
                        <option>Double Month (6 pages)</option>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Your Order</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to place this order?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-xl border border-gray-300">
                Cancel
              </button>
              <button onClick={handleConfirmOrder} className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Brochure;
