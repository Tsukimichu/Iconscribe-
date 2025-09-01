import Nav from "../component/navigation";
import or from "../assets/atp.png";
import { ArrowBigLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OfficialReceipt() {
  const navigate = useNavigate();

  const isLoggedIn = true; // 👈 toggle this for testing

  return (
    <>
      <Nav />
      {isLoggedIn ? (
        /* ✅ Logged-in view */
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
              <h2 className="text-lg font-bold mb-2">Official Receipts</h2>
              <p className="text-sm text-gray-600 mb-6">
                Official receipt, often known as an OR, is a record that confirms
                the completion of a service-related sale transaction.
              </p>
              <img
                src={or}
                alt="Sample OR"
                className="rounded-xl border max-w-md w-full object-contain shadow-sm"
              />
            </div>

            {/* Right Section */}
            <div>
              <form className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      defaultValue="Aldrin Portento"
                      className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                </div>

                {/* Location & Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Location</label>
                    <input
                      type="text"
                      defaultValue="#30 Bangus St. Murallon Boac, Marinduque"
                      className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      defaultValue="09123456789"
                      className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                </div>

                {/* Business Name + Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Business Name
                    </label>
                    <input
                      type="text"
                      placeholder="-Business name-"
                      className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Quantity <span className="text-xs text-gray-500">(count)</span>
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                      <option>10pcs</option>
                      <option>20pcs</option>
                      <option>50pcs</option>
                    </select>
                  </div>
                </div>

                {/* Upload Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload the required documents:
                  </label>
                  <div className="grid gap-3">
                    {[
                      "Photocopy of COR",
                      "Photocopy of Last Receipt",
                    ].map((label, idx) => (
                      <label
                        key={idx}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-blue-500 transition cursor-pointer"
                      >
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">{label}</span>
                        <input type="file" className="hidden" />
                      </label>
                    ))}
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
                      placeholder="Enter message"
                    ></textarea>
                  </div>
                  <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <span className="text-sm text-gray-500">Estimated cost</span>
                    <p className="text-xl font-bold text-gray-800">₱1,100.00</p>
                  </div>
                </div>

                {/* Note */}
                <p className="text-xs text-gray-500">
                  If you have any questions, please contact{" "}
                  <span className="font-medium">#09123456789</span> or{" "}
                  <span className="font-medium">iconscribe@email.com</span>
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
            </div>
          </div>
        </div>
      ) : (
        /* ❌ Not logged-in view */
        <div className="w-full p-6 bg-white min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <ArrowBigLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Service Details</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left Side */}
            <div className="flex flex-col items-center">
              <img
                src={or}
                alt="Sample OR"
                className="rounded-xl border max-w-md w-full object-contain shadow-sm"
              />
              <h2 className="text-lg font-semibold mt-4">Official Receipt</h2>
              <p className="text-sm text-gray-600 text-center mt-2">
                Official receipt, often known as an OR, confirms a completed
                service-related sale transaction.
              </p>
            </div>

            {/* Right Side */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Order Details</h3>

              {/* Quantity + Size */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium">
                    Quantity <span className="text-xs text-gray-500">(count)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>10pcs</option>
                    <option>20pcs</option>
                    <option>50pcs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Size <span className="text-xs text-gray-500">(inch)</span>
                  </label>
                  <select className="mt-1 w-full border border-gray-300 p-2 rounded-md">
                    <option>8.5” x 11”</option>
                  </select>
                </div>
              </div>

              {/* Message + Price */}
              <div className="grid grid-cols-3 gap-4 mb-6">
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

              {/* Note */}
              <p className="text-xs text-gray-500 mb-4">
                If you have any questions, please contact{" "}
                <span className="font-medium">#09123456789</span>
              </p>

              {/* Submit */}
              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfficialReceipt;
