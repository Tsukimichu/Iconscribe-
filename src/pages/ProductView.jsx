import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import {
  ArrowBigLeft,
  ShoppingCart,
  Phone,
  Mail,
} from "lucide-react";
import UploadSection from "../component/UploadSection";
import Navigation from "../component/navigation";
import { useToast } from "../component/ui/ToastProvider";

// ============= QUOTATION HELPERS ===================

/**
 * Single Prints Quotation
 * @param {Object} params
 * @param {number} params.width 
 * @param {number} params.height
 * @param {number} params.copies
 * @param {boolean} params.colored
 * @param {number} [params.paperCost=20] 
 * @param {number} [params.plateCost=500]
 * @param {number} [params.runCost=400]
 * @param {number} [params.multiplier=2]
 * @returns {Object|null}
 */
function computeQuotation({
  width,
  height,
  copies,
  colored,
  paperCost = 20,
  plateCost = 500,
  runCost = 400,
  multiplier = 2,
}) {
  if (!width || !height || !copies) return null;

  const sheetWidth = 25;
  const sheetHeight = 38;
  const perRow = Math.floor(sheetWidth / width);
  const perCol = Math.floor(sheetHeight / height);
  const outs = perRow * perCol || 1;

  const sheetsNeeded = Math.ceil(copies / outs);
  const totalPaperCost = sheetsNeeded * paperCost;

  const plateCount = colored ? 4 : 1;
  const totalPlateCost = plateCount * plateCost;
  const totalRunCost = plateCount * runCost;

  const baseCost = totalPaperCost + totalPlateCost + totalRunCost;
  const total = baseCost * multiplier;
  const perCopy = Math.ceil(total / copies);

  return {
    outs,
    sheetsNeeded,
    totalPaperCost,
    totalPlateCost,
    totalRunCost,
    baseCost,
    total,
    perCopy,
  };
}

/**
 * Official Receipt Quotation
 */
function computeORQuotation({
  quantity,
  paperCost = 20,
  multiplier = 1.5,
}) {
  const qty = Number(quantity);
  if (!qty || qty <= 0) return null;

  const totalPages = qty * 50;
  const requiredSheets = Math.ceil(totalPages / 4);
  const baseCost = requiredSheets * paperCost;
  const total = baseCost * multiplier;

  return {
    quantity: qty,
    totalPages,
    requiredSheets,
    paperCost,
    baseCost,
    multiplier,
    total,
    perBooklet: total / qty,
  };
}

/**
 * Calendar Quotation
 */
function computeCalendarQuotation({
  quantity,
  calendarType,
}) {
  const qty = Number(quantity);
  if (!qty || qty <= 0 || !calendarType) return null;

  const pricePerCalendar = qty < 600 ? 30 : 28;

  let multiplier = 12;
  if (calendarType.toLowerCase().includes("double")) {
    multiplier = 6;
  }

  const total = qty * pricePerCalendar * multiplier;

  return {
    quantity: qty,
    pricePerCalendar,
    multiplier,
    total,
    perSet: total / qty,
  };
}

/**
 * Binding Quotation
 */
function computeBindingQuotation({ copies, basePrice = 250 }) {
  const copiesNum = Number(copies);
  if (!copiesNum || copiesNum <= 0) return null;

  const total = copiesNum * basePrice;
  const perCopy = basePrice;

  return {
    copies: copiesNum,
    basePrice,
    total,
    perCopy,
  };
}

/**
 * Book Quotation
 */
