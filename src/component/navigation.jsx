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
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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
    <nav className="sticky top-0 z-50 text-white shadow-lg backdrop-blur-md border-b border-yellow-400/30"
      style={{ background: "linear-gradient(135deg, #0a2a6c, #0e4aa8, #0d64c7)" }}
    >
      <div className="flex items-center justify-between w-full px-6 py-3">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <img 
            src={logo} 
            alt="logo" 
            className="w-14 h-14 object-contain drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" 
          />
        </div>

        {/* Middle: Nav Items */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6 text-sm md:text-base font-semibold tracking-wide">
            {navItems.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(id)}
                  className={`px-5 py-2 rounded-lg transition-all duration-300 
                  ${
                    activeSection === id
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(250,204,21,0.9)]'
                      : 'hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-500 hover:text-black hover:shadow-[0_0_12px_rgba(250,204,21,0.7)]'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <UserCircle
                  size={36}
                  className="hover:text-yellow-400 cursor-pointer transition duration-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-[0_0_10px_rgba(250,204,21,0.6)] hover:shadow-[0_0_15px_rgba(250,204,21,0.9)] transition-all"
              >
                <div className="flex items-center gap-2">
                  <LogOut size={18} />
                  Logout
                </div>
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-5 py-2 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.6)] hover:shadow-[0_0_15px_rgba(250,204,21,0.9)] transition-all"
            >
              Login/Register
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden ml-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t border-yellow-400/30 pt-4 bg-[#0a2a6c]/95 backdrop-blur-lg rounded-b-lg">
          <ul className="space-y-2 font-medium text-sm">
            {navItems.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                  ${
                    activeSection === id
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(250,204,21,0.9)]'
                      : 'hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-500 hover:text-black'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Auth (Mobile) */}
          <div className="mt-4 space-y-2 px-4 pb-4">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex justify-center">
                  <UserCircle
                    size={36}
                    className="hover:text-yellow-400 transition duration-300"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-[0_0_12px_rgba(250,204,21,0.7)] hover:shadow-[0_0_15px_rgba(250,204,21,0.9)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/signup"
                className="block text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-5 py-2 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.6)] hover:shadow-[0_0_15px_rgba(250,204,21,0.9)] transition-all"
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
