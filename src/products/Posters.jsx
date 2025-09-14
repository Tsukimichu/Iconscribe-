import React, { useState } from "react";
import Nav from "../component/navigation";
import poster from "../assets/Flyers.png";
import { ArrowBigLeft, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Posters() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isLoggedIn = true; // toggle for testing

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="w-full max-w-[95rem] mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-12">
          {/* Header with Back Button inside card */}
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowBigLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Main Layout - Always Show */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Posters</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Make a bold statement with{" "}
                <span className="font-medium">custom posters</span>. Perfect
                for events, promotions, or personal projects. Choose from
                multiple sizes and finishes with vibrant full-color printing.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={poster}
                  alt="Posters"
                  className="w-full h-full object-contain rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-8">
              {/* Upload - ONLY visible if logged in */}
              {isLoggedIn && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Design
                  </label>
                  <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl w-full cursor-pointer transition hover:scale-105 hover:shadow-lg">
                    <Upload size={18} /> Upload File
                    <input type="file" className="hidden" />
                  </label>
                </div>
              )}

              {/* Copies + Size */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Number of Copies{" "}
                    <span className="text-xs text-gray-500">(min. 1,000)</span>
                  </label>
                  <input
                    type="number"
                    min="1000"
                    defaultValue="1000"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Size
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>12” x 18”</option>
                    <option>18” x 24”</option>
                    <option>24” x 36”</option>
                  </select>
                </div>
              </div>

              {/* Colored + Lamination */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Colored?
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Lamination
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                    <option>None</option>
                    <option>UV</option>
                    <option>Plastic</option>
                    <option>Matte</option>
                    <option>3D</option>
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
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-28 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Add special instructions..."
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                  <span className="text-sm text-gray-500">Estimated Cost</span>
                  <p className="text-2xl font-extrabold text-gray-900">₱5,000.00</p>
                </div>
              </div>

              {/* Note */}
              {!isLoggedIn && (
                <p className="text-xs text-gray-500">
                  Please log in to upload or customize a design.
                </p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-12 py-4 text-lg rounded-xl font-semibold"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Login/Signup Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Login or Sign Up</h2>
            <p className="text-sm text-gray-600 mb-6">
              Please log in or create an account to upload a design or customize your order.
            </p>

            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white py-3 rounded-xl font-semibold">
                Login
              </button>
              <button className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:shadow-lg hover:scale-105 transition text-gray-800 py-3 rounded-xl font-semibold">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Posters;