function computeBookQuotation({
  pages,
  copies,
  colored,
  paperPricePerReam = 3000,
  platePrice = 500,
  runPrice = 400,
  signaturePages = 8,
  platesPerSignature = 2,
  multiplier = 1,
}) {
  const pagesNum = Number(pages);
  const copiesNum = Number(copies);
  if (!pagesNum || !copiesNum) return null;

  const signatures = Math.ceil(pagesNum / signaturePages);
  const sheets = Math.ceil((signatures * copiesNum) / 2);
  const reams = Math.ceil(sheets / 500);
  const paperCost = reams * paperPricePerReam;

  const totalPlates = Math.ceil(signatures * platesPerSignature);
  const plateCost = totalPlates * platePrice;

  let runCost = totalPlates * runPrice;
  if (colored) runCost *= 4;

  const baseCost = paperCost + plateCost + runCost;
  const total = baseCost * multiplier;
  const perCopy = total / copiesNum;

  return {
    signatures,
    sheets,
    reams,
    paperCost,
    totalPlates,
    plateCost,
    runCost,
    baseCost,
    total,
    perCopy,
  };
}

// ================== CATEGORY KEYWORDS =====================

const BOOK_KEYWORDS = ["book", "books"];
const BINDING_KEYWORDS = ["binding", "perfect bind", "spine"];
const OR_KEYWORDS = [" or ", "official receipt", "receipt", "rcpt"];
const CALENDAR_KEYWORDS = ["calendar", " cal"];

