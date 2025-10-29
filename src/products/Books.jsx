import Nav from "../component/navigation";
import sampleBook from "../assets/Book.png"; 
import { ArrowBigLeft, Upload, Phone, Mail, Contact, MessageCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
import UploadSection from "../component/UploadSection";
import { useToast } from "../component/ui/ToastProvider";

function Books() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const [estimatedPrice, setEstimatedPrice] = useState(0);


  


  // User profile state
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  // Watch token login state
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // Fetch user profile if logged in
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
            id: data.data.user_id,
            name: data.data.name || "",
            email: data.data.email || "",
            address: data.data.address || "",
            phone: data.data.phone || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [isLoggedIn]);

  // Product visibility
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/api/product-status")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p.product_name === "Books");
        if (product && (product.status === "Inactive" || product.status === "Archived")) {
          setVisible(false);
        }
      })
      .catch((err) => console.error("Error loading product status:", err));
  }, []);

  if (!visible) return null;

  const [quantity, setQuantity] = useState("");
  const [pages, setPages] = useState("");
  const [binding, setBinding] = useState("");
  const [paperType, setPaperType] = useState("");
  const [coverFinish, setCoverFinish] = useState("");
  const [colorPrinting, setColorPrinting] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const { showToast } = useToast();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowConfirm(true);
    }
  };


  // Handle Place Order button
   const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("You must be logged in to place an order.", "error");
        return;
      }

      // Build attributes array
      const attributes = [
        { name: "Number of Pages", value: pages },
        { name: "Binding Type", value: binding },
        { name: "Paper Type", value: paperType },
        { name: "Cover Finish", value: coverFinish },
        { name: "Color Printing", value: colorPrinting },
        { name: "Additional Notes", value: notes },
      ].filter((attr) => attr.value && attr.value.trim() !== "");

      // Create order in backend
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          product_id: 2,
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

      const orderItemId =
        data.order_item_id || data.orderItemId || data.id || data.order_id;

      if (!orderItemId) {
        showToast("Order created, but missing ID from server.", "error");
        return;
      }

      // Upload file
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

      // Reset form and modal
      setShowConfirm(false);
      setQuantity("");
      setPages("");
      setBinding("");
      setPaperType("");
      setCoverFinish("");
      setColorPrinting("");
      setNotes("");
      setFile(null);

      navigate("/dashboard");
    } catch (err) {
      console.error("Error placing order:", err);
      showToast("Something went wrong while placing the order.", "error");
    }
  };

    useEffect(() => {
    // Basic base rates (you can adjust these)
      const baseRatePerPage = 0.5;  // ₱ per page
      const bindingRates = {
        "Perfect Binding": 30,
        "Saddle Stitch": 20,
        "Hardcover": 50,
        "Spiral": 25,
      };
      const paperRates = {
        Matte: 1.0,
        Glossy: 1.2,
        "Book Paper": 0.9,
      };
      const coverRates = {
        Matte: 10,
        Glossy: 15,
        "Soft Touch": 20,
      };
      const colorRates = {
        "Full Color": 1.5,
        "Black & White": 1.0,
        Mixed: 1.2,
      };

      if (!quantity || !pages) {
        setEstimatedPrice(0);
        return;
      }

      const bindingCost = bindingRates[binding] || 0;
      const paperMultiplier = paperRates[paperType] || 1;
      const coverCost = coverRates[coverFinish] || 0;
      const colorMultiplier = colorRates[colorPrinting] || 1;

      // Formula
      const total =
        quantity *
        (pages * baseRatePerPage * paperMultiplier * colorMultiplier +
          bindingCost +
          coverCost);

      setEstimatedPrice(total);
    }, [quantity, pages, binding, paperType, coverFinish, colorPrinting]);




  return (
    <>
      <Nav />
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-[120rem] p-2 sm:p-2">
          {isLoggedIn ? (
            <>
              {/* Back Button + Title */}
              <div className="flex items-center gap-6 mb-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowBigLeft className="w-7 h-7" />
                </button>
                <h2 className="text-4xl font-bold text-black ml-200">
                  Book Printing Request
                </h2>
              </div>


              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Preview */}
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-4 text-black">Books</h2>
                  <p className="text-lg text-black mb-6 text-center max-w-xl">
                    Get your books professionally printed with high-quality paper, multiple binding options, and durable finishes.
                  </p>
                  <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
                    <img
                      src={sampleBook}
                      alt="Sample Book"
                      className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                </div>

                {/* Right: Order Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
                  {/* User Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold">Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold">Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Location & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold">Location</label>
                      <input
                        type="text"
                        value={userProfile.address}
                        onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold">Contact Number</label>
                      <input
                        type="text"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>
                  </div>

                  {/* Book Attributes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold">Number of Copies</label>
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
                      <label className="block text-base font-semibold">Number of Pages</label>
                      <input
                        type="number"
                        min="4"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Binding Type + Paper Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-semibold text-black">
                            Binding Type
                          </label>
                            <select
                              value={binding}
                              onChange={(e) => setBinding(e.target.value)}
                              className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                              required
                            >
                              <option value="">Select binding</option>
                              <option>Perfect Binding</option>
                              <option>Saddle Stitch</option>
                              <option>Hardcover</option>
                              <option>Spiral</option>
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
                              <option>Book Paper</option>
                            </select>
                        </div>
                      </div>

                  {/* Cover Finish + Color */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-semibold text-black">
                            Cover Finish
                          </label>
                            <select
                              value={coverFinish}
                              onChange={(e) => setCoverFinish(e.target.value)}
                              className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                            >
                              <option value="">Select finish</option>
                              <option>Matte</option>
                              <option>Glossy</option>
                              <option>Soft Touch</option>
                            </select>
                        </div>
                        <div>
                          <label className="block text-base font-semibold text-black">
                            Color Printing
                          </label>
                            <select
                              value={colorPrinting}
                              onChange={(e) => setColorPrinting(e.target.value)}
                              className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                              required
                            >
                              <option value="">Select option</option>
                              <option>Full Color</option>
                              <option>Black & White</option>
                              <option>Mixed</option>
                            </select>
                        </div>
                      </div>


                  {/* Upload + Notes + Estimated Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Upload */}
                    <div>
                      <UploadSection
                        uploadCount={1}
                        onUploadComplete={(res) => {
                          if (res?.files?.[0]) setFile(res.files[0]);
                        }}
                      />
                    </div>

                  {/* Right: Notes + Price */}
                  <div className="flex flex-col justify-between h-full">
                    {/* Notes */}
                    <div className="flex flex-col gap-3">
                      <label className="block text-base font-semibold text-black">
                        Additional Notes <span className="text-sm text-gray-700">(optional)</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-45 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        placeholder="Enter a message"
                      ></textarea>
                    </div>

                    {/* Estimated Price Box */}
                    <div className="mt-4 border border-blue-200 bg-blue-50 rounded-2xl shadow-sm p-5 text-right">
                      <p className="text-base text-gray-700 font-medium">Estimated Price</p>
                      <p className="text-3xl font-bold text-blue-700 mt-1">
                        ₱{estimatedPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 italic mt-1">
                        *Final price may vary depending on specifications
                      </p>
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
            </>
          ) : (
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
                  Book Printing Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full rounded-2xl flex items-center justify-center overflow-hidden group">
                  <img
                    src={sampleBook}
                    alt="Sample Book"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">Books</h2>
                  <p className="text-lg text-black leading-relaxed">
                    Print professional-quality books with your choice of size,
                    paper type, and binding. Perfect for self-publishing, manuals,
                    or custom projects.
                  </p>

                  {/* Quantity + Page Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Copies <span className="text-sm text-gray-700">(min 50)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        min="50"
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
                        placeholder="Enter total pages"
                        min="4"
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Binding Type + Paper Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Binding Type
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select binding</option>
                        <option>Perfect Binding</option>
                        <option>Saddle Stitch</option>
                        <option>Hardcover</option>
                        <option>Spiral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Paper Type
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select paper</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Book Paper</option>
                      </select>
                    </div>
                  </div>

                  {/* Cover Finish + Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Cover Finish
                      </label>
                      <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black">
                        <option value="">Select finish</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Soft Touch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color Printing
                      </label>
                      <select
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select option</option>
                        <option>Full Color</option>
                        <option>Black & White</option>
                        <option>Mixed</option>
                      </select>
                    </div>
                  </div>


                  {/* Price + Place Order */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-0">
                    <div className="flex justify-end gap-4">
                      {/* Contact Us Button */}
                      <button
                        type="button"
                        onClick={() => setShowContactModal(true)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                      >
                        Contact Us
                      </button>

                      {/* Place Order Button */}
                      <button
                        type="submit"
                        onClick={handlePlaceOrder}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-8 py-3 rounded-xl font-semibold text-lg"
                      >
                        Log In to Order
                      </button>
                    </div>
                  </div>

                  {/* Contact Modal */}
                  {showContactModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadeIn">
                        <button
                          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowContactModal(false)}
                        >
                          <XCircle className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                          <Contact className="text-blue-600 w-6 h-6" /> Contact Us
                        </h3>

                        <div className="space-y-4 text-black">
                          <div className="flex items-center gap-2">
                            <Contact className="text-green-600 w-5 h-5" />
                            <span className="font-medium">+63 912 345 6789</span>
                          </div>
                          <a
                            href="mailto:iconscribe@email.com"
                            className="flex items-center gap-2 text-blue-700 hover:underline"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">iconscribe@email.com</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">Confirm Your Order</h2>
            <p className="text-base text-black mb-6">
              Are you sure you want to place this order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Books;
