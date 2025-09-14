import Nav from "../component/navigation";
import or from "../assets/atp.png";
import { ArrowBigLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function OfficialReceipt() {
  const navigate = useNavigate();
  const isLoggedIn = true; // toggle for testing
  const [quantity, setQuantity] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <>
      <Nav />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[95rem] bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-5 h-5" />
            </button>
          </div>

          {/* ✅ Always show preview + form, regardless of login */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Official Receipts
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Official receipt, often known as an OR, is a record that
                confirms the completion of a service-related sale transaction.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={or}
                  alt="Sample OR"
                  className="w-full h-full sm:h-[480px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter contact number"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Business Name + Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter business name"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Quantity{" "}
                    <span className="text-xs text-gray-500">(min 100)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    min="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Paper Type + Pack Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Paper Type
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">Select paper type</option>
                    <option>Carbonized</option>
                    <option>Colored Bondpaper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Pack Type
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">Select pack type</option>
                    <option>Padded</option>
                    <option>Stapled</option>
                    <option>Loose</option>
                  </select>
                </div>
              </div>

              {/* ✅ Upload Section - hidden if not logged in */}
              {isLoggedIn && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload the required documents:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {["Copy of COR", "Copy of Last Receipt"].map(
                      (label, idx) => (
                        <label
                          key={idx}
                          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white hover:border-blue-500 hover:bg-blue-50/30 transition cursor-pointer"
                        >
                          <Upload className="w-6 h-6 text-blue-500 mb-1" />
                          <span className="text-xs font-medium text-gray-700 text-center">
                            {label}
                          </span>
                          <input type="file" className="hidden" />
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Message + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Message{" "}
                    <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-28 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter message"
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-md p-6">
                  <span className="text-sm text-gray-500">Estimated Cost</span>
                  <p className="text-2xl font-extrabold text-gray-900">
                    ₱1,100.00
                  </p>
                </div>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500">
                If you have any questions, please contact{" "}
                <span className="font-medium">#09123456789</span> or{" "}
                <span className="font-medium">iconscribe@email.com</span>
              </p>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold"
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Your Order
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to place this order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
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

export default OfficialReceipt;
