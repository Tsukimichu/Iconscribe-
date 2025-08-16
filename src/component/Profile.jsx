import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import logo from "../assets/ICONS.png";

// Reusable Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{title}</h2>
        <div className="text-white">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Sample profile state
  const [profile, setProfile] = useState({
    name: "Aldrin Portento",
    email: "Aldrin@gmail.com",
    business: "",
    contact: "09123456789",
    location: "#30 Bangus St. Murallon Boac, Marinduque",
  });

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white/5 backdrop-blur-lg px-6 py-4 shadow-lg border-b border-white/10">
        <img src={logo} alt="Logo" className="h-10 drop-shadow-lg" />
        <div className="flex items-center gap-3">
          {/* 🔙 Back button inside nav */}
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-9 h-9 bg-white/20 backdrop-blur-lg border border-yellow-400 rounded-full flex items-center justify-center text-lg">
            👤
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-lg shadow-lg rounded-2xl p-6 text-center border border-white/10">
          <div className="w-full border border-yellow-400/50 rounded-xl p-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
              👤
            </div>
            <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-gray-400">#089643</p>
          </div>

          <div className="mt-6 text-left">
            <p className="text-sm text-red-500 font-semibold">Delete my account</p>
            <p className="text-xs text-gray-400">
              If you delete your account, your data will be gone forever.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "business", "contact", "location"].map((field, idx) => (
              <input
                key={idx}
                type="text"
                name={field}
                value={profile[field]}
                onChange={handleChange}
                placeholder={field}
                disabled={!isEditing}
                className={`px-3 py-2 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none ${
                  field === "location" ? "md:col-span-2" : ""
                } ${!isEditing && "opacity-70 cursor-not-allowed"}`}
              />
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-400 text-[#1e293b] px-4 py-2 rounded-full hover:bg-yellow-300 transition"
              >
                Edit Info
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowSaveModal(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 transition"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition"
            >
              Change Password
            </button>
            {/* 🔽 Logout moved down here */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-yellow-400 text-[#1e293b] px-4 py-2 rounded-full hover:bg-yellow-300 transition"
            >
              Logout
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Order Summary</h3>
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 text-center text-gray-400 text-sm">
              ~ No Transactions ~
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Modals Section */}
      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p>Are you sure you want to log out?</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-[#1e293b] font-semibold transition"
        >
          Yes, Logout
        </button>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <p className="mb-3">
          This action cannot be undone. Are you sure you want to delete your account?
        </p>
        <button className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition">
          Yes, Delete
        </button>
      </Modal>

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Changes Saved"
      >
        <p>Your account details have been updated successfully.</p>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>
        <button className="mt-4 w-full py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white font-semibold transition">
          Save New Password
        </button>
      </Modal>
    </div>
  );
}

export default Profile;
