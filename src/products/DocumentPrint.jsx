import Nav from "../component/navigation";
import document from "../assets/DocumentP.png";
import { ArrowBigLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

function DocumentPrint() {
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
  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="w-full max-w-[95rem] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-12">
          {/* Back Button + Title */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Printing</h1>
              <p className="text-base text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Fast, accurate{" "}
                <span className="font-medium">school, business, and personal printing</span> —
                with multiple paper types, sizes, and high-quality finishes. Same-day
                service available for urgent needs.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src={document}
                  alt="Document Printing"
                  className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-8">
              {/* Upload Section */}
              {isLoggedIn && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Document
                  </label>
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl w-full cursor-pointer shadow-md">
                    <Upload size={18} /> Upload File
                    <input type="file" className="hidden" />
                  </label>
                </div>
              )}

              {/* Quantity + Paper Size */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Quantity <span className="text-xs text-gray-500">(pages)</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    defaultValue={10}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Paper Size
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>A4</option>
                    <option>Letter (8.5” x 11”)</option>
                    <option>Legal (8.5” x 14”)</option>
                  </select>
                </div>
              </div>

              {/* Message + Price */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Message <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-24 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Add special instructions..."
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-lg p-6">
                  <span className="text-sm text-gray-500">Estimated Cost</span>
                  <p className="text-2xl font-extrabold text-gray-900">₱500.00</p>
                </div>
              </div>

              {!isLoggedIn && (
                <p className="text-sm text-red-500">
                  Please log in to upload or place an order.
                </p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    isLoggedIn ? console.log("Order placed") : navigate("/login")
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-12 py-4 rounded-xl font-semibold text-lg"
                >
                  {isLoggedIn ? "Place Order" : "Login to Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default DocumentPrint;
