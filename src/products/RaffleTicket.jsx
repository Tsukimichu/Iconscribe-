import React, { useState } from "react";
import Nav from "../component/navigation";
import raffle from "../assets/RaffleTicket.png"; // 👈 Replace with your raffle ticket image
import { ArrowBigLeft, Upload, Paintbrush } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RaffleTicket() {
  const navigate = useNavigate();
  const isLoggedIn = true; // 👈 toggle for testing

  const [booklets, setBooklets] = useState(1);
  const [colored, setColored] = useState("No");
  const [paperType, setPaperType] = useState("Bond Paper");

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
                Raffle Ticket Printing
              </h1>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center max-w-xl">
                Print professional raffle tickets with secure numbering and
                perforation. Choose your preferred size, color option, and
                paper type for durability and style.
              </p>

              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={raffle}
                  alt="Raffle Ticket Service"
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
                    onClick={() => navigate("/customize")}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl w-full transition hover:scale-105 hover:shadow-lg"
                  >
                    <Paintbrush size={18} /> Customize Design
                  </button>
                </div>
              )}

              {/* Number of Booklets */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Number of Booklets <span className="text-xs text-gray-500">(min. 1)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={booklets}
                  onChange={(e) => setBooklets(e.target.value)}
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Size
                </label>
                <select
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  defaultValue="6outs"
                >
                  <option value="6outs">6 outs of Long Bond Paper</option>
                </select>
              </div>

              {/* Colored? */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Colored?
                </label>
                <select
                  value={colored}
                  onChange={(e) => setColored(e.target.value)}
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Paper Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Paper Type
                </label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option>Bond Paper</option>
                  <option>Matte Paper</option>
                  <option>Glossy Paper</option>
                  <option>Recycled Paper</option>
                </select>
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
                  <p className="text-2xl font-extrabold text-gray-900">₱0.00</p>
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
                  disabled={!isLoggedIn}
                  onClick={() => {
                    if (!isLoggedIn) navigate("/login");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-12 py-4 text-lg rounded-xl font-semibold disabled:opacity-50"
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

export default RaffleTicket;
