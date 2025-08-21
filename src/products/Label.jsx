import Nav from '../component/navigation';
import label from "../assets/ICONS.png"; // Assuming sticker/label image
import { ArrowBigLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Label() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />

      <div className="max-w-full mx-auto p-5 bg-[#FAF9F7] min-h-screen">

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
            <img src={label} alt="Labels" className="rounded-lg border" />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Label Printing</h2>
            <p className="mb-4 text-sm text-gray-700">
              Custom waterproof or adhesive labels for packaging, branding, and products.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Choose from matte, glossy, or transparent finishes with full-color printing.
            </p>

            <h3 className="font-semibold mb-2">Order Details</h3>
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium">Upload Design</label>
                <input type="file" className="mt-1 w-full border border-gray-300 p-2 rounded-md" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Quantity</label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>100</option>
                    <option>500</option>
                    <option>1000</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Size</label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>2x2 in</option>
                    <option>3x3 in</option>
                    <option>4x4 in</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Message (optional)</label>
                  <textarea className="mt-1 w-full border border-gray-300 p-2 rounded-md h-28 resize-none"></textarea>
                </div>
                <div className="w-1/3 flex flex-col">
                  <div className="h-[22px]"></div>
                  <div className="border border-gray-300 p-4 rounded-md flex flex-col justify-between h-28">
                    <span className="text-sm text-gray-500">Estimated cost</span>
                    <p className="text-xl font-bold text-gray-800">₱2,000.00</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                For bulk orders, please contact <span className="font-medium">#09123456789</span>
              </p>

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

export default Label;
