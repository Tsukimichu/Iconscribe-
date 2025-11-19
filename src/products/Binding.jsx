import Nav from "../component/navigation";
import sampleBook from "../assets/Binding.png";
import { ArrowBigLeft, Upload, Phone, Mail, Contact, MessageCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../component/ui/ToastProvider";
import UploadSection from "../component/UploadSection";
import { API_URL } from "../api";
import { computeBindingQuotation } from "../utils/computeBindingQuotation";


function Binding() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Estimate
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [agreed, setAgreed] = useState(false);


  const [showContactModal, setShowContactModal] = useState(false);

  const calculatePrice = (quantity) => {
    const q = computeBindingQuotation({
      copies: quantity,
      basePrice: 250, // you can change this anytime
    });

    return q ? q.total : 0;
  };


  // User Profile
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    business: "",
  });

  // Form States
  const [quantity, setQuantity] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [bindingType, setBindingType] = useState("");
  const [paperType, setPaperType] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  const { showToast } = useToast();

  const [showConfirm, setShowConfirm] = useState(false);
  const [visible, setVisible] = useState(true);

  // Listen for login/logout changes
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener("auth-change", checkToken);

    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // Fetch User Profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setUserProfile({
            id: d.data.user_id || "",
            name: d.data.name || "",
            email: d.data.email || "",
            address: d.data.address || "",
            phone: d.data.phone || "",
            business: d.data.business || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [isLoggedIn]);

  // Check Product Visibility
  useEffect(() => {
    fetch(`${API_URL}/product-status`)
      .then((r) => r.json())
      .then((data) => {
        const product = data.find((p) => p.product_name === "Binding");
        if (product && (product.status === "Inactive" || product.status === "Archived")) {
          setVisible(false);
        }
      })
      .catch((err) => console.error("Error loading product status:", err));
  }, []);

  // Handle Order Button
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  // Confirm Order
  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("You must be logged in to place an order.", "error");
        return;
      }

      const attributes = [
        { name: "Page Count", value: pageCount },
        { name: "Binding Type", value: bindingType },
        { name: "Paper Type", value: paperType },
        { name: "Notes", value: notes },
      ].filter((a) => a.value && a.value.trim() !== "");

      const res = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          product_id: 1,
          quantity,
          urgency: "Normal",
          status: "Pending",
          estimated_price: estimatedPrice,   
          attributes,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        showToast("Failed to place order.", "error");
        return;
      }

      const orderItemId = data.order_item_id;

      if (file) {
        const fd = new FormData();
        fd.append("file1", file);

        const uploadRes = await fetch(
          `${API_URL}/orders/upload/single/${orderItemId}`,
          {
            method: "POST",
            body: fd,
          }
        );

        const uploadData = await uploadRes.json();

        if (uploadData.success) {
          showToast("Order placed and file uploaded successfully!", "success");
        } else {
          showToast("Order placed, but file upload failed.", "warning");
        }
      } else {
        showToast("Order placed successfully!", "success");
      }

      setShowConfirm(false);
      setQuantity("");
      setPageCount("");
      setBindingType("");
      setPaperType("");
      setNotes("");
      setFile(null);
    } catch (err) {
      console.error("Error placing order:", err);
      showToast("Something went wrong.", "error");
    }
  };

  // Auto-update estimated price
  useEffect(() => {
    setEstimatedPrice(calculatePrice(quantity));
  }, [quantity]);


  if (!visible) return null;

  return (
    <>
      <Nav />

      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2">

          {/* ==========================================================
               LOGGED IN UI
          ============================================================= */}
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
                <h2 className="text-4xl font-bold text-black">Service Request</h2>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* LEFT IMAGE */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black">Binding Services</h2>

                  <p className="text-lg text-black mb-6 text-center max-w-xl">
                    Get your documents professionally bound with high-quality materials.
                  </p>

                  <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
                    <img
                      src={sampleBook}
                      alt="Binding"
                      className="w-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* RIGHT FORM */}
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">

                  {/* USER INFO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
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
                        onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Contact Number</label>
                      <input
                        type="text"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* ORDER DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Number of Books</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Page Count</label>
                      <input
                        type="number"
                        min="4"
                        value={pageCount}
                        onChange={(e) => setPageCount(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* BINDING + PAPER TYPE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Binding Type</label>
                      <select
                        value={bindingType}
                        onChange={(e) => setBindingType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                        required
                      >
                        <option value="">Select Binding</option>
                        <option>Perfect Binding</option>
                        <option>Saddle Stitch</option>
                        <option>Hardcover</option>
                        <option>Spiral</option>
                        <option>Ring Binding</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold">Paper Type</label>
                      <select
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                        required
                      >
                        <option value="">Select Paper</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Bond Paper</option>
                        <option>Book Paper</option>
                      </select>
                    </div>
                  </div>

                  {/* UPLOAD + NOTES + ESTIMATED PRICE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload */}
                    <div>
                      <UploadSection
                        uploadCount={1}
                        onUploadComplete={(res) => {
                          if (res?.files?.[0]) setFile(res.files[0]);
                        }}
                      />
                    </div>

                    {/* Notes + Price */}
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
                    </div>
                  </div>

                  {/* CONTACT + BUTTON */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    {/* Contact */}
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

                    {/* Submit */}
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg"
                    >
                      Place Order
                    </button>

                  </div>

                </form>
              </div>

              {/* CONFIRMATION MODAL */}
              {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">

                    <h2 className="text-xl font-bold text-black mb-4">Confirm Your Order</h2>

                    <div className="border rounded-xl p-4 h-64 overflow-y-auto text-sm text-black bg-gray-50 mb-4">
                      <h3 className="text-lg font-semibold mb-2">ICONScribe – Terms and Conditions</h3>
                      <p className="font-semibold mt-2">1. Acceptance of Terms</p>
                      <p>By creating an account or placing an order, you agree to our terms.</p>

                      <p className="font-semibold mt-2">2. Ordering Process</p>
                      <ul className="list-disc ml-5">
                        <li>All orders are final once submitted.</li>
                        <li>Confirmation will be sent via system or email.</li>
                      </ul>

                      <p className="font-semibold mt-2">3. Pricing</p>
                      <ul className="list-disc ml-5">
                        <li>Prices are in PHP and may change without notice.</li>
                      </ul>

                      <p className="font-semibold mt-2">4. Delivery / Pick-Up</p>
                      <ul className="list-disc ml-5">
                        <li>Delivery fees may apply.</li>
                        <li>Pick-up available at ICONScribe location.</li>
                      </ul>

                      <p className="font-semibold mt-2">5. Modifications</p>
                      <p>No changes allowed after processing or printing begins.</p>

                      <p className="font-semibold mt-2">6. Refund Policy</p>
                      <p>Refunds/reprints only for printing errors caused by ICONScribe.</p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                      />
                      <label className="text-sm text-black">
                        I have read and agree to the Terms and Conditions
                      </label>
                    </div>

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
          ) : (
            <>
              {/* ==========================================================
                NOT LOGGED IN UI (MATCH BROCHURE LAYOUT EXACTLY)
              ============================================================== */}

              {/* Back Button + Title */}
              <div className="flex items-center gap-3 mb-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowBigLeft className="w-7 h-7" />
                </button>

                <h2 className="text-4xl font-bold text-black">Service Request</h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">

                {/* LEFT: Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                  <img
                    src={sampleBook}
                    alt="Sample Binding"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* RIGHT: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">

                  <h2 className="text-4xl font-bold text-black">Binding Services</h2>

                  <p className="text-lg text-black leading-relaxed">
                    Get your documents professionally bound with high-quality materials
                    and multiple binding options suited for school, business, or personal use.
                  </p>

                  <p className="text-black leading-relaxed">
                    Easily customize the number of books, page count, paper type, and
                    binding style. Upload your files and we’ll take care of the rest with
                    professional printing and finishing.
                  </p>

                  {/* Number of Books + Page Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Books
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="1"
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Page Count
                      </label>
                      <input
                        type="number"
                        placeholder="Enter total pages"
                        min="4"
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Binding Type + Paper Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Binding Type
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select a binding style</option>
                        <option>Perfect Binding</option>
                        <option>Saddle Stitch</option>
                        <option>Hardcover</option>
                        <option>Spiral</option>
                        <option>Ring Binding</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Paper Type
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Choose paper</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Bond Paper</option>
                        <option>Book Paper</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact + Login Buttons */}
                  <div className="flex justify-end gap-4 mt-6">

                    {/* Contact Us */}
                    <button
                      type="button"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                      onClick={() => setShowContactModal(true)}
                    >
                      Contact Us
                    </button>

                    {/* Login */}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                    >
                      Log In to Order
                    </button>

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
    </>
  );
}

export default Binding;
