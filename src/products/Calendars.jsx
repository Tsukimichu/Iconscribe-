import Nav from "../component/navigation";
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";
import calendar from "../assets/calendar.png";

function Calendars() {
  const navigate = useNavigate();
  const isLoggedIn = false; // replace with real auth state later

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
              <h2 className="text-3xl font-bold mb-3 text-gray-800">
                Calendars
              </h2>
              <p className="text-base text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Commercial Calendars are the most popular type of calendars in
                the Philippines. They not only help people keep track of dates
                but also serve as effective advertising tools.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src={calendar}
                  alt="Sample Calendar"
                  className="w-full h-[500px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-8">
              {/* Layout + Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Layout
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>RP8501 - Com1 8.5x14 12 Sheets Square</option>
                    <option>RP9002 - Com2 11x17 6 Sheets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Quantity (pcs)
                  </label>
                  <input
                    type="number"
                    min="100"
                    defaultValue="100"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum order is <span className="font-medium">100 pcs</span>
                  </p>
                </div>
              </div>

              {/* Calendar Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Calendar Type
                </label>
                <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                  <option>Single Month (12 pages)</option>
                  <option>Double Month (6 pages)</option>
                </select>
              </div>

              {/* Calendar Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Calendar Size
                </label>
                <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                  <option>11” x 17”</option>
                  <option>17” x 22”</option>
                  <option>22” x 34”</option>
                  <option>8.5” x 14”</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Color
                </label>
                <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                  <option>Single Color</option>
                  <option>Full Color</option>
                </select>
              </div>

              {/* Upload + Customize (Shown only when logged in) */}
              {isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl w-full cursor-pointer shadow-md">
                    <Upload size={18} /> Upload Design
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          console.log("File selected:", e.target.files[0].name);
                        }
                      }}
                    />
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

              {/* Note */}
              <p className="text-xs text-gray-500">
                If you have any questions, please contact{" "}
                <span className="font-medium">#09123456789</span>
              </p>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-xl hover:scale-105 transition text-white px-12 py-4 rounded-xl font-semibold text-lg"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>

          {!isLoggedIn && (
            <p className="text-center text-gray-600 mt-8">
              Please log in to upload or customize a design.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Calendars;