// FIXED: correct base URL for images
const BASE_URL = API_URL.replace("/api", "");

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [selected, setSelected] = useState({});

  const [quantity, setQuantity] = useState(1);
  const [pageCount, setPageCount] = useState(""); // for books/binding
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // -------------- AUTH LISTENER -----------------
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  // -------------- LOAD PRODUCT -----------------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const blocked = [
          "name",
          "email",
          "location",
          "contact",
          "phone",
          "note",
          "message",
        ];

        const filtered = (data.attributes || []).filter(
          (a) =>
            !blocked.some((b) =>
              a.attribute_name?.toLowerCase().includes(b)
            )
        );

        setAttributes(filtered);

        const defaults = {};
        filtered.forEach((attr) => {
          const first = attr.options?.[0];
          const val =
            typeof first === "string"
              ? first
              : first?.option_value || first?.value || "";
          if (attr.attribute_name) {
            defaults[attr.attribute_name] = val;
          }
        });

        setSelected((prev) => ({ ...prev, ...defaults }));
      } catch (err) {
        console.error("Product load error", err);
        showToast("Failed to load product", "error");
      }
    };

    loadProduct();
  }, [id, showToast]);

  // -------------- LOAD USER PROFILE -----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !d.data) return;

        const profile = {
          id: d.data.user_id,
          name: d.data.name || "",
          email: d.data.email || "",
          address: d.data.address || "",
          phone: d.data.phone || "",
        };

        setUserProfile(profile);

        setSelected((p) => ({
          ...p,
          name: profile.name,
          email: profile.email,
          location: profile.address,
          contact_number: profile.phone,
        }));
      })
      .catch((err) => console.error("Profile error:", err));
  }, [isLoggedIn]);

  // -------------- PRICING MODE DETECTION -----------------
  const productNameLower = (product?.product_name || "").toLowerCase();

  const isBook = BOOK_KEYWORDS.some((k) =>
    productNameLower.includes(k.toLowerCase())
  );
  const isBinding = BINDING_KEYWORDS.some((k) =>
    productNameLower.includes(k.toLowerCase())
  );
  const isBookOrBinding = isBook || isBinding;

  const isOR = OR_KEYWORDS.some((k) =>
    productNameLower.includes(k.toLowerCase())
  );
  const isCalendar = CALENDAR_KEYWORDS.some((k) =>
    productNameLower.includes(k.toLowerCase())
  );

  // -------------- UNIVERSAL ESTIMATED PRICE LOGIC -----------------
  useEffect(() => {
    if (!product) return;

    const copies = Number(quantity || 0);
    const pages = Number(pageCount || 0);

    // -------------------------------------------------------------
    // UNIVERSAL ATTRIBUTE EXTRA COST (APPLIES TO ALL PRODUCTS)
    // -------------------------------------------------------------
    let addonTotal = 0;

    attributes.forEach((attr) => {
      const selectedValue = selected[attr.attribute_name];
      if (!selectedValue) return;

      const opt = (attr.options || []).find((o) => {
        const val =
          typeof o === "string"
            ? o
            : o.option_value || o.value || "";
        return val === selectedValue;
      });

      if (!opt || typeof opt === "string") return;

      const price = Number(opt.price || 0);

      // ⭐ UNIVERSAL RULE:
      // If product has pages (books, binding, some custom products)
      if (pages > 0) {
        addonTotal += price * pages * copies;
      } else {
        addonTotal += price * copies;
      }
    });

    // -------------------------------------------------------------
    // DETERMINE PRODUCT MODE
    // -------------------------------------------------------------
    const nameLower = (product.product_name || "").toLowerCase();

    let mode = "single"; // default
    if (BOOK_KEYWORDS.some((k) => nameLower.includes(k))) mode = "book";
    else if (BINDING_KEYWORDS.some((k) => nameLower.includes(k))) mode = "binding";
    else if (OR_KEYWORDS.some((k) => nameLower.includes(k))) mode = "or";
    else if (CALENDAR_KEYWORDS.some((k) => nameLower.includes(k))) mode = "calendar";

    // Detect colored mode from attributes
    const detectColored = () => {
      let flag = false;
      attributes.forEach((attr) => {
        if (!/color/i.test(attr.attribute_name || "")) return;
        const v = (selected[attr.attribute_name] || "").toLowerCase();
        if (
          v.includes("color") &&
          !v.includes("black & white") &&
          !v.includes("black and white") &&
          !v.includes("bw")
        ) {
          flag = true;
        }
      });
      return flag;
    };

    // -------------------------------------------------------------
    // BASE COST FROM EACH SPECIFIC COMPUTATION FORMULA
    // -------------------------------------------------------------
    let baseCost = 0;

    if (mode === "book") {
      const q = computeBookQuotation({
        pages,
        copies,
        colored: detectColored(),
      });
      baseCost = q?.total || 0;
    }

    else if (mode === "binding") {
      const q = computeBindingQuotation({ copies });
      baseCost = q?.total || 0;
    }

    else if (mode === "or") {
      const q = computeORQuotation({ quantity: copies });
      baseCost = q?.total || 0;
    }

    else if (mode === "calendar") {
      let calType = "";
      const calAttr =
        attributes.find((a) =>
          /calendar\s*type/i.test(a.attribute_name || "")
        ) || attributes[0];

      if (calAttr) {
        const v = selected[calAttr.attribute_name];
        const first = calAttr.options?.[0];
        calType = v || (typeof first === "string" ? first : first.option_value);
      }

      const q = computeCalendarQuotation({
        quantity: copies,
        calendarType: calType,
      });
      baseCost = q?.total || 0;
    }

    else {
      // ---------------- SINGLE PRINTS ----------------
      let width = 0;
      let height = 0;

      const sizeAttr = attributes.find((a) =>
        /size/i.test(a.attribute_name || "")
      );

      if (sizeAttr) {
        const raw =
          selected[sizeAttr.attribute_name] ||
          (sizeAttr.options?.[0] &&
            (typeof sizeAttr.options[0] === "string"
              ? sizeAttr.options[0]
              : sizeAttr.options[0].option_value));

        const m = String(raw).match(/([\d.]+)\s*[x×]\s*([\d.]+)/i);
        if (m) {
          width = parseFloat(m[1]);
          height = parseFloat(m[2]);
        }
      }

      const q = computeQuotation({
        width,
        height,
        copies,
        colored: detectColored(),
      });

      baseCost = q?.total || Number(product.base_price || 0) * copies;
    }

    // -------------------------------------------------------------
    // FINAL RESULT = base computation + attribute additions
    // -------------------------------------------------------------
    const finalTotal = baseCost + addonTotal;

    setEstimatedPrice(finalTotal);
  }, [product, attributes, selected, quantity, pageCount]);


  // -------------- SKELETON -----------------
  if (!product) {
    return (
      <>
        <Navigation />
        <div className="p-10 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-blue-100 rounded-xl mb-6"></div>
            <div className="grid grid-cols-2 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-10 bg-blue-100 rounded"></div>
                ))}
            </div>
            <div className="h-32 bg-blue-100 rounded mt-6"></div>
          </div>
        </div>
      </>
    );
  }

  // -------------- PLACE ORDER -----------------
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/login");
    setShowConfirm(true);
  };

  // -------------- SUBMIT ORDER -----------------
  const submitOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const user_id = userProfile.id || localStorage.getItem("user_id");

      const formattedAttributes = attributes.map((attr) => ({
        name: attr.attribute_name,
        value: selected[attr.attribute_name] ?? "",
      }));

      if (isBookOrBinding && pageCount) {
        formattedAttributes.push({
          name: "Number of Pages",
          value: pageCount,
        });
      }

      const payload = {
        user_id,
        product_id: product.product_id,
        quantity,
        status: "Pending",
        estimated_price: estimatedPrice || 0,
        name: userProfile.name,
        email: userProfile.email,
        location: userProfile.address,
        contact_number: userProfile.phone,
        notes,
        attributes: formattedAttributes,
      };

      const res = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) {
        showToast("Order failed", "error");
        return;
      }

      const orderItemId = result.order_item_id;

      if (file) {
        const fd = new FormData();
        fd.append("file1", file);

        await fetch(`${API_URL}/orders/upload/double/${orderItemId}`, {
          method: "POST",
          body: fd,
        });
      }

      showToast("Order placed successfully!", "success");
      setShowConfirm(false);
      setAgreed(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Order error:", err);
      showToast("Error placing order", "error");
    }
  };

  const handleConfirmOrder = () => {
    submitOrder();
  };

  // ================== LOGGED-IN VIEW ==================
  const loggedInView = (
    <div className="w-full h-full bg-white flex items-center justify-center p-5">
      <div className="w-full max-w-[120rem] p-2">
        {/* TITLE */}
        <div className="relative flex items-center justify-center mb-10 w-full">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowBigLeft className="w-7 h-7" />
          </button>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center">
            Product Request
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-black">
              {product.product_name}
            </h2>
            <p className="text-lg text-black mb-6 text-center max-w-xl">
              {product.description}
            </p>

            <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden group">
              <img
                src={
                  product.image
                    ? `${BASE_URL}/uploads/products/${product.image}`
                    : "/no-image.png"
                }
                alt={product.product_name}
                className="w-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT */}
          <form onSubmit={handlePlaceOrder} className="space-y-6 text-black">
            {/* USER INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, name: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, email: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Location</label>
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, address: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold">Contact Number</label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) =>
                    setUserProfile((u) => ({ ...u, phone: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                />
              </div>
            </div>

            {/* QUANTITY / PAGES SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Number of Copies</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                  required
                />
              </div>

              {isBookOrBinding && (
                <div>
                  <label className="font-semibold">Number of Pages</label>
                  <input
                    type="number"
                    min="1"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                    required
                  />
                </div>
              )}
            </div>

            {/* ATTRIBUTES */}
            {attributes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attributes.map((attr) => (
                  <div key={attr.attribute_name}>
                    <label className="font-semibold">
                      {attr.attribute_name}
                    </label>
                    <select
                      className="mt-1 w-full border border-gray-300 p-3 rounded-xl"
                      value={selected[attr.attribute_name] || ""}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          [attr.attribute_name]: e.target.value,
                        }))
                      }
                    >
                      {(attr.options || []).map((opt, i) => {
                        const val =
                          typeof opt === "string"
                            ? opt
                            : opt.option_value || opt.value;
                        return (
                          <option key={i} value={val}>
                            {val}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* UPLOAD + NOTES + PRICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UPLOAD */}
              <div>
                <UploadSection
                  uploadCount={1}
                  onUploadComplete={(res) => {
                    if (res?.files?.[0]) setFile(res.files[0]);
                  }}
                />
              </div>

              {/* NOTES + PRICE */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="font-semibold">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl h-32"
                    placeholder="Add extra notes"
                  ></textarea>
                </div>

                <div className="mt-4 border border-blue-200 bg-blue-50 rounded-2xl p-5 text-right">
                  <p className="text-gray-700">Estimated Price</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {estimatedPrice.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    * Final price may vary depending on specifications.
                  </p>
                </div>

                <div className="max-w-md mx-auto mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-xl shadow-sm">
                  <p className="text-yellow-800 text-sm font-medium">
                    📌 The products take about{" "}
                    <span className="font-semibold">2–3 weeks</span> to be
                    completed and prepared for delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTACT + SUBMIT */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:gap-4">
                <span className="flex items-center gap-1 font-medium text-blue-700">
                  <Phone size={16} /> #09123456789
                </span>

                <a
                  href="mailto:iconscribe@gmail.com"
                  className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
                >
                  <Mail size={16} /> iconscribe@gmail.com
                </a>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:scale-105 transition text-white px-10 py-3 rounded-xl font-semibold text-lg flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
              <h2 className="text-xl font-bold text-black mb-4">
                Confirm Your Order
              </h2>

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
                  onClick={
                    agreed
                      ? handleConfirmOrder
                      : () =>
                          alert(
                            "Please agree to the Terms and Conditions first."
                          )
                  }
                  className={`px-4 py-2 rounded-xl text-white transition ${
                    agreed
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ================== LOGGED-OUT VIEW ==================
  const loggedOutView = (
    <div className="w-full h-full bg-white flex items-center justify-center p-5">
      <div className="w-full max-w-[120rem] p-2">
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowBigLeft className="w-7 h-7" />
          </button>
          <h2 className="text-4xl font-bold text-black">Service Request</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
          {/* LEFT IMAGE */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
            <img
              src={
                product.image
                  ? `${BASE_URL}/uploads/products/${product.image}`
                  : "/no-image.png"
              }
              alt={product.product_name}
              className="w-full h-[70vh] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full max-w-2xl flex flex-col justify-center h-full space-y-6 text-black">
            <h2 className="text-4xl font-bold text-black">
              {product.product_name}
            </h2>

            <p className="text-lg text-black leading-relaxed">
              {product.description}
            </p>

            {/* INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Copies */}
              <div>
                <label className="block text-base font-semibold text-black">
                  Number of Copies
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm"
                />
              </div>

              {/* Pages or first attribute */}
              {isBookOrBinding ? (
                <div>
                  <label className="block text-base font-semibold text-black">
                    Number of Pages
                  </label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    min="1"
                    className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm"
                  />
                </div>
              ) : (
                attributes[0] && (
                  <div>
                    <label className="block text-base font-semibold text-black">
                      {attributes[0].attribute_name}
                    </label>
                    <select className="mt-1 w-full border border-gray-300 p-3 rounded-xl shadow-sm">
                      {attributes[0].options.map((opt, i) => (
                        <option key={i}>
                          {typeof opt === "string"
                            ? opt
                            : opt.option_value || opt.value}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>

            {/* ESTIMATED PRICE FOR LOGGED-OUT USERS */}
            <div className="mt-6 border border-blue-200 bg-blue-50 rounded-2xl p-5 text-right">
              <p className="text-gray-700">Estimated Price</p>
              <p className="text-3xl font-bold text-blue-700">
                {estimatedPrice.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </p>
              <p className="text-sm text-gray-500 italic">
                * Final price may vary depending on specifications.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold text-lg"
                onClick={() => setShowContactModal(true)}
              >
                Contact Us
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-xl font-semibold text-lg"
              >
                Log In to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navigation />
      {isLoggedIn ? loggedInView : loggedOutView}
    </>
  );
};

export default ProductView;