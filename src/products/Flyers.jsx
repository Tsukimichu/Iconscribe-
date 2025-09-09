import React, { useState } from "react";
import Nav from "../component/navigation";
import flyer from "../assets/Posters.png"; 
import { ArrowBigLeft, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Flyers() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
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
          <h1 className="text-3xl font-bold text-gray-800">
            {isLoggedIn ? "Service Request" : "Service Details"}
          </h1>
        </div>

        {isLoggedIn ? (
          <div className="w-full max-w-[95rem] mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="grid grid-cols-2 gap-12 items-start">
              {/* Left: Preview */}
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Flyers</h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                  Promote your{" "}
                  <span className="font-medium">business, events, or campaigns</span> 
                  with our high-quality flyers. Choose from multiple sizes and finishes 
                  to create an eye-catching design. Same-day printing available for urgent needs.
                </p>

                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={flyer}
                    alt="Flyers"
                    className="w-full object-contain rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              </div>

              {/* Right: Form */}
              <form className="space-y-6">
                {/* Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Design
                  </label>
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl w-full cursor-pointer transition">
                    <Upload size={18} /> Upload File
                    <input type="file" className="hidden" />
                  </label>
                </div>

                {/* Quantity + Size */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Quantity <span className="text-xs text-gray-500">(pieces)</span>
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                      <option>100</option>
                      <option>200</option>
                      <option>500</option>
                      <option>1000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Size
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                      <option>8.5” x 11”</option>
                      <option>5.5” x 8.5”</option>
                      <option>4” x 6”</option>
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
                  <div className="flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-md p-6">
                    <span className="text-sm text-gray-500">Estimated Cost</span>
                    <p className="text-2xl font-extrabold text-gray-900">₱10,000.00</p>
                  </div>
                </div>

                {/* Note */}
                <p className="text-xs text-gray-500">
                  For inquiries, contact <span className="font-medium">#09123456789</span>
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
          <div className="text-center text-gray-600">
            <p className="mb-4">Please log in to place an order.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gray-400 text-white px-8 py-3 rounded-xl shadow-md font-medium text-lg"
            >
              Login to Place Order
            </button>
          </div>
        )}
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
              Please log in or create an account to place your order.
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

export default Flyers;
