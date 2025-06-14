import logo from "../assets/ICONS.png"

function Aboutus() {
  return (
    <div className="bg-white p-8 md:p-12 lg:p-16">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center">About us</h2>

      {/* Flex Container */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        {/* Left Content */}
        <div className="flex-1">
          {/* Our Story */}
          <h3 className="text-2xl font-semibold text-blue-800 mb-2">Our Story</h3>
          <p className="font-semibold mb-4">
            At ICONS, we offer a wide array of printing solutions that cater to diverse needs, ensuring your vision comes to life with precision and creativity.
            Our commitment is to deliver exceptional quality and service, whether for personal projects or business endeavors.
          </p>

          {/* Why Choose Us */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
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
              <h3 className="text-xl font-bold">Why Choose Us?</h3>
            </div>

            <ol className="list-decimal pl-5 space-y-3 text-gray-700">
              <li>
                <strong>Versatile Printing Options:</strong> From business cards and brochures to custom posters and invitations, our range of services covers all your printing needs.
              </li>
              <li>
                <strong>Cutting-Edge Technology:</strong> Utilizing the latest printing technology, we guarantee crisp, vibrant results that make your prints stand out.
              </li>
              <li>
                <strong>Personalized Solutions:</strong> We work closely with you to tailor each project to your exact specifications, offering customization options that bring your ideas to life.
              </li>
              <li>
                <strong>Exceptional Customer Service:</strong> Our dedicated team is here to guide you through every step of the process, ensuring a seamless and enjoyable experience.
              </li>
              <li>
                <strong>Eco-Friendly Practices:</strong> We are committed to sustainability, using eco-friendly materials and processes wherever possible.
              </li>
            </ol>
          </div>
        </div>

        {/* Right Logo */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src={logo}
            alt="ICONS Logo"
            className="w-64 h-auto object-contain mt-10 lg:mt-0"
          />
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
