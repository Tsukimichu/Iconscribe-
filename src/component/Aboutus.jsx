import logo from "../assets/ICONS.png";

const SectionTitle = ({ title, highlight }) => (
  <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 tracking-wide text-white">
    {title} <span className="text-yellow-400">{highlight}</span>
  </h2>
);

const IconTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-yellow-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h3l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z"
      />
    </svg>
    <h3 className="text-xl font-bold text-yellow-400">{title}</h3>
  </div>
);

function Aboutus() {
  return (
    <div className="bg-[#0f172a] py-16 px-6 md:px-12 lg:px-32">
      {/* Title */}
      <SectionTitle title="About" highlight="Us" />

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-14">

        {/* Left Content */}
        <div className="flex-1 text-white max-w-xl">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">Our Story</h3>

          <p className="font-medium leading-relaxed text-gray-300 text-justify mb-6">
            At ICONS, we offer a wide array of printing solutions that bring your vision
            to life with precision, creativity, and reliability.
            Whether you're working on personal projects or business needs, we are dedicated
            to delivering exceptional quality and service.
          </p>

          {/* Why Choose Us */}
          <IconTitle title="Why Choose Us?" />

          <ol className="list-decimal pl-6 space-y-3 text-gray-300 text-base">
            <li>
              <strong className="text-yellow-400">Versatile Printing Options:</strong> From business cards and brochures to
              posters and invitations — we cover all printing needs.
            </li>
            <li>
              <strong className="text-yellow-400">Cutting-Edge Technology:</strong> Modern machines ensure crisp, vibrant
              and high-quality prints.
            </li>
            <li>
              <strong className="text-yellow-400">Personalized Solutions:</strong> Projects are tailored to your
              requirements for a perfect output.
            </li>
            <li>
              <strong className="text-yellow-400">Exceptional Customer Service:</strong> Our team ensures a smooth,
              guided, and hassle-free printing experience.
            </li>
            <li>
              <strong className="text-yellow-400">Eco-Friendly Practices:</strong> We prioritize sustainability with
              eco-friendly materials and responsible workflow.
            </li>
          </ol>
        </div>

        {/* Right Section — Logo */}
        <div className="flex-1 flex justify-center">
          <img
            src={logo}
            alt="ICONS Logo"
            className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
          />
        </div>

      </div>
    </div>
  );
}

export default Aboutus;