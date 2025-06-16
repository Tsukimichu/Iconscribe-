import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft } from 'lucide-react';
import logo from '../assets/ICONS.png';

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/dashboard'); // adjust if your homepage is a different route
  };

  return (
    <div className="min-h-screen bg-gray-100 text-[#243b7d]">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between bg-[#243b7d] px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-white hover:text-yellow-300 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <img src={logo} alt="Logo" className="h-10 ml-4" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-yellow-400 text-[#243b7d] font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
          <div className="w-9 h-9 bg-white border-2 border-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">👤</span>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Picture Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="w-full border-2 border-blue-300 rounded-lg p-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
              👤
            </div>
            <h2 className="mt-4 text-xl font-bold">Aldrin Portento</h2>
            <p className="text-sm text-gray-500">#089643</p>
          </div>

          <div className="mt-6 text-left">
            <p className="text-sm text-red-500 font-semibold">Delete my account</p>
            <p className="text-xs text-gray-500">If you delete your account, your data will be done forever.</p>
            <button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition">
              Delete Account
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-bold mb-2">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              defaultValue="Aldrin Portento"
              placeholder="Name"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="email"
              defaultValue="Aldrin@gmail.com"
              placeholder="Email"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="text"
              placeholder="Business Name"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="text"
              defaultValue="09123456789"
              placeholder="Contact Number"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="text"
              defaultValue="#30 Bangus St. Murallon Boac, Marinduque"
              placeholder="Location"
              className="md:col-span-2 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button className="bg-[#243b7d] text-white px-4 py-2 rounded-full hover:bg-blue-800 transition">
              Edit Info
            </button>
            <button className="bg-yellow-400 text-[#243b7d] px-4 py-2 rounded-full hover:bg-yellow-300 transition">
              Change Password
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg border p-4 text-center text-gray-500 text-sm">
              ~ No Transactions ~
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
