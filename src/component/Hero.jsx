import bg from '../assets/org.jpg';

function Hero() {
  return (
    <div
      className="relative h-[500px] bg-cover bg-center flex items-center px-6 sm:px-10 lg:px-20"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-white max-w-xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
          Fast.<br />
          Reliable.<br />
          Professional Printing Services
        </h1>
        <p className="mt-3 text-sm sm:text-base text-white">
          Order online and have your documents delivered or ready for pickup
        </p>
      </div>
    </div>
  );
}

export default Hero;
