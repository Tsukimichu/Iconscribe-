import Nav from "../component/navigation";
import { ArrowBigLeft } from "lucide-react";
import Book from "../assets/Book.png";
import { useNavigate } from "react-router-dom";

function Books() {
   const navigate = useNavigate();
   
  return (
    <>
    <Nav/>
     <div className="max-w-full mx-auto p-5 bg-[#FAF9F7] min-h-screen">
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
            src={Book}
            alt="Sample Book"
            className="rounded-lg border"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Books</h2>
          <p className="mb-4 text-sm text-gray-700">
            Our high quality presentation prints are available with a combination of Perfect Binding & Printing in as fast as same day. Full color presentations are fast and easy with different paper stocks to choose from.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <h3 className="font-semibold mb-2">Order Details</h3>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium">Upload Design</label>
              <input
                type="file"
                className="mt-1 w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Quantity <span className="text-xs text-gray-500">(count)</span></label>
                <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2">
                  <span>100pcs</span>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">Size <span className="text-xs text-gray-500">(inch)</span></label>
                <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                  <option>8.5” x 11”</option>

                </select>
              </div>
            </div>

           
            <div className="space-y-4">
                
                <div className="flex gap-4">
                 
                  <div className="flex-1">
                    <label className="block text-sm font-medium">
                      Message <span className="text-xs text-gray-500">(optional)</span>
                    </label>
                    <textarea
                      className="mt-1 w-full border border-gray-300 p-2 rounded-md h-28"
                      placeholder="Enter message"
                    ></textarea>
                  </div>

                 
                  <div className="w-1/3 border border-gray-300 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Estimated cost</span>
                      <p className="text-xl font-bold text-gray-800">₱10,000.00</p>
                    </div>
                  </div>
                </div>

                
                <p className="text-xs text-gray-500">
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
      </div>
    </div>
    </>
  );
}

export default Books;
