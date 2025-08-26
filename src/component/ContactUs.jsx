import React from "react";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";

function ContactUs() {
  return (
    <section className="relative bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] text-white py-20 px-6 md:px-12 lg:px-32 overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 tracking-wide relative z-10">
        Contact <span className="text-yellow-400">Us</span>
      </h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 relative z-10">
        {[
          {
            icon: <MdEmail size={40} />,
            title: "Email Address",
            detail: "achuchu@email.com",
          },
          {
            icon: <MdPhone size={40} />,
            title: "Phone Number",
            detail: "09123456789",
          },
          {
            icon: <MdLocationOn size={40} />,
            title: "Office Location",
            detail: "Bantad Boac Marinduque",
          },
          {
            icon: <MdAccessTime size={40} />,
            title: "Work Day",
            detail: "Mon–Fri: 8:00am – 5:00pm",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl flex flex-col items-center text-center shadow-lg border border-white/10 transform hover:scale-105 hover:shadow-yellow-400/20 transition-all duration-300"
          >
            <div className="text-yellow-400 mb-3">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.detail}</p>
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        <div>
          <h3 className="text-3xl font-bold mb-6">
            Get in <span className="text-yellow-400">touch</span> with us
          </h3>
          <p className="text-gray-300 leading-relaxed mb-8">
            Have a project in mind or need printing assistance? Send us a
            message and our team will get back to you as soon as possible.
          </p>

          <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <iframe
              title="Google Maps – Bantad, Boac, Marinduque"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.611808739326!2d121.8406!3d13.4614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bc7e7b8f3e76a9%3A0x6e2f8f1a34e02f9f!2sBantad%2C%20Boac%2C%20Marinduque%2C%20Philippines!5e0!3m2!1sen!2sph!4v1700000000000"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        
        <div className="bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-lg border border-white/10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
            />
            <input
              type="text"
              placeholder="Subject"
              className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition md:col-span-2 resize-none"
            ></textarea>

            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg md:col-span-2 transition-transform transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
