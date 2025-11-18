import logo from "../assets/ICONS.png";

const SectionTitle = ({ title, highlight }) => (
  <h2 className="text-3xl text-white md:text-5xl font-extrabold text-center mb-16 tracking-wide">
    {title} <span className="text-yellow-400">{highlight}</span>
  </h2>
);

const IconTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 text-yellow-400"
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
    <h3 className="text-xl font-extrabold text-yellow-400">{title}</h3>
  </div>
);

function Aboutus() {
  return (
    <div className="bg-[#0f172a] py-15 px-6 md:px-12 lg:px-40">

      {/* Title */}
      <SectionTitle title="About" highlight="Us" />

      {/* Content Wrapper */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Left Section */}
        <div className="flex-1 text-white text-center lg:text-left flex flex-col items-center lg:items-start">

          <h3 className="text-2xl font-bold text-yellow-400 mb-2">Our Story</h3>

          <p className="font-semibold leading-relaxed mb-6 max-w-xl text-justify">
            At ICONS, we offer a wide array of printing solutions that cater to diverse needs,
            ensuring your vision comes to life with precision and creativity. <br />
            Our commitment is to deliver exceptional quality and service, whether for personal projects or business endeavors.
          </p>

          {/* Why Choose Us */}
          <div className="mt-6 w-full max-w-xl">
            <IconTitle title="Why Choose Us?" />

            <ol className="list-decimal pl-5 space-y-3 text-gray-300 text-base">
              <li>
                <strong>Versatile Printing Options:</strong> From business cards and brochures to custom posters and invitations, our range of services covers all your printing needs.
              </li>
              <li>
                <strong>Cutting-Edge Technology:</strong> Utilizing the latest printing technology, we guarantee crisp, vibrant results that make your prints stand out.
              </li>
              <li>
                <strong>Personalized Solutions:</strong> We work closely with you to tailor each project based on your requirements, offering deep customization.
              </li>
              <li>
                <strong>Exceptional Customer Service:</strong> Our dedicated team guides you through every step, ensuring a smooth and enjoyable experience.
              </li>
              <li>
                <strong>Eco-Friendly Practices:</strong> We prioritize sustainability by using eco-friendly materials and responsible processes.
              </li>
            </ol>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="flex-1 flex justify-center">
          <img
            src={logo}
            alt="ICONS Logo"
            className="w-[320px] md:w-[440px] lg:w-[520px] h-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
}

export default Aboutus;
