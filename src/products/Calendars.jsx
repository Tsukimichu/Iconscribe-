import Nav from "../component/navigation";
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";
import calendar from "../assets/calendar.png";

function Calendars() {
  const navigate = useNavigate();
  const isLoggedIn = true; // change with real auth later

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
                  Calendars
                </h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                  Commercial Calendars are the most popular type of calendars in
                  the Philippines. They not only help people keep track of dates
                  but also serve as effective advertising tools.
                </p>

                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={calendar}
                    alt="Sample Calendar"
                    className="w-full h-[480px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              </div>

              {/* Right: Form */}
              <form className="space-y-6">
                {/* Layout + Quantity */}
                <div className="grid grid-cols-2 gap-4">
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
                      Minimum order is 100 pcs
                    </p>
                  </div>
                </div>

                {/* Size */}
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

                {/* Upload + Customize */}
                <div className="flex flex-col sm:flex-row gap-4">
                {/* Upload Design */}
                <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full cursor-pointer">
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

                {/* Customize Design */}
                <button
                  type="button"
                  onClick={() => navigate("/customize")}
                  className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl w-full"
                >
                  <Paintbrush size={18} /> Customize Design
                </button>
              </div>

                {/* Message + Price */}
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
                    <span className="text-sm text-gray-500">
                      Estimated Cost
                    </span>
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

export default Calendars;
