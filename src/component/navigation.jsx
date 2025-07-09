import React, { useEffect, useState } from 'react';
import logo from '../assets/ICONS.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Menu, X } from 'lucide-react';

function Navigation() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
      setMenuOpen(false); // close mobile menu on click
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
    <nav className="sticky top-0 z-50 bg-[#243b7d] text-white shadow-md rounded-b-lg px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 object-contain" />
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-4 text-sm md:text-base font-bold items-center">
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

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <Link
              to="/signup"
              className="bg-yellow-400 text-[#243b7d] font-semibold px-4 py-2 rounded-full shadow-md hover:bg-yellow-300 transition"
            >
              Login/Register
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-3 border-t pt-4">
          <ul className="space-y-2 font-medium text-sm">
            {navItems.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
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

          {/* Auth buttons (mobile) */}
          <div className="mt-4 space-y-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
                <Link to="/profile" className="flex justify-center">
                  <UserCircle
                    size={32}
                    className="hover:text-yellow-400 transition duration-300"
                  />
                </Link>
              </>
            ) : (
              <Link
                to="/signup"
                className="block text-center bg-yellow-400 text-[#243b7d] font-semibold px-4 py-2 rounded-full shadow-md hover:bg-yellow-300 transition"
              >
                Login/Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
