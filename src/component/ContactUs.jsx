import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";

function ContactUs() {
  return (
    <section className="relative bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] text-white py-20 px-6 md:px-12 lg:px-32 overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 tracking-wide relative z-10">
        Contact <span className="text-yellow-400">Us</span>
      </h2>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 relative z-10">
        {[
          {
            icon: <MdEmail size={40} />,
            title: "Email Address",
            detail: "iconscribe@email.com",
          },
          {
            icon: <MdPhone size={40} />,
            title: "Phone Number",
            detail: "09123456789",
          },
          {
            icon: <MdLocationOn size={40} />,
            title: "Office Location",
            detail: "Bantad, Boac, Marinduque",
          },
          {
            icon: <MdAccessTime size={40} />,
            title: "Work Hours",
            detail: "Mon–Fri: 8:00am – 5:00pm",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-center text-center 
                       shadow-lg border border-white/10 transition-all duration-300 
                       hover:scale-[1.05] hover:shadow-yellow-400/30 hover:border-yellow-400/40"
          >
            <div className="text-yellow-400 mb-3">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">

        {/* Left Text */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Get in <span className="text-yellow-400">touch</span> with us
          </h1>
          <p className="mt-4 text-gray-300 text-sm md:text-base max-w-md">
            Whether you have inquiries about printing services, custom orders, or project consultations — 
            our team is ready to assist you.
          </p>
        </div>

        {/* Map */}
        <div>
          <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <iframe
              title="Google Maps – Bantad, Boac, Marinduque"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.611808739326!2d121.8406!3d13.4614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bc7e7b8f3e76a9%3A0x6e2f8f1a34e02f9f!2sBantad%2C%20Boac%2C%20Marinduque%2C%20Philippines!5e0!3m2!1sen!2sph!4v1700000000000"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ContactUs;