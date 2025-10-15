import Nav from "../component/navigation";
import or from "../assets/CallingCard.png";
import { ArrowBigLeft, Upload, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { Contact, MessageCircle, XCircle } from "lucide-react";
import UploadSection from "../component/UploadSection";
import { useToast } from "../component/ui/ToastProvider";

function CallingCard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));


   const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    business: "",
    });

      const [size, setSize] = useState("");
      const [paperType, setPaperType] = useState("");
      const [color, setColor] = useState("");
      const [lamination, setLamination] = useState("");
      const [customization, setCustomization] = useState(false);
      const [backToBack, setBackToBack] = useState(false);
      const [message, setMessage] = useState("");
      const [file, setFile] = useState("");
 
      const {showToast} = useToast();
      const [quantity, setQuantity] = useState("");
      const [showConfirm, setShowConfirm] = useState(false);
      const [showContactModal, setShowContactModal] = useState(false);

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
                id: data.data.id || data.data.user_id || "",
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

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login")
    } else {
      setShowConfirm(true);
    }
  };

    const [visible, setVisible] = useState(true);

    useEffect(() => {
      fetch("http://localhost:5000/api/product-status")
        .then((res) => res.json())
        .then((data) => {
          const product = data.find((p) => p.product_name === "Calling Card");
          if (product && (product.status === "Inactive" || product.status === "Archived")) {
            setVisible(false);
          }
        })
        .catch((err) => console.error("Error loading product status:", err));
    }, []);

    if (!visible) return null;

    const handleConfirmOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast(" Please log in to place an order.", "error");
          return;
        }

        const attributes = [
          { name: "Customization", value: customization ? "Yes" : "No" },
          { name: "Name", value: userProfile.name },
          { name: "Email", value: userProfile.email },
          { name: "Address", value: userProfile.address },
          { name: "Phone", value: userProfile.phone },
          { name: "Business", value: userProfile.business },
          { name: "Number of Cards", value: quantity },
          { name: "Size", value: size },
          { name: "Type of Paper", value: paperType },
          { name: "Color", value: color },
          { name: "Lamination", value: lamination },
          { name: "Print", value: backToBack ? "Back to back" : "Single side" },
          { name: "Message", value: message },
        ].filter((attr) => attr.value && attr.value.toString().trim() !== "");

        const response = await fetch("http://localhost:5000/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userProfile.id,
            product_id: 5,
            quantity,
            urgency: "Normal",
            status: "Pending",
            attributes,
          }),
        });

        const data = await response.json();
        console.log(" Order response:", data);

        if (!data.success) {
          showToast(" Failed to place order.", "error");
          return;
        }

        const orderItemId = data.order_item_id || data.orderItemId;
        console.log(" Order item ID:", orderItemId);

        if (!orderItemId) {
          showToast("Order created but missing ID.", "error");
          return;
        }

        if (file) {
          const formData = new FormData();
          formData.append("file1", file);
          const uploadRes = await fetch(
            `http://localhost:5000/api/orders/upload/single/${orderItemId}`,
            { method: "POST", body: formData }
          );
          const uploadData = await uploadRes.json();
          console.log(" Upload result:", uploadData);

          if (uploadData.success) {
            showToast(" Order placed and file uploaded successfully!", "success");
          } else {
            showToast(" Order placed, but file upload failed.", "warning");
          }
        } else {
          showToast(" Order placed successfully!", "success");
        }

        // Reset form
        setShowConfirm(false);
        setQuantity("");
        setSize("");
        setPaperType("");
        setColor("");
        setLamination("");
        setBackToBack(false);
        setMessage("");
        setFile(null);
        setCustomization(false);

        navigate("/dashboard");
      } catch (error) {
        console.error("Order error:", error);
        showToast(" Something went wrong. Please try again later.", "error");
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
                    Calling Card
                  </h2>
                  <p className="text-lg text-black mb-6 leading-relaxed text-center max-w-xl">
                    A calling card is a small card with your contact details,
                    often shared for personal or professional introductions.
                  </p>

                  <div className="relative w-full max-w-3xl overflow-hidden group">
                    <img
                      src={or}
                      alt="Sample Calling Card"
                      className="w-full h-full sm:h-[600px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                </div>

                {/* Right: Form */}
                <form
                  onSubmit={handlePlaceOrder}
                  className="space-y-6 text-black"
                >
                  {/* Name, Email, Location, Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">Name</label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">Email</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-black">Location</label>
                        <input
                          type="text"
                          placeholder="Enter your location"
                          value={userProfile.address}
                          onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-black">Contact Number</label>
                        <input
                          type="text"
                          placeholder="Enter contact number"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        />
                      </div>
                    </div>

                  {/* Business/Personal Label + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Card Title (e.g. Business or Personal)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter title for card"
                        value={userProfile.business}
                        onChange={(e) => setUserProfile({ ...userProfile, business: e.target.value })}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Cards{" "}
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

                  {/* Size + Paper Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Size
                      </label>
                      <select
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select size</option>
                        <option>2” x 3.5” (Standard)</option>
                        <option>Custom Size</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Type of Paper
                      </label>
                      <select
                        value={paperType}
                        onChange={e => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      >
                        <option value="">Select type</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Textured</option>
                      </select>
                    </div>
                  </div>


                  {/* Upload + Message */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <UploadSection
                        uploadCount={1}          
                        hasCustomization={true} 
                        onUploadComplete={(res) => {
                          if (res?.files?.[0]) setFile(res.files[0]);
                        }}
                      />
                    {/* Options + Message */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-base font-semibold text-black mb-3">
                          Message{" "}
                          <span className="text-sm text-gray-700">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className="mt-1 w-full border border-gray-300 p-3 rounded-xl h-41 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
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
                  Service Request
                </h2>
              </div>

              {/* Image LEFT | Text + Form RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
                {/* Left: Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                  <img
                    src={or}
                    alt="Sample Calling Card"
                    className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Right: Title + Desc + Partial Form */}
                <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
                  <h2 className="text-4xl font-bold text-black">
                    Calling Card
                  </h2>
                  <p className="text-lg text-black leading-relaxed">
                    A calling card is a small card with your contact details,
                    often shared for personal or professional introductions.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quas mollitia pariatur saepe totam quaerat voluptate
                    deleniti nihil culpa modi? Nihil quasi est odit ut ratione
                    aspernatur dicta odio non nemo.
                  </p>

                  {/* Copies + Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Number of Cards{" "}
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
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Size
                      </label>
                      <select
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select size</option>
                        <option>2” x 3.5” (Standard)</option>
                        <option>Custom Size</option>
                      </select>
                    </div>
                  </div>

                  {/* Paper Type + Color + Lamination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Type of Paper
                      </label>
                      <select
                        value={paperType}
                        onChange={e => setPaperType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      >
                        <option value="">Select type</option>
                        <option>Matte</option>
                        <option>Glossy</option>
                        <option>Textured</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-black">
                        Color
                      </label>
                      <select
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                        required
                      >
                        <option value="">Select Color</option>
                        <option>Full Color</option>
                        <option>Black & White</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-black">
                        Lamination
                      </label>
                      <select
                        value={lamination}
                        onChange={e => setLamination(e.target.value)}
                        className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-black"
                      >
                        <option value="">Select option</option>
                        <option>Gloss Lamination</option>
                        <option>Matte Lamination</option>
                        <option>None</option>
                      </select>
                    </div>

                    <div className="mt-4 flex items-center gap-3 p-3">
                      <input
                        type="checkbox"
                        checked={backToBack}
                        onChange={e => setBackToBack(e.target.checked)}
                        id="backToBack"
                        className="w-6 h-6 scale-125 cursor-pointer"
                      />
                      <label
                        htmlFor="backToBack"
                        className="text-lg font-bold cursor-pointer"
                      >
                        Print Back-to-Back
                      </label>
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
                          <Contact className="text-blue-600 w-6 h-6" /> Contact
                          Us
                        </h3>

                        <div className="space-y-4 text-black">
                          <div className="flex items-center gap-2">
                            <Contact className="text-green-600 w-5 h-5" />
                            <span className="font-medium">
                              +63 912 345 6789
                            </span>
                          </div>
                          <a
                            href="mailto:iconscribe@email.com"
                            className="flex items-center gap-2 text-blue-700 hover:underline"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">
                              iconscribe@email.com
                            </span>
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
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                onClick={handleConfirmOrder}
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

export default CallingCard;
