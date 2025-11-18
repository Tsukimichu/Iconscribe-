import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";
import logo from "../assets/ICONS.png";
import { useAuth } from "../context/authContext";
import { API_URL } from "../api";


function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-700">{children}</div>
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

  const { logout } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profile, setProfile] = useState({
    user_id: "",
    name: "",
    email: "",
    business: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile({
        user_id: user.user_id || user.id || "",
        name: user.name || "",
        email: user.email || "",
        business: user.business || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, []);

  // Helper function to generate consistent color based on name
  const getProfileColor = (name) => {
    const colors = [
      "#F87171", "#FBBF24", "#34D399", "#60A5FA",
      "#A78BFA", "#F472B6", "#F59E0B", "#10B981",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };


  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        business: profile.business,
        phone: profile.phone,
        address: profile.address,
      };

      console.log("Saving profile payload:", payload);

      const response = await fetch(`${API_URL}/users/${profile.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(profile));
        setIsEditing(false);
        setShowSaveModal(true);
      } else {
        alert("Failed to update profile: " + result.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);

    setTimeout(() => {
      logout(); 
      navigate("/dashboard", { replace: true });
    }, 300);
  };


  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <img src={logo} alt="Logo" className="h-10" />
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ArrowBigLeft />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: getProfileColor(profile.name || "U") }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </nav>

      {/* Profile Layout */}
      <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200">
          <div className="w-full border border-gray-300 rounded-xl p-4">
          <div
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-6xl font-bold"
            style={{ backgroundColor: getProfileColor(profile.name || "U") }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
            <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-gray-500">User ID: #{profile.user_id}</p>
          </div>

          {/* Delete Account */}
          <div className="mt-6 text-left">
            <p className="text-sm text-red-600 font-semibold">Delete my account</p>
            <p className="text-xs text-gray-500">
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

        {/* Right Card */}
        <div className="md:col-span-2 bg-white shadow-md rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "business", "phone", "address"].map((field, idx) => (
              <input
                key={idx}
                type="text"
                name={field}
                value={profile[field]}
                onChange={handleChange}
                placeholder={field}
                disabled={!isEditing}
                className={`px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none ${
                  field === "address" ? "md:col-span-2" : ""
                } ${!isEditing && "opacity-70 cursor-not-allowed"}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 flex-wrap">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full hover:bg-yellow-300 transition"
              >
                Edit Info
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
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
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full hover:bg-yellow-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p>Are you sure you want to log out?</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleLogout}
            className="w-1/2 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold transition"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => setShowLogoutModal(false)}
            className="w-1/2 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </Modal>


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

      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Changes Saved"
      >
        <p>Your account details have been updated successfully.</p>
      </Modal>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
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
