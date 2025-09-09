import Nav from "../component/navigation";
import businesscard from "../assets/BusinessCard.png";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function BusinessCard() {
  const navigate = useNavigate();

  // replace this with your real auth logic
  const isLoggedIn = false; // toggle true if logged in
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Nav />
      <div className="max-w-full mx-auto p-5 bg-[#FAF9F7] min-h-screen">
        {/* Back Button + Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 hover:bg-gray-300 rounded-md text-sm font-medium"
          >
            <ArrowBigLeft />
          </button>
          <h1 className="text-2xl font-bold">Service Details</h1>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Side (Image) */}
          <div className="w-full">
            <img
              src={businesscard}
              alt="Business Card"
              className="rounded-lg border"
            />
          </div>

          {/* Right Side (Details) */}
          <div>
            <h2 className="text-xl font-bold mb-2">Business Card</h2>
            <p className="mb-4 text-sm text-gray-700">
              High-quality business cards with sharp colors and premium finish —
              available in various sizes and quantities. Same-day printing available
              on request.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Perfect for professionals and entrepreneurs who want to make a
              lasting impression. Choose your size, upload your design, or let us
              help you create one.
            </p>

            <h3 className="font-semibold mb-2">Order Details</h3>

            <div className="space-y-4">
              {isLoggedIn && (
                <div>
                  <label className="block text-sm font-medium">Upload Design</label>
                  <input
                    type="file"
                    className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              )}

              {/* Quantity + Size */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Quantity <span className="text-xs text-gray-500">(pcs)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>100 pcs</option>
                    <option>200 pcs</option>
                    <option>500 pcs</option>
                  </select>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Size <span className="text-xs text-gray-500">(inch)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>2” x 3.5” (Standard)</option>
                    <option>3.5” x 3.5” (Square)</option>
                    <option>2” x 2” (Mini)</option>
                  </select>
                </div>
              </div>

              {/* Message + Cost */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Message <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-2 rounded-md h-28 resize-none"
                    placeholder="Enter message"
                  ></textarea>
                </div>

                <div className="w-1/3 flex flex-col">
                  <div className="h-[22px]"></div>
                  <div className="border border-gray-300 p-4 rounded-md flex flex-col justify-between h-28">
                    <div>
                      <span className="text-sm text-gray-500">Estimated cost</span>
                      <p className="text-xl font-bold text-gray-800">₱1,500.00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <p className="text-xs text-gray-500">
                For inquiries, contact{" "}
                <span className="font-medium">#09123456789</span>
              </p>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                {isLoggedIn && (
                  <button
                    onClick={() => navigate("/customize/business-card")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                  >
                    Create Design
                  </button>
                )}

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowAuthModal(true);
                    } else {
                      // place order logic
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Login Required</h2>
            <p className="text-sm mb-4">
              Please log in or sign up to continue placing your order.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Login / Signup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BusinessCard;
