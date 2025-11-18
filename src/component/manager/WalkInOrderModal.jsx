import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/*

PROPS YOU MUST PASS:

show                 → boolean (open/close)
onClose              → function
onSubmit             → function (your handleAddOrder)
newOrder             → object
setNewOrder          → setter
selectedProduct      → string
setSelectedProduct   → setter
orderFiles           → array
setOrderFiles        → setter
showSizeDropdown     → boolean
setShowSizeDropdown  → setter

Everything else is unchanged.

*/

export default function WalkInOrderModal({
  show,
  onClose,
  onSubmit,
  newOrder,
  setNewOrder,
  selectedProduct,
  setSelectedProduct,
  orderFiles,
  setOrderFiles,
  showSizeDropdown,
  setShowSizeDropdown
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full text-left overflow-y-auto max-h-[90vh]"
          >

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-6 text-cyan-700 text-center">
              Add Walk-In Order
            </h2>

            {/* =============================== */}
            {/* CUSTOMER INFORMATION */}
            {/* =============================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newOrder.customer_name}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, customer_name: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2"
              />

              <input
                type="email"
                placeholder="Email"
                value={newOrder.email}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, email: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2"
              />

              <input
                type="text"
                placeholder="Contact Number"
                value={newOrder.contact_number}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, contact_number: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2"
              />

              <input
                type="text"
                placeholder="Location"
                value={newOrder.location}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, location: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* =============================== */}
            {/* PRODUCT SELECTOR */}
            {/* =============================== */}
            <div className="mt-6">
              <label className="font-semibold">Select Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setNewOrder({ ...newOrder, service: e.target.value });
                }}
                className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              >
                <option value="">Choose Product...</option>
                <option value="Brochure">Brochure</option>
                <option value="Binding">Binding</option>
                <option value="Calling Card">Calling Card</option>
                <option value="Flyers">Flyers</option>
                <option value="Poster">Poster</option>
                <option value="Calendar">Calendar</option>
                <option value="Invitation">Invitation</option>
                <option value="Book">Book</option>
                <option value="Label">Label</option>
                <option value="Official Receipt">Official Receipt</option>
                <option value="News Letter">News Letter</option>
                <option value="Raffle Ticket">Raffle Ticket</option>
              </select>
            </div>

            {/* =============================== */}
            {/* PRODUCT SPECIFIC FORMS */}
            {/* =============================== */}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* ------------------------------ */}
              {/* BROCHURE FORM */}
              {/* ------------------------------ */}
              {selectedProduct === "Brochure" && (
                <>
                  <input
                    type="number"
                    placeholder="Number of Copies"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                  />

                  {/* SIZE DROPDOWN */}
                  <div className="relative w-full">
                    <div
                      className="border rounded-lg p-2 w-full flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setShowSizeDropdown(!showSizeDropdown)
                      }
                    >
                      <span>{newOrder.size || "Select Size"}</span>

                      {newOrder.size === "custom" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="W"
                            className="w-14 border rounded p-1 text-sm"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                              setNewOrder({
                                ...newOrder,
                                custom_width: e.target.value,
                              })
                            }
                          />
                          <span className="text-xs font-semibold">x</span>
                          <input
                            type="number"
                            placeholder="H"
                            className="w-14 border rounded p-1 text-sm"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                              setNewOrder({
                                ...newOrder,
                                custom_height: e.target.value,
                              })
                            }
                          />
                          <span className="text-xs font-semibold">in</span>
                        </div>
                      )}
                    </div>

                    {showSizeDropdown && (
                      <div className="absolute left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-20">
                        {[
                          "11” x 17”",
                          "17” x 22”",
                          "22” x 34”",
                          "8.5” x 14”",
                          "Custom Size",
                        ].map((option) => (
                          <div
                            key={option}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setNewOrder({ ...newOrder, size: option });
                              setShowSizeDropdown(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Paper Type</option>
                    <option>Matte</option>
                    <option>Glossy</option>
                    <option>Book Paper</option>
                  </select>

                  <select
                    value={newOrder.lamination}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, lamination: e.target.value })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Select Lamination Type</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <select
                    value={newOrder.color_printing}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        color_printing: e.target.value,
                      })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Colored?</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <label className="flex items-center gap-3 p-2">
                    <input
                      type="checkbox"
                      checked={newOrder.back_to_back || false}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          back_to_back: e.target.checked,
                        })
                      }
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="font-semibold">Print Back-to-Back</span>
                  </label>
                </>
              )}

              {/* ------------------------------ */}
              {/* BOOK FORM */}
              {/* ------------------------------ */}
              {selectedProduct === "Book" && (
                <>
                  <input
                    type="number"
                    placeholder="Number of Copies"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border rounded-lg p-2"
                  />

                  <input
                    type="number"
                    placeholder="Number of Pages"
                    value={newOrder.number_of_pages}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        number_of_pages: e.target.value,
                      })
                    }
                    className="border rounded-lg p-2"
                  />

                  <select
                    value={newOrder.binding_type}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        binding_type: e.target.value,
                      })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Select Binding Type</option>
                    <option>Perfect Binding</option>
                    <option>Saddle Stitch</option>
                    <option>Hardcover</option>
                    <option>Spiral</option>
                  </select>

                  <select
                    value={newOrder.book_type}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, book_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Select Book Type</option>
                    <option>Year Book</option>
                    <option>Coffee Table Book</option>
                    <option>Souvenir Program</option>
                  </select>

                  <select
                    value={newOrder.size}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, size: e.target.value })
                    }
                    className="border rounded-lg p-2 w-full"
                  >
                    <option value="">Select Size</option>
                    <option>A4 (210 x 297 mm)</option>
                    <option>Trade Paperback (13 x 20 cm)</option>
                    <option>5.5&quot; x 8.5&quot;</option>
                    <option>6&quot; x 9&quot;</option>
                    <option>5&quot; x 8&quot;</option>
                    <option value="custom">Custom Size</option>
                  </select>

                  {newOrder.size === "custom" && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="W"
                        value={newOrder.custom_width || ""}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            custom_width: e.target.value,
                          })
                        }
                        className="w-16 border rounded p-1"
                      />
                      <span>x</span>
                      <input
                        type="number"
                        placeholder="H"
                        value={newOrder.custom_height || ""}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            custom_height: e.target.value,
                          })
                        }
                        className="w-16 border rounded p-1"
                      />
                    </div>
                  )}

                  <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Paper Type</option>
                    <option>Matte</option>
                    <option>Glossy</option>
                    <option>Book Paper</option>
                  </select>

                  <select
                    value={newOrder.cover_finish}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, cover_finish: e.target.value })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Select Cover Finish</option>
                    <option>Matte</option>
                    <option>Glossy</option>
                    <option>Soft Touch</option>
                  </select>

                  <select
                    value={newOrder.color_printing}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        color_printing: e.target.value,
                      })
                    }
                    className="border rounded-lg p-2"
                  >
                    <option value="">Select Color Printing</option>
                    <option>Full Color</option>
                    <option>Black & White</option>
                    <option>Mixed</option>
                  </select>
                </>
              )}

                {/* ------------------------------ */}
                {/* FLYERS FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Flyers" && (
                <>
                    <input
                    type="number"
                    placeholder="Number of Copies (min 1000)"
                    min="1000"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full appearance-none"
                    >
                        <option value="">Select Flyer Size</option>
                        <option>A4</option>
                        <option>A5</option>
                        <option>DL</option>
                        <option value="custom">Custom</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1 text-sm"
                        />

                        <span className="text-xs font-semibold">x</span>

                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1 text-sm"
                        />
                        <span className="text-xs font-semibold">in</span>
                        </div>
                    )}
                    </div>

                    {/* Paper Type */}
                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Paper Type</option>
                    <option>Glossy</option>
                    <option>Matte</option>
                    <option>Premium Card</option>
                    </select>

                    {/* Lamination */}
                    <select
                    value={newOrder.lamination}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, lamination: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Lamination</option>
                    <option>Gloss</option>
                    <option>Matte</option>
                    <option>UV Coated</option>
                    </select>

                    {/* Color */}
                    <select
                    value={newOrder.color}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, color: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Color Option</option>
                    <option>Yes</option>
                    <option>No</option>
                    </select>

                    {/* Back-to-Back */}
                    <label className="flex items-center gap-3 p-2">
                    <input
                        type="checkbox"
                        checked={newOrder.back_to_back || false}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, back_to_back: e.target.checked })
                        }
                        className="w-5 h-5 cursor-pointer"
                    />
                    <span className="font-semibold">Print Back-to-Back</span>
                    </label>
                </>
                )}

                {/* ------------------------------ */}
                {/* POSTER FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Poster" && (
                <>
                    <input
                    type="number"
                    placeholder="Number of Posters (min 100)"
                    min="100"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select Poster Size</option>
                        <option>A3</option>
                        <option>A2</option>
                        <option>A1</option>
                        <option value="custom">Custom</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1 text-sm"
                        />
                        <span>x</span>
                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1 text-sm"
                        />
                        </div>
                    )}
                    </div>

                    {/* Paper Type */}
                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Paper Type</option>
                    <option>Glossy</option>
                    <option>Matte</option>
                    <option>Premium Card</option>
                    </select>

                    {/* Lamination */}
                    <select
                    value={newOrder.lamination}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, lamination: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Lamination</option>
                    <option>Gloss</option>
                    <option>Matte</option>
                    <option>UV Coated</option>
                    </select>

                    {/* Color */}
                    <select
                    value={newOrder.color}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, color: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Color</option>
                    <option>Full Color</option>
                    <option>Black & White</option>
                    </select>
                </>
                )}


                {/* ------------------------------ */}
                {/* LABEL FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Label" && (
                <>
                    <input
                    type="number"
                    placeholder="Number of Copies (min 100)"
                    min="100"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select Size</option>
                        <option>2” x 2”</option>
                        <option>3” x 3”</option>
                        <option value="custom">Custom</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        <span>x</span>
                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        </div>
                    )}
                    </div>

                    {/* Paper Type */}
                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Paper Type</option>
                    <option>Matte</option>
                    <option>Glossy</option>
                    <option>Transparent</option>
                    <option>Waterproof Vinyl</option>
                    </select>
                </>
                )}


                {/* ------------------------------ */}
                {/* CALLING CARD FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Calling Card" && (
                <>
                    <input
                    type="text"
                    placeholder="Card Title"
                    value={newOrder.card_title}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, card_title: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <input
                    type="number"
                    placeholder="Number of Cards (min 100)"
                    min="100"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select Size</option>
                        <option>2” x 3.5”</option>
                        <option value="custom">Custom</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        <span>x</span>
                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        </div>
                    )}
                    </div>

                    {/* Paper Type */}
                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Type of Paper</option>
                    <option>Matte</option>
                    <option>Glossy</option>
                    <option>Textured</option>
                    </select>
                </>
                )}




                {/* ------------------------------ */}
                {/* CALENDAR FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Calendar" && (
                <>
                    <input
                    type="number"
                    placeholder="Number of Sets (min 100)"
                    min="100"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <select
                    value={newOrder.color}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, color: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Color</option>
                    <option>Single Colored</option>
                    <option>More Than 1 Color</option>
                    </select>

                    <select
                    value={newOrder.calendar_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, calendar_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Calendar Type</option>
                    <option>Single Month (12 pages)</option>
                    <option>Double Month (6 pages)</option>
                    </select>

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select Size</option>
                        <option>11”x17”</option>
                        <option>17”x22”</option>
                        <option>22”x34”</option>
                        <option>8 1/2”x14”</option>
                        <option value="custom">Custom Size</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        <span>x</span>
                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        </div>
                    )}
                    </div>
                </>
                )}


                {/* ------------------------------ */}
                {/* INVITATION FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Invitation" && (
                <>
                    <input
                    type="text"
                    placeholder="Event Name"
                    value={newOrder.event_name}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, event_name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <input
                    type="number"
                    placeholder="Number of Copies (min 50)"
                    min="50"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select Size</option>
                        <option>5x7 inches</option>
                        <option>4x6 inches</option>
                        <option value="custom">Custom</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        <span>x</span>
                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        </div>
                    )}
                    </div>

                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Paper Type</option>
                    <option>Carbonized</option>
                    <option>Colored</option>
                    <option>Plain</option>
                    </select>

                    <select
                    value={newOrder.print_method}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, print_method: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Print Method</option>
                    <option>Computer Printout</option>
                    <option>Offset Machine</option>
                    </select>
                </>
                )}




                {/* ------------------------------ */}
                {/* OFFICIAL RECEIPT FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Official Receipt" && (
                <>
                    <input
                    type="text"
                    placeholder="Business Name"
                    value={newOrder.business_name}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, business_name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <input
                    type="number"
                    placeholder="Quantity (min 100)"
                    min="100"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Paper Type</option>
                    <option>Carbonized</option>
                    <option>Colored Bondpaper</option>
                    </select>

                    <select
                    value={newOrder.booklet_finish}
                    onChange={(e) =>
                        setNewOrder({
                        ...newOrder,
                        booklet_finish: e.target.value,
                        })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Booklet Finish</option>
                    <option>Padded</option>
                    <option>Stapled</option>
                    <option>Loose</option>
                    </select>
                </>
                )}


                {/* ------------------------------ */}
                {/* NEWS LETTER FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "News Letter" && (
                <>
                    <input
                    type="text"
                    placeholder="Business Name"
                    value={newOrder.business_name}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, business_name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <input
                    type="number"
                    placeholder="Number of Copies (min 100)"
                    min="100"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <select
                    value={newOrder.color}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, color: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Print Type</option>
                    <option>Black & White</option>
                    <option>Full Color</option>
                    </select>

                    <select
                    value={newOrder.layout}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, layout: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Select Layout</option>
                    <option>Single Page</option>
                    <option>Multi-Page</option>
                    </select>
                </>
                )}
                

                {/* ------------------------------ */}
                {/* RAFFLE TICKET FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Raffle Ticket" && (
                <>
                    <input
                    type="text"
                    placeholder="Business Name"
                    value={newOrder.business_name}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, business_name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    <input
                    type="number"
                    placeholder="Number of Tickets (min 50)"
                    min="50"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg p-2"
                    />

                    {/* Size */}
                    <div className="relative w-full">
                    <select
                        value={newOrder.size}
                        onChange={(e) =>
                        setNewOrder({ ...newOrder, size: e.target.value })
                        }
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="">Select Size</option>
                        <option>2” x 5” (Standard)</option>
                        <option value="custom">Custom</option>
                    </select>

                    {newOrder.size === "custom" && (
                        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="W"
                            value={newOrder.custom_width || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_width: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        <span>x</span>
                        <input
                            type="number"
                            placeholder="H"
                            value={newOrder.custom_height || ""}
                            onChange={(e) =>
                            setNewOrder({ ...newOrder, custom_height: e.target.value })
                            }
                            className="w-14 border rounded p-1"
                        />
                        </div>
                    )}
                    </div>

                    <select
                    value={newOrder.with_stub}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, with_stub: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">With Stub?</option>
                    <option>Yes</option>
                    <option>No</option>
                    </select>
                </>
                )}




                {/* ------------------------------ */}
                {/* BINDING FORM */}
                {/* ------------------------------ */}
                {selectedProduct === "Binding" && (
                <>
                    <input
                    type="number"
                    placeholder="Number of Books"
                    value={newOrder.quantity}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    />

                    <input
                    type="number"
                    placeholder="Page Count"
                    value={newOrder.number_of_pages}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, number_of_pages: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    />

                    <select
                    value={newOrder.binding_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, binding_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Binding Type</option>
                    <option>Perfect Binding</option>
                    <option>Saddle Stitch</option>
                    <option>Spiral</option>
                    <option>Ring Binding</option>
                    </select>

                    <select
                    value={newOrder.paper_type}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, paper_type: e.target.value })
                    }
                    className="border rounded-lg p-2"
                    >
                    <option value="">Paper Type</option>
                    <option>Matte</option>
                    <option>Glossy</option>
                    <option>Bond Paper</option>
                    <option>Book Paper</option>
                    </select>
                </>
                )}
            </div>

            {/* =============================== */}
            {/* FILE UPLOAD */}
            {/* =============================== */}
            <div className="mt-6">
              <label className="font-semibold text-gray-700">
                Upload File (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => setOrderFiles([...e.target.files])}
                className="border rounded-lg p-2 w-full mt-1"
              />
            </div>

            {/* =============================== */}
            {/* BUTTONS */}
            {/* =============================== */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={onSubmit}
                className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              >
                Add Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
