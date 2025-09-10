import Nav from "../component/navigation";
import label from "../assets/ICONS.png";
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Label() {
  const navigate = useNavigate();
  const isLoggedIn = true; // 👈 toggle for testing

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Service Request</h1>
        </div>

        {isLoggedIn ? (
          <div className="w-full max-w-[95rem] mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="grid grid-cols-2 gap-12 items-start">
              {/* Left: Preview */}
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  Label Printing
                </h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                  Custom waterproof or adhesive labels for packaging, branding,
                  and products.
                </p>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                  Choose from matte, glossy, or transparent finishes with
                  full-color printing.
                </p>

                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={label}
                    alt="Label Preview"
                    className="w-full h-[480px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              </div>

              {/* Right: Form */}
              <form className="space-y-6">
                {/* Upload Design */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Design
                  </label>
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full cursor-pointer mt-2">
                    <Upload size={18} /> Choose File
                    <input type="file" className="hidden" />
                  </label>
                </div>

                {/* Quantity + Size */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Quantity
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                      <option>100</option>
                      <option>500</option>
                      <option>1000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Size
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                      <option>2x2 in</option>
                      <option>3x3 in</option>
                      <option>4x4 in</option>
                    </select>
                  </div>
                </div>

                {/* Message + Cost */}
                <div className="grid grid-cols-3 gap-6">
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
                      ₱2,000.00
                    </p>
                  </div>
                </div>

                {/* Note */}
                <p className="text-xs text-gray-500">
                  For bulk orders, please contact{" "}
                  <span className="font-medium">#09123456789</span>
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
        ) : (
          <p className="text-center text-gray-600">
            Please log in to place an order.
          </p>
        )}
      </div>
    </>
  );
}

export default Label;
