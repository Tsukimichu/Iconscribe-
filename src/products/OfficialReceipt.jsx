import Nav from "../component/navigation";
import or from "../assets/atp.png";
import { ArrowBigLeft, Upload, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function OfficialReceipt() {
  const navigate = useNavigate();
  const isLoggedIn = true; // toggle for testing
  const [quantity, setQuantity] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <>
      <Nav />
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2 sm:p-2">
          {isLoggedIn ? (
            <>
              {/* Back Button + Title */}
              <div className="flex items-center gap-3 mb-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowBigLeft className="w-7 h-7" />
                </button>
                <h2 className="text-4xl font-bold text-black ml-200">
                  Service Request
                </h2>
              </div>

              {/* Preview + Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Preview */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black flex justify-center">
                    Official Receipts
                  </h2>
                  <p className="text-lg text-black mb-6 leading-relaxed text-center max-w-xl">
                    Official receipt, often known as an OR, is a record that
                    confirms the completion of a service-related sale
                    transaction.
                  </p>

                  <div className="relative w-full max-w-3xl overflow-hidden group">
                    <img
                      src={or}
                      alt="Sample OR"
                      className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                </div>

                {/* Right: Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
                  {/* Name, Email, Location, Contact */}
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your location"
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter contact number"
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                    </div>
                  </>

                  {/* Business Name + Quantity (Side by Side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter business name"
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Quantity{" "}
                        <span className="text-sm text-gray-700">(min 100)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="100"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Paper Type + Pack Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Paper Type
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select paper type</option>
                        <option>Carbonized</option>
                        <option>Colored Bondpaper</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Pack Type
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select pack type</option>
                        <option>Padded</option>
                        <option>Stapled</option>
                        <option>Loose</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload + Size + Message */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-black">
                        Required Documents
                      </h3>
                      {[
                        { label: "Copy of COR" },
                        { label: "Copy of Last Receipt" },
                      ].map((file, idx) => (
                        <label
                          key={idx}
                          className="flex flex-col items-center justify-center border-2 border-blue-400 bg-blue-50 rounded-xl p-4 shadow-sm hover:border-blue-600 hover:bg-blue-100 transition cursor-pointer"
                        >
                          <Upload className="w-5 h-5 text-blue-500 mb-1" />
                          <span className="text-sm font-medium text-black text-center">
                            {file.label}
                          </span>
                          <input type="file" className="hidden" />
                        </label>
                      ))}
                    </div>

                    {/* Size + Message */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Size
                        </label>
                        <select
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        >
                          <option value="">Select size</option>
                          <option>A4</option>
                          <option>A5</option>
                          <option>Half Page</option>
                          <option>Full Page</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Message{" "}
                          <span className="text-sm text-gray-700">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-23 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          placeholder="Enter message"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Price + Contact */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <p className="text-sm text-black">
                        If you have any questions:
                      </p>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                        <span className="flex items-center gap-1 font-medium text-blue-700">
                          <Phone size={16} /> #09123456789
                        </span>
                        <a
                          href="mailto:iconscribe@email.com"
                          className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
                        >
                          <Mail size={16} /> iconscribe@email.com
                        </a>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-md p-6 w-64 text-right">
                      <span className="text-base text-gray-700">
                        Estimated Cost
                      </span>
                      <p className="text-3xl font-extrabold text-black">
                        ₱1,100.00
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </>











          ) : (

            // ETO LAMAN NG FALSE
            <>
              {/* Back Button + Title */}
              <div className="flex items-center gap-3 mb-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowBigLeft className="w-7 h-7" />
                </button>
                <h2 className="text-4xl font-bold text-black ml-200">
                  Service Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                  <img
                    src={or}
                    alt="Sample OR"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">
                    Official Receipts
                  </h2>
                  <p className="text-lg text-black leading-relaxed">
                    Official receipt, often known as an OR, is a record that
                    confirms the completion of a service-related sale
                    transaction.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas mollitia pariatur saepe totam quaerat 
                    voluptate deleniti nihil culpa modi? Nihil quasi est odit ut ratione aspernatur dicta odio non nemo.
                  </p>

                  {/* Business Name + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Quantity <span className="text-sm text-gray-700">(min 100)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="100"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-black">
                          Size
                        </label>
                        <select
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        >
                          <option value="">Select size</option>
                          <option>A4</option>
                          <option>A5</option>
                          <option>Half Page</option>
                          <option>Full Page</option>
                        </select>
                      </div>
                  </div>

                  {/* Upload + Size + Message */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-black">
                        Required Documents
                      </h3>
                      {[
                        { label: "Copy of COR" },
                        { label: "Copy of Last Receipt" },
                      ].map((file, idx) => (
                        <label
                          key={idx}
                          className="flex flex-col items-center justify-center border-2 border-blue-400 bg-blue-50 rounded-xl p-4 shadow-sm hover:border-blue-600 hover:bg-blue-100 transition cursor-pointer"
                        >
                          <Upload className="w-5 h-5 text-blue-500 mb-1" />
                          <span className="text-sm font-medium text-black text-center">
                            {file.label}
                          </span>
                          <input type="file" className="hidden" />
                        </label>
                      ))}
                    </div>

                    {/* Size + Message */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Message <span className="text-sm text-gray-700">(optional)</span>
                        </label>
                        <textarea
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-46 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          placeholder="Enter message"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Price + Place Order */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-md p-6 w-64 text-right">
                      <span className="text-base text-gray-700">Estimated Cost</span>
                      <p className="text-3xl font-extrabold text-black">
                        ₱1,100.00
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        onClick={handlePlaceOrder}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>// empty content when not logged in

            
          )}
        </div>
      </div>








      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">
              Confirm Your Order
            </h2>
            <p className="text-base text-black mb-6">
              Are you sure you want to place this order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-black"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfficialReceipt;
