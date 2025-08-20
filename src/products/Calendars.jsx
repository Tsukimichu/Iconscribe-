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

          <div className="w-full flex justify-center items-start">
            <img
              src={calendar}
              alt="Calendar"
              className="rounded-lg border max-w-md w-full h-max object-contain"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Calendars</h2>
            <p className="mb-4 text-sm text-gray-700">
              Commercial Calendars are the most popular type of calendars in the Philippines. Every year,
              commercial calendars are given away by companies during Christmas & New Year. These
              are premade calendars where customization is limited to the top ad space.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              The ad space depends on the size of the calendar. Companies have the option of having the
              same top image in every sheet or a different image in every sheet. Commercial calendars
              contain information like Philippine Holidays and Tax Reminders. In the provinces,
              information on lunar phases and tides are invaluable to farmers and fishermen. If
              your customers are located primarily in the provinces, commercial calendars are the
              cheapest and most effective way to reach them.
            </p>

            <h3 className="font-semibold mb-3">Order Details</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
        
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-medium">Layout</label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>RP8501 - Com1 8.5x14 12 Sheets Square</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Quantity (pcs)</label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>300pcs</option>
                  <option>500pcs</option>
                  <option>1000pcs</option>
                </select>
              </div>

              
              <div>
                <label className="block text-sm font-medium">Size (in)</label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>22” x 7”</option>
                  <option>24” x 8”</option>
                </select>
              </div>
            </div>

            
            <div className="grid md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium">
                  Message <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <textarea
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md h-[100px]"
                  placeholder="Enter message"
                ></textarea>
              </div>

              <div className="flex justify-between items-center border border-gray-300 p-4 rounded-md">
                <div>
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-xl font-bold text-gray-800">₱6,000.00</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              If you have any questions, please contact{" "}
              <span className="font-medium">#09123456789</span>
            </p>

           
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendars;
