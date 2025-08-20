import Nav from "../component/navigation";
import or from '../assets/atp.png';
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OfficialReceipt() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-[#FAF9F7] min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 hover:bg-gray-300 rounded-md text-sm font-medium"
          >
            <ArrowBigLeft/>
          </button>
          <h1 className="text-2xl font-bold">Service Details</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="w-full">
            <img
              src={or}
              alt="Sample OR"
              className="rounded-lg border w-full"
            />
          </div>

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

              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Quantity <span className="text-xs text-gray-500">(count)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>10pcs</option>
                    <option>20pcs</option>
                    <option>50pcs</option>
                  </select>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Size <span className="text-xs text-gray-500">(inch)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>8.5” x 11”</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium">
                  Message <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <textarea
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                  placeholder="Enter message"
                ></textarea>
              </div>

              {/* Estimated Cost */}
              <div className="flex justify-between items-center border border-gray-300 p-4 rounded-md">
                <div>
                  <span className="text-sm text-gray-500">Estimated cost</span>
                  <p className="text-xl font-bold text-gray-800">₱1,100.00</p>
                </div>
              </div>

              {/* Contact Info */}
              <p className="text-xs text-gray-500">
                If you have any questions, please contact: <span className="font-medium">#09123456789</span>
              </p>

              {/* Submit Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OfficialReceipt;
