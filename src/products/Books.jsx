import Nav from "../component/navigation";
import { ArrowBigLeft, Upload, Brush } from "lucide-react";
import Book from "../assets/Book.png";
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();

  const isLoggedIn = true; // 👈 toggle true/false for testing

  return (
    <>
      <Nav />
      {isLoggedIn ? (
        /* ✅ Logged-in view */
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              Service Request
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12 flex-grow">
            {/* Left Section */}
            <div className="space-y-6 flex flex-col">
              <div>
                <h2 className="text-xl font-semibold mb-2">Books</h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  High-quality{" "}
                  <span className="font-medium">
                    Yearbooks, Coffee Table Books, Thesis Books, and Magazines
                  </span>{" "}
                  — crafted with fast production and premium binding options.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border flex-grow">
                <img
                  src={Book}
                  alt="Sample Book"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Section */}
            <form className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col">
              {/* Book Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Book Type
                </label>
                <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                  <option>Yearbook</option>
                  <option>Coffee Table Book</option>
                  <option>Thesis Book</option>
                  <option>Magazine</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Design
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:border-yellow-300 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 font-medium">
                    Drag & drop or click to upload
                  </span>
                  <input type="file" className="hidden" />
                </label>
              </div>

              {/* Quantity + Size */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-300">
                    <option>100</option>
                    <option>150</option>
                    <option>200</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-300">
                    <option>8.5” x 11”</option>
                    <option>6” x 9”</option>
                    <option>5.5” x 8.5”</option>
                  </select>
                </div>
              </div>

              {/* Message + Price */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add special instructions..."
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white border rounded-xl shadow p-5">
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-2xl font-bold text-gray-800">₱10,000.00</p>
                </div>
              </div>

              {/* Note */}
              <p className="text-sm text-gray-500">
                For inquiries, contact{" "}
                <span className="font-medium">#09123456789</span>
              </p>

              {/* Buttons */}
              <div className="flex justify-between gap-4 mt-auto">
                <button
                  type="button"
                  onClick={() => navigate('/customize/:productName')}
                  className="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-white px-2 py-1 rounded-xl shadow-md transition font-medium text-lg"
                >
                  <Brush className="w-4 h-4"/>
                  Customize Design
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition font-medium text-lg"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ❌ Not logged-in view */
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              Service Details
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12 flex-grow">
            {/* Left Side */}
            <div className="flex flex-col items-center">
              <div className="rounded-2xl overflow-hidden shadow-lg border flex-grow">
                <img
                  src={Book}
                  alt="Sample Book"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mt-6">Books</h2>
              <p className="text-base text-gray-600 text-center mt-2 max-w-md">
                Premium Yearbooks, Coffee Table Books, and more — designed to
                impress with professional finishes.
              </p>
            </div>

            {/* Right Side */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col">
              <h3 className="font-semibold text-xl mb-6">Order Estimation</h3>

              {/* Quantity + Size */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>100</option>
                    <option>150</option>
                    <option>200</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <select className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>8.5” x 11”</option>
                    <option>6” x 9”</option>
                    <option>5.5” x 8.5”</option>
                  </select>
                </div>
              </div>

              {/* Message + Price */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add message..."
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white border rounded-xl shadow p-5">
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-2xl font-bold text-gray-800">₱10,000.00</p>
                </div>
              </div>

              {/* Note */}
              <p className="text-sm text-gray-500 mb-6">
                📞 For inquiries, contact{" "}
                <span className="font-medium">#09123456789</span>
              </p>

              {/* Disabled Button */}
              <div className="flex justify-end mt-auto">
                <button
                  disabled
                  className="bg-gray-400 text-white px-8 py-3 rounded-xl shadow-md font-medium text-lg cursor-not-allowed"
                >
                  Login to Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Books;
