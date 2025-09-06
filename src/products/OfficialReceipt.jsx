import Nav from "../component/navigation";
import or from "../assets/atp.png";
import { ArrowBigLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OfficialReceipt() {
  const navigate = useNavigate();
  const isLoggedIn = true; // toggle for testing

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
                    className="w-full h-[480px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              </div>

              {/* Right: Form */}
              <form className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
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
                    />
                  </div>
                </div>

                {/* Location & Contact */}
                <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-4">
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
                      <span className="text-xs text-gray-500">(count)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      min="1"
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Paper Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Paper Type
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">Select paper type</option>
                    <option>Carbonized</option>
                    <option>Colored Bondpaper</option>
                    <option>Padded</option>
                    <option>Stapled</option>
                    <option>Loose</option>
                  </select>
                </div>

                {/* Upload Section (side by side pantay) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload the required documents:
                  </label>
                  <div className="grid grid-cols-2 gap-6">
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
        ) : (
          <p className="text-center text-gray-600">
            Please log in to place an order.
          </p>
        )}
      </div>
    </>
  );
}

export default OfficialReceipt;
