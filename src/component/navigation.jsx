import React from 'react';
import logo from '../assets/ICONS.png';

function Navigation() {
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Products', id: 'product' },
    { label: 'Transactions', id: 'transactions' },
    { label: 'About us', id: 'about-us' },
    { label: 'Contact us', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between w-full px-4 py-3 bg-[#243b7d] text-white shadow-md rounded-b-lg">
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="logo"
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 md:gap-8">
        <ul className="flex flex-wrap gap-3 md:gap-6 text-sm md:text-base font-bold">
          {navItems.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => handleScroll(id)}
                className="px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-yellow-400 hover:text-black"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <a
          href="/login"
          className="bg-yellow-400 text-[#243b7d] font-semibold px-4 py-2 rounded-full shadow-md hover:bg-yellow-300 transition"
        >
          Login/Register
        </a>
      </div>
    </nav>
  );
}

export default Navigation;
