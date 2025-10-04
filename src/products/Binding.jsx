import Nav from "../component/navigation";
import sampleBook from "../assets/Binding.png"; 
import { ArrowBigLeft, Upload, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { Contact, MessageCircle, XCircle } from "lucide-react";

function Binding() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();

    window.addEventListener("auth-change", checkToken);

    return () => {
      window.removeEventListener("auth-change", checkToken);
    };
  }, []);


  const [quantity, setQuantity] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

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
      fetch("http://localhost:5000/api/product-status")
        .then((res) => res.json())
        .then((data) => {
          const product = data.find((p) => p.product_name === "Binding");
          if (product && (product.status === "Inactive" || product.status === "Archived")) {
            setVisible(false);
          }
        })
        .catch((err) => console.error("Error loading product status:", err));
    }, []);

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

              {/* Preview + Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Preview */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black flex justify-center">
                    Binding Services
                  </h2>
                  <p className="text-lg text-black mb-6 leading-relaxed text-center max-w-xl">
                    Get your documents professionally bound with high-quality
                    paper, multiple binding styles, and durable finishes.
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
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                    </div>
                  </>

                  {/* Quantity + Page Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
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
                      <select
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

                  {/* Upload + Message */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="block text-base font-semibold text-black">Files:</h3>
                      <label className="flex items-center justify-center gap-2 border-2 border-yellow-400 bg-yellow-50 rounded-xl p-4 shadow-sm hover:border-yellow-600 hover:bg-yellow-100 transition cursor-pointer">
                        <Upload className="w-5 h-10 text-yellow-500" />
                        <span className="text-base font-medium text-black">Upload Your File</span>
                        <input type="file" className="hidden" />
                      </label>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-3 mt-0">
                      <label className="block text-base font-semibold text-black">
                        Additional Notes <span className="text-sm text-gray-700">(optional)</span>
                      </label>
                      <textarea
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-19 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        placeholder="Enter a Message"
                      ></textarea>
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
                  Binding Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full rounded-2xl flex items-center justify-center overflow-hidden group">
                  <img
                    src={sampleBook}
                    alt="Sample Binding"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">Binding Services</h2>
                  <p className="text-lg text-black leading-relaxed">
                    Bind your reports, manuscripts, and projects with your
                    preferred style and paper type. Strong, durable, and
                    professional finish guaranteed.
                  </p>

                  {/* Quantity + Page Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
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
                      <select
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
              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Binding;
