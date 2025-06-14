import React from "react";
import logo from "../assets/ICONS.png";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";

function ContactUs() {
  return (
    <div className="bg-[#1A1A1A] text-white py-16 px-6 md:px-12 lg:px-40">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-14">Contact us</h2>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-[#2E2E2E] p-6 rounded-lg flex flex-col items-center">
          <MdEmail size={50} className="mb-4" />
          <h3 className="font-bold mb-1">Email Address</h3>
          <p>achuchu@email.com</p>
        </div>

        <div className="bg-[#2E2E2E] p-6 rounded-lg flex flex-col items-center">
          <MdPhone size={50} className="mb-4" />
          <h3 className="font-bold mb-1">Phone Number</h3>
          <p>09123456789</p>
        </div>

        <div className="bg-[#2E2E2E] p-6 rounded-lg flex flex-col items-center">
          <MdLocationOn size={50} className="mb-4" />
          <h3 className="font-bold mb-1">Office Location</h3>
          <p>Bantad Boac Marinduque</p>
        </div>

        <div className="bg-[#2E2E2E] p-6 rounded-lg flex flex-col items-center">
          <MdAccessTime size={50} className="mb-4" />
          <h3 className="font-bold mb-1">Work Day</h3>
          <p>Mon-Fri: 8:00am–5:00pm</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Text */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Get in touch with us</h3>
          <p className="text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Right Form */}
        <div className="flex-1">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-3 rounded bg-white text-black"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded bg-white text-black"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="p-3 rounded bg-white text-black"
            />
            <input
              type="text"
              placeholder="Subject"
              className="p-3 rounded bg-white text-black"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="p-3 rounded bg-white text-black md:col-span-2"
            ></textarea>

            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded md:col-span-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
