import Nav from "../component/navigation";
import Book from "../assets/Book.png";
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();
  const isLoggedIn = false; 

  return (
    <>
      <Nav />
      <div className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="w-full max-w-[90rem] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Back Button + Title */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Books</h1>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center max-w-md">
                Premium quality{" "}
                <span className="font-medium">
                  Yearbooks, Coffee Table Books, Thesis Books, and Magazines
                </span>{" "}
                — crafted with professional finishes and fast production.
              </p>

              <div className="relative w-full max-w-xl rounded-xl overflow-hidden shadow-lg group">
                <img
                  src={Book}
                  alt="Sample Book"
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-4">
              {/* Book Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Book Type
                </label>
                <select className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm">
                  <option>Yearbook</option>
                  <option>Coffee Table Book</option>
                  <option>Thesis Book</option>
                  <option>Magazine</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Copies + Pages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Copies
                  </label>
                  <input
                    type="number"
                    min={10}
                    defaultValue={10}
                    className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Pages
                  </label>
                  <input
                    type="number"
                    min={20}
                    defaultValue={50}
                    className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm"
                  />
                </div>
              </div>

              {/* Colored + Size */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                  Colored Print
                </label>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Size
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm">
                    <option>8.5” x 11”</option>
                    <option>6” x 9”</option>
                    <option>5.5” x 8.5”</option>
                  </select>
                </div>
              </div>

              {/* Book Cover Section */}
              <div className="p-3 bg-gray-50 border rounded-lg shadow-inner space-y-3">
                <h3 className="text-base font-semibold text-gray-800">
                  Book Cover
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Lamination
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm">
                      <option>Plastic</option>
                      <option>UV</option>
                      <option>3D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Binding
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm">
                      <option>Hardbound</option>
                      <option>Perfect Binding</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Inside Print", "Dust Guard", "Stamping"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-700"
                    >
                      <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {/* Pages Paper Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Pages Paper Type
                </label>
                <select className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm">
                  <option>Glossy</option>
                  <option>Matte</option>
                  <option>Book Paper</option>
                </select>
              </div>

              {/* Upload + Customize */}
              {isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg w-full cursor-pointer shadow-md text-sm">
                    <Upload size={16} /> Upload Design
                    <input type="file" className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/customize")}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg w-full shadow-md text-sm"
                  >
                    <Paintbrush size={16} /> Customize
                  </button>
                </div>
              )}

              {/* Message + Price */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Message <span className="text-[10px] text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-2.5 rounded-lg h-20 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-sm"
                    placeholder="Enter message"
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-gray-50 border border-gray-200 rounded-lg shadow p-4">
                  <span className="text-xs text-gray-500">Estimated Cost</span>
                  <p className="text-xl font-bold text-gray-900">
                    ₱10,000.00
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    isLoggedIn ? console.log("Order placed") : navigate("/login")
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-md hover:scale-105 transition text-white px-8 py-3 rounded-lg font-semibold text-base"
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

export default Books;
