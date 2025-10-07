import Nav from "../component/navigation";
import sampleBook from "../assets/Binding.png";
import {
  ArrowBigLeft,
  Upload,
  Phone,
  Mail,
  Contact,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Binding() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // user profile
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    business: "",
  });

  // form states
  const [quantity, setQuantity] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [bindingType, setBindingType] = useState("");
  const [paperType, setPaperType] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  // modals
  const [showConfirm, setShowConfirm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [visible, setVisible] = useState(true);

  // check login
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // fetch user profile
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
            business: data.data.business || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [isLoggedIn]);

  // check product status (visibility)
  useEffect(() => {
    fetch("http://localhost:5000/api/product-status")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p.product_name === "Binding");
        if (
          product &&
          (product.status === "Inactive" || product.status === "Archived")
        ) {
          setVisible(false);
        }
      })
      .catch((err) => console.error("Error loading product status:", err));
  }, []);

  // handle form submit
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  // ✅ handle confirm order
  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const customDetails = {
        PageCount: pageCount,
        BindingType: bindingType,
        PaperType: paperType,
        Notes: notes,
      };

      // send to backend
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          product_id: 1, // product_id for Binding
          quantity,
          urgency: "Normal",
          status: "Pending",
          custom_details: customDetails,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Order placed successfully!");
        setShowConfirm(false);
        // reset
        setQuantity("");
        setPageCount("");
        setBindingType("");
        setPaperType("");
        setNotes("");
        setFile(null);
      } else {
        alert("⚠️ Failed to place order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("⚠️ Something went wrong while placing the order.");
    }
  };

  if (!visible) return null;

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
                  Binding Request
                </h2>
              </div>

              {/* Form Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Image */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black">
                    Binding Services
                  </h2>
                  <p className="text-lg text-black mb-6 text-center max-w-xl">
                    Get your documents professionally bound with high-quality
                    paper and multiple styles.
                  </p>
                  <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
                    <img
                      src={sampleBook}
                      alt="Sample Binding"
                      className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                </div>

                {/* Right: Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Name
                      </label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, name: e.target.value })
                        }
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
                        value={userProfile.email}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, email: e.target.value })
                        }
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Location + Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Location
                      </label>
                      <input
                        type="text"
                        value={userProfile.address}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            address: e.target.value,
                          })
                        }
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={userProfile.phone}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, phone: e.target.value })
                        }
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>
                  </div>

                  {/* Quantity + Page Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
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
                        min="4"
                        value={pageCount}
                        onChange={(e) => setPageCount(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Binding + Paper Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Binding Type
                      </label>
                      <select
                        value={bindingType}
                        onChange={(e) => setBindingType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select binding</option>
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
                      <select
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select paper</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Bond Paper</option>
                        <option>Book Paper</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload + Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="block text-base font-semibold text-black">
                        Files:
                      </h3>
                      <label className="flex items-center justify-center gap-2 border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 shadow-sm hover:border-yellow-600 hover:bg-yellow-100 transition cursor-pointer">
                        <Upload className="w-5 h-10 text-yellow-500" />
                        <span className="text-base font-medium text-black">
                          Upload Your File
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </label>
                    </div>

                    <div className="flex flex-col gap-3 mt-0">
                      <label className="block text-base font-semibold text-black">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-19 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter a message"
                      ></textarea>
                    </div>
                  </div>

                  {/* Contact + Submit */}
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

              {/* ✅ Confirmation Modal */}
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
                        className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-black"
                        onClick={() => setShowConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmOrder}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-700 text-xl">Please log in.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Binding;
