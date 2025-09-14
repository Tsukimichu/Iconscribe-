import React, { useState } from "react";
import Nav from "../component/navigation";
import businesscard from "../assets/BusinessCard.png";
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BusinessCard() {
  const navigate = useNavigate();
  const isLoggedIn = false; // 👈 toggle for testing

  const [size, setSize] = useState("2” x 3.5” (Standard)");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Main Card Section */}
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

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: Preview */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Business Card
              </h1>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                High-quality business cards with sharp colors and premium
                finish. Available in various sizes and quantities. Same-day
                printing available on request.
              </p>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Perfect for professionals and entrepreneurs who want to make a
                lasting impression. Choose your size, upload your design, or let
                us help you create one.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={businesscard}
                  alt="Business Card"
                  className="w-full h-[420px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-8">
              {/* Upload + Customize (hidden if logged out) */}
              {isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl w-full cursor-pointer transition hover:scale-105 hover:shadow-lg">
                    <Upload size={18} /> Upload Design
                    <input type="file" className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/customize/business-card")}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl w-full transition hover:scale-105 hover:shadow-lg"
                  >
                    <Paintbrush size={18} /> Customize Design
                  </button>
                </div>
              )}

              {/* Number of Copies + Size */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Number of Copies{" "}
                    <span className="text-xs text-gray-500">(min. 100)</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    defaultValue="100"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option>2” x 3.5” (Standard)</option>
                    <option>3.5” x 3.5” (Square)</option>
                    <option>2” x 2” (Mini)</option>
                    <option>Custom Size</option>
                  </select>
                </div>
              </div>

              {/* Custom Size Fields */}
              {size === "Custom Size" && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Width (inches)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.1"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Height (inches)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.1"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* Paper Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Paper Type
                </label>
                <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                  <option>Matte</option>
                  <option>Glossy</option>
                  <option>Textured</option>
                  <option>Recycled</option>
                </select>
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
                    placeholder="Add special instructions..."
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                  <span className="text-sm text-gray-500">Estimated Cost</span>
                  <p className="text-2xl font-extrabold text-gray-900">
                    ₱1,500.00
                  </p>
                </div>
              </div>

              {/* Note when logged out */}
              {!isLoggedIn && (
                <p className="text-xs text-gray-500">
                  Please log in to upload or customize a design.
                </p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-12 py-4 text-lg rounded-xl font-semibold transition ${
                    isLoggedIn
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-lg hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isLoggedIn}
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessCard;
