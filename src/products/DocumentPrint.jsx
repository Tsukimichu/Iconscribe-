import React, { useState } from "react";
import Nav from "../component/navigation";
import document from "../assets/DocumentP.png";
import { ArrowBigLeft, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DocumentPrint() {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoggedIn = true; // 👈 toggle this between true/false to test

  return (
    <>
      <Nav />

      <div className="w-full min-h-screen p-6 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {isLoggedIn ? "Service Request" : "Service Details"}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Section */}
          <div className="flex flex-col items-center">
            <img
              src={document}
              alt="Document Printing"
              className="rounded-xl border max-w-md w-full object-contain shadow-sm"
            />
            <h2 className="text-lg font-semibold mt-4">Document Printing</h2>
            <p className="text-sm text-gray-600 text-center mt-2 max-w-md">
              We provide fast, accurate document printing for school, business, or
              personal use. Choose from multiple paper types and sizes with
              high-quality finishes. Same-day service available for urgent
              requirements.
            </p>
          </div>

          {/* Right Section */}
          {isLoggedIn ? (
            /* ✅ FULL FORM when logged in */
            <form className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              {/* Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Document
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-blue-500 transition cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <input type="file" className="hidden" />
                </label>
              </div>

              {/* Quantity + Paper Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Quantity <span className="text-xs text-gray-500">(pages)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>10</option>
                    <option>50</option>
                    <option>100</option>
                    <option>200</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Paper Size</label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>A4</option>
                    <option>Letter (8.5” x 11”)</option>
                    <option>Legal (8.5” x 14”)</option>
                  </select>
                </div>
              </div>

              {/* Message + Price */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    Message <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-2 rounded-md h-28 resize-none"
                    placeholder="Enter special instructions"
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-xl font-bold text-gray-800">₱500.00</p>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
                >
                  Place Order
                </button>
              </div>
            </form>
          ) : (
            /* ❌ LIMITED VIEW when not logged in */
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Order Estimation</h3>

              {/* Quantity + Paper Size */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium">
                    Quantity <span className="text-xs text-gray-500">(pages)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>10</option>
                    <option>50</option>
                    <option>100</option>
                    <option>200</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Paper Size</label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>A4</option>
                    <option>Letter (8.5” x 11”)</option>
                    <option>Legal (8.5” x 14”)</option>
                  </select>
                </div>
              </div>

              {/* Estimation only */}
              <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
                <span className="text-sm text-gray-500">Estimated cost</span>
                <p className="text-xl font-bold text-gray-800">₱500.00</p>
              </div>

              {/* Place Order Button (opens login/signup modal) */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login/Signup Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Login or Sign Up</h2>
            <p className="text-sm text-gray-600 mb-6">
              Please log in or create an account to place your order.
            </p>

            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                Login
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentPrint;
