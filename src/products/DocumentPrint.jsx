import Nav from '../component/navigation';
import document from "../assets/DocumentP.png";
import { ArrowBigLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DocumentPrint() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />

      <div className="max-w-full mx-auto p-5 bg-[#FAF9F7] max-h-screen">

        {/* Back Button & Title */}
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

          {/* Image Section */}
          <div className="w-full flex justify-center items-start">
            <img
              src={document}
              alt="Document Printing"
              className="rounded-lg border"
            />
          </div>

          {/* Content Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">Document Printing</h2>
            <p className="mb-4 text-sm text-gray-700">
              We provide fast, accurate document printing for school, business, or personal use.
              Choose from multiple paper types and sizes with high-quality finishes.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Perfect for reports, contracts, research papers, and everyday printing needs.
              Same-day service available for urgent requirements.
            </p>

            <h3 className="font-semibold mb-2">Order Details</h3>

            <div className="space-y-4">

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium">Upload Document</label>
                <input
                  type="file"
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              {/* Quantity and Size */}
              <div className="flex gap-4">
                <div className="w-1/2">
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

                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Paper Size
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>A4</option>
                    <option>Letter (8.5” x 11”)</option>
                    <option>Legal (8.5” x 14”)</option>
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
                    placeholder="Enter special instructions"
                  ></textarea>
                </div>

                <div className="w-1/3 flex flex-col">
                  <div className="h-[22px]"></div>
                  <div className="border border-gray-300 p-4 rounded-md flex flex-col justify-between h-28">
                    <div>
                      <span className="text-sm text-gray-500">Estimated cost</span>
                      <p className="text-xl font-bold text-gray-800">₱500.00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <p className="text-xs text-gray-500">
                If you have any questions, please contact{" "}
                <span className="font-medium">#09123456789</span>
              </p>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                  Place Order
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DocumentPrint;
