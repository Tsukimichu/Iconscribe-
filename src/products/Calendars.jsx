import Nav from "../component/navigation";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import calendar from '../assets/calendar.png';

function Calendars() {
  const navigate = useNavigate();
  const isLoggedIn = true; // change this later with real auth

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-[#FAF9F7] max-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 hover:bg-gray-300 rounded-md text-sm font-medium flex items-center"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Service Details</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Preview */}
          <div className="w-full flex justify-center items-start">
            <img
              src={calendar}
              alt="Calendar"
              className="rounded-lg border max-w-md w-full h-max object-contain"
            />
          </div>

          {/* Right Panel */}
          <div>
            <h2 className="text-xl font-bold mb-2">Calendars</h2>
            <p className="mb-4 text-sm text-gray-700">
              Commercial Calendars are the most popular type of calendars in the Philippines...
            </p>
            <p className="mb-6 text-sm text-gray-600">
              The ad space depends on the size of the calendar...
            </p>

            <h3 className="font-semibold mb-3">Order Details</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Layout + Customize Design */}
              <div className="col-span-2 flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Layout</label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>RP8501 - Com1 8.5x14 12 Sheets Square</option>
                  </select>
                </div>
                {isLoggedIn && (
                  <button className="self-end bg-yellow-400 hover:bg-gray-900 text-black px-4 py-2 rounded-md h-[42px]">
                    Customize Design
                  </button>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium">Quantity (pcs)</label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>300pcs</option>
                  <option>500pcs</option>
                  <option>1000pcs</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium">Size (in)</label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>22” x 7”</option>
                  <option>24” x 8”</option>
                </select>
              </div>
            </div>

            {/* Message & Estimated Cost */}
            <div className="grid md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium">
                  Message <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <textarea
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md h-[100px] resize-none"
                  placeholder="Enter message"
                ></textarea>
              </div>

              <div className="border border-gray-300 p-4 rounded-md flex flex-col justify-between h-[100px] mt-6">
                <div>
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-xl font-bold text-gray-800">₱10,000.00</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <p className="text-xs text-gray-500 mb-4">
              If you have any questions, please contact{" "}
              <span className="font-medium">#09123456789</span>
            </p>

            {/* Place Order */}
            <div className="flex justify-end">
              {isLoggedIn ? (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                  Place Order
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                  Login to Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendars;
