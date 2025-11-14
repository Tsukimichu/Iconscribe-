  import Nav from "../component/navigation";
  import sampleBook from "../assets/Binding.png";
  import { ArrowBigLeft, Phone, Mail } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  import { useToast } from "../component/ui/ToastProvider";
  import UploadSection from "../component/UploadSection";

  function Binding() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));


    //estimate
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    const [agreed, setAgreed] = useState(false);


    const calculatePrice = (quantity, pages, bindingType, paperType) => {
      if (!quantity || !pages) return 0;

      let basePrice = 0.10 * pages;

      // Adjust by paper type
      switch (paperType) {
        case "Glossy":
          basePrice *= 1.2;
          break;
        case "Matte":
          basePrice *= 1.1;
          break;
        case "Bond Paper":
          basePrice *= 1.05;
          break;
        case "Book Paper":
          basePrice *= 1.0;
          break;
        default:
          break;
      }

      return basePrice * quantity;
    };

    // user profile
    const [userProfile, setUserProfile] = useState({
      id: "",
      name: "",
      email: "",
      address: "",
      phone: "",
      business: "",
    });

    // form states
    const [quantity, setQuantity] = useState("");
    const [pageCount, setPageCount] = useState("");
    const [bindingType, setBindingType] = useState("");
    const [paperType, setPaperType] = useState("");
    const [notes, setNotes] = useState("");
    const [file, setFile] = useState(null);
    const { showToast } = useToast();

    // modals
    const [showConfirm, setShowConfirm] = useState(false);
    const [visible, setVisible] = useState(true);

    // check login
    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      };
      checkToken();
      window.addEventListener("auth-change", checkToken);
      return () => window.removeEventListener("auth-change", checkToken);
    }, []);

    // fetch user profile
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUserProfile({
              id: data.data.user_id || "",
              name: data.data.name || "",
              email: data.data.email || "",
              address: data.data.address || "",
              phone: data.data.phone || "",
              business: data.data.business || "",
            });
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }, [isLoggedIn]);

    // check product visibility
    useEffect(() => {
      fetch("http://localhost:5000/api/product-status")
        .then((res) => res.json())
        .then((data) => {
          const product = data.find((p) => p.product_name === "Binding");
          if (product && (product.status === "Inactive" || product.status === "Archived")) {
            setVisible(false);
          }
        })
        .catch((err) => console.error("Error loading product status:", err));
    }, []);

    // place order button click
    const handlePlaceOrder = (e) => {
      e.preventDefault();
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        setShowConfirm(true);
      }
    };

     // confirm and send order (with upload)
    const handleConfirmOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("You must be logged in to place an order.", "error");
          return;
        }

        // Build attributes array instead of custom_details
        const attributes = [
          { name: "Page Count", value: pageCount },
          { name: "Binding Type", value: bindingType },
          { name: "Paper Type", value: paperType },
          { name: "Notes", value: notes },
        ].filter(attr => attr.value && attr.value.trim() !== "");

        // Create order via backend
        const res = await fetch("http://localhost:5000/api/orders/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userProfile.id,
              product_id: 1,
              quantity,
              urgency: "Normal",
              status: "Pending",
              attributes, 
            }),
          });


        const data = await res.json();

        if (!data.success) {
          showToast("Failed to place order.", "error");
          return;
        }

        const orderItemId = data.order_item_id;

        // Upload file (if provided)
        if (file) {
          const formData = new FormData();
          formData.append("file1", file);

          const uploadRes = await fetch(
            `http://localhost:5000/api/orders/upload/single/${orderItemId}`,
            {
              method: "POST",
              body: formData,
            }
          );

          const uploadData = await uploadRes.json();

          if (uploadData.success) {
            showToast("Order placed and file uploaded successfully!", "success");
          } else {
            showToast("Order placed, but file upload failed.", "warning");
          }
        } else {
          showToast("Order placed successfully!", "success");
        }

        // Reset UI
        setShowConfirm(false);
        setQuantity("");
        setPageCount("");
        setBindingType("");
        setPaperType("");
        setNotes("");
        setFile(null);
      } catch (err) {
        console.error("Error placing order:", err);
        showToast("Something went wrong while placing the order.", "error");
      }
    };

    useEffect(() => {
      const price = calculatePrice(quantity, pageCount, bindingType, paperType);
      setEstimatedPrice(price);
    }, [quantity, pageCount, bindingType, paperType]);


    if (!visible) return null;

    return (
      <>
        <Nav />
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
          <div className="w-full max-w-[120rem] p-2 sm:p-2">
            {isLoggedIn ? (
              <>
                {/* Back Button + Title */}
                <div className="flex items-center gap-1 mb-10">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition"
                  >
                    <ArrowBigLeft className="w-7 h-7" />
                  </button>
                  <h2 className="text-4xl font-bold text-black">
                    Service Request
                  </h2>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left: Image */}
                  <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-4 text-black">
                      Binding Services
                    </h2>
                    <p className="text-lg text-black mb-6 text-center max-w-xl">
                      Get your documents professionally bound with high-quality
                      paper and multiple styles.
                    </p>
                    <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
                      <img
                        src={sampleBook}
                        alt="Sample Binding"
                        className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    </div>
                  </div>

                  {/* Right: Form */}
                  <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
                    {/* User Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Name
                        </label>
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, name: e.target.value })
                          }
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
                          value={userProfile.email}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, email: e.target.value })
                          }
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Location
                        </label>
                        <input
                          type="text"
                          value={userProfile.address}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              address: e.target.value,
                            })
                          }
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, phone: e.target.value })
                          }
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Number of Books
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Page Count
                        </label>
                        <input
                          type="number"
                          min="4"
                          value={pageCount}
                          onChange={(e) => setPageCount(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Binding + Paper Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Binding Type
                        </label>
                        <select
                          value={bindingType}
                          onChange={(e) => setBindingType(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        >
                          <option value="">Select binding</option>
                          <option>Perfect Binding</option>
                          <option>Saddle Stitch</option>
                          <option>Hardcover</option>
                          <option>Spiral</option>
                          <option>Ring Binding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">
                          Paper Type
                        </label>
                        <select
                          value={paperType}
                          onChange={(e) => setPaperType(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        >
                          <option value="">Select paper</option>
                          <option>Matte</option>
                          <option>Glossy</option>
                          <option>Bond Paper</option>
                          <option>Book Paper</option>
                        </select>
                      </div>
                    </div>

                    {/* Upload + Notes + Estimated Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Upload Section */}
                      <div>
                        <UploadSection
                          uploadCount={1}
                          onUploadComplete={(res) => {
                            if (res?.files?.[0]) setFile(res.files[0]);
                          }}
                        />
                      </div>

                      {/* Right: Notes + Estimated Price */}
                      <div className="flex flex-col justify-between h-full">
                        {/* Notes Section */}
                        <div className="flex flex-col gap-3">
                          <label className="block text-base font-semibold text-black">
                            Additional Notes (optional)
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-13 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Enter a message"
                          ></textarea>
                        </div>

                        {/* Estimated Price Box */}
                        <div className="mt-4 border border-blue-200 bg-blue-50 rounded-2xl shadow-sm p-5 text-right">
                          <p className="text-base text-gray-700 font-medium">Estimated Price</p>
                          <p className="text-3xl font-bold text-blue-700 mt-1">
                            {estimatedPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                          </p>
                          <p className="text-sm text-gray-500 italic mt-1">
                            *Final price may vary depending on specifications
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact + Submit */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <p className="text-sm text-black">If you have any questions:</p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                          <span className="flex items-center gap-1 font-medium text-blue-700">
                            <Phone size={16} /> #09123456789
                          </span>
                          <a
                            href="mailto:iconscribe@email.com"
                            className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
                          >
                            <Mail size={16} /> iconscribe@gmail.com
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg"
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Confirmation Modal */}
                {showConfirm && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
                      
                      <h2 className="text-xl font-bold text-black mb-4">Confirm Your Order</h2>

                      {/* TERMS AND CONDITIONS CARD */}
                      <div className="border rounded-xl p-4 h-64 overflow-y-auto text-sm text-black bg-gray-50 mb-4">
                        <h3 className="text-lg font-semibold mb-2">ICONScribe – Terms and Conditions</h3>

                        <p className="font-semibold mt-2">1. Acceptance of Terms</p>
                        <p>By creating an account, placing an order, or using the System, you agree to these Terms and Conditions.</p>

                        <p className="font-semibold mt-2">2. User Accounts</p>
                        <ul className="list-disc ml-5">
                          <li>Provide accurate information when signing up.</li>
                          <li>You are responsible for safeguarding your login details.</li>
                          <li>Any activity under your account is your responsibility.</li>
                        </ul>

                        <p className="font-semibold mt-2">3. Ordering Process</p>
                        <ul className="list-disc ml-5">
                          <li>All orders are final once submitted.</li>
                          <li>ICONScribe may accept or reject orders due to availability or policy issues.</li>
                          <li>Order confirmation will be sent via system, email, or SMS.</li>
                        </ul>

                        <p className="font-semibold mt-2">4. Pricing and Payment</p>
                        <ul className="list-disc ml-5">
                          <li>Prices are in PHP and may change without notice.</li>
                          <li>Only Cash is accepted.</li>
                          <li>Failure to pay may result in order cancellation.</li>
                        </ul>

                        <p className="font-semibold mt-2">5. Delivery and Pick-Up</p>
                        <ul className="list-disc ml-5">
                          <li>Clients may choose Delivery or Pick-Up.</li>
                          <li>Delivery: must provide complete and accurate address. Fees may apply.</li>
                          <li>Pick-Up: orders must be claimed at the ICONScribe location.</li>
                        </ul>

                        <p className="font-semibold mt-2">6. Modifications and Cancellations</p>
                        <ul className="list-disc ml-5">
                          <li>Cancellations allowed within 24 hours after placing the order.</li>
                          <li>No cancellations after 24 hours.</li>
                          <li>Processed/printed orders may not be modified.</li>
                        </ul>

                        <p className="font-semibold mt-2">7. Refund and Return Policy</p>
                        <p>Refunds/reprints only if:</p>
                        <ul className="list-disc ml-5">
                          <li>Product is damaged.</li>
                          <li>Error was caused by ICONScribe.</li>
                        </ul>

                        <p>Not liable for errors caused by:</p>
                        <ul className="list-disc ml-5">
                          <li>Incorrect details provided by client.</li>
                          <li>Low-quality or incorrect uploaded files.</li>
                          <li>Changes requested after processing.</li>
                        </ul>

                        <p>Refund requests must be submitted within [Insert # of days].</p>

                        <p className="font-semibold mt-2">8. Client Responsibilities</p>
                        <ul className="list-disc ml-5">
                          <li>Provide accurate details and correct files.</li>
                          <li>No illegal, inappropriate, or copyrighted uploads.</li>
                          <li>Use the system responsibly.</li>
                        </ul>

                        <p className="font-semibold mt-2">9. System Availability</p>
                        <p>The system may experience downtime or updates.</p>

                        <p className="font-semibold mt-2">10. Data Privacy</p>
                        <p>Your information is protected under the ICONScribe Privacy Policy.</p>

                        <p className="font-semibold mt-2">11. Limitation of Liability</p>
                        <p>ICONScribe is not responsible for:</p>
                        <ul className="list-disc ml-5">
                          <li>Losses caused by incorrect client information.</li>
                          <li>User-uploaded content issues.</li>
                          <li>Technical delays or emergencies.</li>
                          <li>Indirect or consequential damages.</li>
                        </ul>

                        <p className="font-semibold mt-2">12. Changes to Terms</p>
                        <p>ICONScribe may update these Terms at any time.</p>

                        <p className="font-semibold mt-2">13. Contact Information</p>
                        <p>[iconscribe@gmail.com / Phone Number / Bantad, Boac, Marinduque]</p>
                      </div>

                      {/* AGREEMENT CHECKBOX */}
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="checkbox"
                          id="agree"
                          className="w-4 h-4"
                          checked={agreed}
                          onChange={() => setAgreed(!agreed)}
                        />
                        <label htmlFor="agree" className="text-sm text-black">
                          I have read and agree to the Terms and Conditions
                        </label>
                      </div>

                      {/* BUTTONS */}
                      <div className="flex justify-end gap-3">
                        <button
                          className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-black"
                          onClick={() => setShowConfirm(false)}
                        >
                          Cancel
                        </button>

                        <button
                          onClick={agreed ? handleConfirmOrder : () => alert("Please agree to the Terms and Conditions first.")}
                          className={`px-4 py-2 rounded-xl text-white transition ${
                            agreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          Confirm
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-700 text-xl">Please log in.</p>
            )}
          </div>
        </div>
      </>
    );
  }

  export default Binding;
