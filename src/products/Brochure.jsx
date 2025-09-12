import Nav from "../component/navigation";
import brochure from "../assets/Brochure.png";
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Brochure() {
  const navigate = useNavigate();
  const isLoggedIn = true; // 👈 switch to false for testing

  return (
    <>
      <Nav />
      <div className="w-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="w-full max-w-[95rem] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-14">
          
          {/* Back Button + Title */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Brochure</h1>
              <p className="text-base text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Professional brochure printing with high-quality paper and finishing
                options to make your brand stand out.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src={brochure}
                  alt="Sample Brochure"
                  className="w-full h-[480px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-8">
              {/* Business Name + Copies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    Copies
                  </label>
                  <input
                    type="number"
                    min={1000}
                    defaultValue={1000}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Min. order: 1,000 copies
                  </p>
                </div>
              </div>

              {/* Size + Paper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Size
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>8.5" x 11"</option>
                    <option>A4</option>
                    <option>Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Paper
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>Glossy</option>
                    <option>Matte</option>
                  </select>
                </div>
              </div>

              {/* Lamination + Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Lamination
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>None</option>
                    <option>Gloss</option>
                    <option>Matte</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <input type="checkbox" className="w-4 h-4" /> Colored Print
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <input type="checkbox" className="w-4 h-4" /> Back-to-Back
                  </label>
                </div>
              </div>

              {/* Upload + Customize (only if logged in) */}
              {isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl w-full cursor-pointer shadow-md">
                    <Upload size={18} /> Upload Design
                    <input type="file" className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/customize")}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl w-full shadow-md"
                  >
                    <Paintbrush size={18} /> Customize Design
                  </button>
                </div>
              )}

              {/* Message + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Message <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-28 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter message"
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-lg p-6">
                  <span className="text-sm text-gray-500">Estimated Cost</span>
                  <p className="text-2xl font-extrabold text-gray-900">
                    ₱10,000.00
                  </p>
                </div>
              </div>

              {!isLoggedIn && (
                <p className="text-center text-gray-600">
                  Please log in to upload or customize a design.
                </p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    isLoggedIn ? console.log("Order placed") : navigate("/login")
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-xl hover:scale-105 transition text-white px-12 py-4 rounded-xl font-semibold text-lg"
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

export default Brochure;
