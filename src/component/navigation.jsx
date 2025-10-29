import React, { useEffect, useState } from "react";
import logo from "../assets/ICONS.png";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Menu, X, ChevronDown } from "lucide-react";

function Navigation() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loginStatus = !!localStorage.getItem("token");
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const handleScroll = (id) => {
    if (window.location.pathname === "/dashboard") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
        setMenuOpen(false);
      }
    } else {
      navigate(`/dashboard`);
    }
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Products", id: "product" },
    ...(isLoggedIn ? [{ label: "Transactions", id: "transactions" }] : []),
    { label: "About us", id: "about-us" },
    { label: "Contact us", id: "contact" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 text-white shadow-lg backdrop-blur-md border-b border-yellow-400/30"
      style={{
        background: "linear-gradient(135deg, #0a2a6c, #0e4aa8, #0d64c7)",
      }}
    >
      <div className="flex items-center justify-between w-full px-6 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            className="w-14 h-14 object-contain drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6 text-sm md:text-base font-semibold tracking-wide">
            {navItems.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(id)}
                  className={`px-5 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === id
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(250,204,21,0.9)]"
                      : "hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-500 hover:text-black hover:shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}

          </ul>
        </div>

        {/* Right side login/logout (Desktop) */}
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

        {/* Mobile Toggle Button */}
        <button className="md:hidden ml-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d3c8c] bg-opacity-95 border-t border-yellow-400/40">
          <ul className="flex flex-col p-4 space-y-2 text-center font-semibold text-base">
            {navItems.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(id)}
                  className="block w-full px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
                >
                  {label}
                </button>
              </li>
            ))}

            {/* Mobile Dropdown */}
            <li>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex justify-center items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
              >
                Quotation
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <ul className="mt-1 bg-white text-black rounded-lg overflow-hidden shadow-md mx-6">
                  <li>
                    <Link
                      to="/quotation/request"
                      className="block px-4 py-2 hover:bg-yellow-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Single Shit Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/quotation/history"
                      className="block px-4 py-2 hover:bg-yellow-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Soft Bound Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/quotation/history"
                      className="block px-4 py-2 hover:bg-yellow-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Hard Bound Service
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Mobile Login/Logout */}
            <li className="border-t border-yellow-400/40 pt-3 mt-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-yellow-300 hover:text-yellow-500"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full mt-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full mt-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500"
                >
                  Login / Register
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
