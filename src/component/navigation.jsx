import React, { useEffect, useState } from 'react';
import logo from '../assets/ICONS.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';

function Navigation() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const observedSections = ['home', 'product', 'transactions', 'about-us', 'contact'];

    observedSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      observedSections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Products', id: 'product' },
    ...(isLoggedIn ? [{ label: 'Transactions', id: 'transactions' }] : []),
    { label: 'About us', id: 'about-us' },
    { label: 'Contact us', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between w-full px-4 py-3 bg-[#243b7d] text-white shadow-md rounded-b-lg">
      <div className="flex-shrink-0">
        <img src={logo} alt="logo" className="w-16 h-16 object-contain" />
      </div>

      <div className="flex items-center gap-4">
        <ul className="flex gap-3 md:gap-6 text-sm md:text-base font-bold">
          {navItems.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => handleScroll(id)}
                className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                  activeSection === id
                    ? 'bg-yellow-400 text-black'
                    : 'hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition"
            >
              <LogOut size={18} />
              Logout
            </button>
            <Link to="/profile">
              <UserCircle
                size={32}
                className="hover:text-yellow-400 cursor-pointer transition duration-300"
              />
            </Link>
          </div>
        ) : (
          <Link
            to="/signup"
            className="bg-yellow-400 text-[#243b7d] font-semibold px-4 py-2 rounded-full shadow-md hover:bg-yellow-300 transition"
          >
            Login/Register
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
