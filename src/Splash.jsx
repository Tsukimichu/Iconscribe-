import React, { useEffect, useState } from 'react';
import bg from './assets/org.jpg';
import logo from './assets/ICONS.png';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-bottom text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="text-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain mb-4 drop-shadow-lg"
        />

        <div className="text-6xl font-bold animate-pulse">ICONScribe</div>
        <div className="text-2xl font-regular">Icons Copy and Print Services</div>
        <div className="text-l font-light italic mb-9">– we make your idea into reality –</div>

        {/* Clean Loading Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.1s]" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
