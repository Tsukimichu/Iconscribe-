import Nav from "../component/navigation";
import sampleBook from "../assets/Book.png"; 
import { ArrowBigLeft, Upload, Phone, Mail, Contact, MessageCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UploadSection from "../component/UploadSection";
import { useToast } from "../component/ui/ToastProvider";
import { computeBookQuotation } from "../utils/bookQuatation";
import { API_URL } from "../api";

function Books() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // User profile state
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

    const [quantity, setQuantity] = useState("");
    const [pages, setPages] = useState("");
    const [bookType, setBookType] = useState("");
    const [bookSize, setBookSize] = useState("");
    const [binding, setBinding] = useState("");
    const [paperType, setPaperType] = useState("");
    const [coverFinish, setCoverFinish] = useState("");
    const [colorPrinting, setColorPrinting] = useState("");
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const { showToast } = useToast();
    const [agreed ,setAgreed] = useState(false);




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

    fetch(`${API_URL}/profile`, {
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
    fetch(`${API_URL}/product-status`)
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
        { name: "Book Type", value: bookType },
        { name: "Binding Type", value: binding },
        { name: "Paper Type", value: paperType },
        { name: "Book Size", value: bookSize },
        { name: "Cover Finish", value: coverFinish },
        { name: "Color Printing", value: colorPrinting },
        { name: "Additional Notes", value: notes },
      ].filter((attr) => attr.value && attr.value.trim() !== "");

      // Create order in backend
      const res = await fetch(`${API_URL}/orders/create`, {
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
          estimated_price: estimatedPrice || 0,
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
          `${API_URL}/orders/upload/single/${orderItemId}`,
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
      setBookType("");
      setBinding("");
      setPaperType("");
      setBookSize("");
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const pagesNum = Number(pages);
      const copiesNum = Number(quantity);

      if (!pagesNum || !copiesNum) {
        setEstimatedPrice(0);
        return;
      }

      const result = computeBookQuotation({
        pages: pagesNum,
        copies: copiesNum,
        colored: colorPrinting === "Full Color",
      });

      console.log("Quotation result:", result);
      setEstimatedPrice(result ? Math.round(result.total) : 0);
    }, [pages, quantity, colorPrinting]);


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
                <h2 className="text-4xl font-bold text-black">
                  Service Request
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
                            Book Type
                          </label>
                            <select
                              value={bookType}
                              onChange={(e) => setBookType(e.target.value)}
                              className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                              required
                            >
                              <option value="">Select Book Type</option>
                              <option>Yearbook</option>
                              <option>Coffee Table Book</option>
                              <option>Souvenir Program</option>
                            </select>
                        </div>
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
                        <div>
                          <label className="block text-base font-semibold text-black">
                            Book Size
                          </label>
                            <select
                              value={bookSize}
                              onChange={(e) => setBookSize(e.target.value)}
                              className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                              required
                            >
                              <option value="">Select Size</option>
                              <option>A4 (210 x 297 mm)</option>
                              <option>Trade Paperback (13 x 20 cm)</option>
                              <option>5.5" x 8.5" (13.97 x 21.59 cm)</option>
                              <option>6" x 9" (15.24 x 22.86 cm)</option>
                              <option>5" x 8" (12.7 x 20.32 cm)</option>
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
                          {estimatedPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
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

                 {/* Estimated Price Box */}
                    <div className="mt-4 border border-blue-200 bg-blue-50 rounded-2xl shadow-sm p-5 w-143 text-right">
                      <p className="text-base text-gray-700 font-medium">Estimated Price</p>
                        <p className="text-3xl font-bold text-blue-700 mt-1">
                          {estimatedPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                        </p>
                      <p className="text-sm text-gray-500 italic mt-1">
                        *Final price may vary depending on specifications
                      </p>
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
  );
}

export default Books;
