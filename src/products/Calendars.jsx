import Nav from "../component/navigation";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import calendar from '../assets/calendar.png';

function Calendars() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-[#FAF9F7] min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 hover:bg-gray-300 rounded-md text-sm font-medium flex items-center"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Service Details</h1>
        </div>

        {/* Book-style layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left side (image) */}
          <div className="w-full">
            <img
              src={calendar}
              alt="Sample OR"
              className="rounded-lg border w-full"
            />
          </div>

          {/* Right side (details) */}
          <div>
            <h2 className="text-xl font-bold mb-2">Official Receipt</h2>
            <p className="mb-4 text-sm text-gray-700">
              Official receipt, often known as an OR, is a record that confirms the completion of a service-related sale transaction.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
            </p>

            <h3 className="font-semibold mb-2">Order Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Upload required documents</label>
                <input
                  type="text"
                  value="Photocopy of COR and Last Receipt"
                  readOnly
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendars;
