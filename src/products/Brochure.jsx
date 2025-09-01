import Nav from "../component/navigation";
import brochure from "../assets/Brochure.png";
import { ArrowBigLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Brochure() {
  const navigate = useNavigate();
  const isLoggedIn = true; // 👈 switch true/false for testing

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Service Request</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Brochure</h2>
            <p className="text-sm text-gray-600 mb-6">
              Professional brochure printing with high-quality paper and
              different binding options for a polished finish.
            </p>
            <img
              src={brochure}
              alt="Sample Brochure"
              className="rounded-xl border max-w-md w-full object-contain shadow-sm"
            />
          </div>

          {/* Right Section */}
          <div>
            <form className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              {/* Business Name + Quantity (always visible if logged in) */}
              {isLoggedIn && (
                <div>
                  <label className="block text-sm font-medium">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter business name"
                    className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              )}

              {/* Quantity (always visible) */}
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>100pcs</option>
                  <option>200pcs</option>
                  <option>500pcs</option>
                </select>
              </div>

              {/* Upload (always visible) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload your design file:
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-blue-500 transition cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <input type="file" className="hidden" />
                </label>
              </div>

              {/* Customize (only if logged in) */}
              {isLoggedIn && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => navigate("/customize")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md shadow-sm border"
                  >
                    Customize Design
                  </button>
                </div>
              )}

              {/* Estimate & Message */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    Message <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="mt-1 w-full border border-gray-300 p-2 rounded-md h-28 resize-none"
                    placeholder="Enter message"
                  ></textarea>
                </div>
                <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-xl font-bold text-gray-800">₱10,000.00</p>
                </div>
              </div>

              {/* Footer Note */}
              {!isLoggedIn && (
                <p className="text-xs text-gray-500">
                  Please log in to customize your design and place an order.
                </p>
              )}
              {isLoggedIn && (
                <p className="text-xs text-gray-500">
                  Questions? Call <span className="font-medium">#09123456789</span>
                </p>
              )}

              {/* Action Button */}
              <div className="flex justify-end">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => alert("Order placed!")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
                  >
                    Place Order
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
                  >
                    Login to Order
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Brochure;
