import bg from '../assets/org.jpg'

function Hero(){
    return(
        <>
        <div
        className="relative h-[500px] bg-cover bg-center flex items-center px-6 sm:px-10 lg:px-20 mt-0"
        style={{ backgroundImage: `url(${bg})` }}
        >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text Content */}
      <div className="relative z-10 text-white max-w-xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Fast.<br />
          Reliable.<br />
          Professional Printing Services
        </h1>
        <p className="mt-2 text-sm sm:text-base text-white">
          Order online and have your documents delivered or ready for pickup
        </p>
      </div>
    </div>

        </>
    );
}

export default Hero;