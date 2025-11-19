import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Building2, 
  Phone, 
  MapPin, 
  Lock, 
  LogOut, 
  Trash2, 
  Edit2, 
  Check, 
  Save,
  X
} from "lucide-react";
import logo from "../assets/ICONS.png";
import { useAuth } from "../context/authContext";
import { API_URL } from "../api";

// --- Modernized Modal ---
function Modal({ isOpen, onClose, title, children, showCloseButton = true }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white border border-slate-100 rounded-3xl p-8 w-full max-w-md shadow-2xl transform scale-100 transition-all">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            {showCloseButton && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                    <X size={24} />
                </button>
            )}
        </div>
        
        <div className="text-slate-600 text-base leading-relaxed">{children}</div>
        
        {showCloseButton && (
          <button
            onClick={onClose}
            className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition active:scale-[0.98]"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // States
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

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
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

  const getProfileColor = (name) => {
    const colors = [
      "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
      "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // --- Handlers ---
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const payload = { ...profile }; // Construct payload based on state
      const response = await fetch(`${API_URL}/users/${profile.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(profile));
        setIsEditing(false);
        setShowSaveModal(true);
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving.");
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }
    if (!passwordData.current || !passwordData.new) return;

    try {
        const response = await fetch(`${API_URL}/users/${profile.user_id}/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                currentPassword: passwordData.current, 
                newPassword: passwordData.new 
            }),
        });
        const result = await response.json();
        if (result.success) {
            setShowPasswordModal(false);
            setPasswordData({ current: "", new: "", confirm: "" });
            alert("Password updated.");
        } else {
            alert(result.message || "Failed to update.");
        }
    } catch (error) {
        console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
      try {
          const response = await fetch(`${API_URL}/users/${profile.user_id}`, { method: "DELETE" });
          if (response.ok) {
              setShowDeleteModal(false);
              logout();
              navigate("/");
          }
      } catch (error) {
          console.error(error);
      }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setTimeout(() => {
      logout(); 
      navigate("/dashboard", { replace: true });
    }, 300);
  };

  // --- Field Config for cleaner rendering ---
  const fields = [
    { name: "name", icon: User, placeholder: "Full Name" },
    { name: "email", icon: Mail, placeholder: "Email Address" },
    { name: "business", icon: Building2, placeholder: "Business Name" },
    { name: "phone", icon: Phone, placeholder: "Phone Number" },
    { name: "address", icon: MapPin, placeholder: "Full Address", fullWidth: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-12">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition">
                <ArrowLeft size={22} />
            </button>
            <img src={logo} alt="Logo" className="h-8 opacity-90" />
        </div>
        <div className="flex items-center gap-3">
             <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-800">{profile.name || "User"}</p>
                <p className="text-xs text-slate-500">{profile.business || "My Business"}</p>
             </div>
             <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white"
                style={{ backgroundColor: getProfileColor(profile.name || "U") }}
             >
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
             </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto pt-10 px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Profile Card */}
            <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden sticky top-24">
                    {/* Decorative Header */}
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
                    
                    <div className="px-6 pb-8 text-center relative">
                        <div className="-mt-16 mb-4 inline-block relative">
                             <div 
                                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg"
                                style={{ backgroundColor: getProfileColor(profile.name || "U") }}
                            >
                                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800">{profile.name || "Guest User"}</h2>
                        <p className="text-slate-500 font-medium mb-6">{profile.email}</p>

                        <div className="border-t border-slate-100 pt-6 space-y-3">
                            <button 
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-indigo-600 transition flex items-center justify-center gap-2"
                            >
                                <Lock size={18} /> Change Password
                            </button>
                            
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 font-medium transition flex items-center justify-center gap-2 text-sm"
                            >
                                <Trash2 size={16} /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Edit Form */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Profile Settings</h3>
                            <p className="text-slate-500">Manage your personal information</p>
                        </div>
                        
                        {/* Toggle Edit Button */}
                        {!isEditing ? (
                             <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-300/50"
                             >
                                <Edit2 size={18} /> Edit
                             </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                >
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.map((field, idx) => (
                             <div key={idx} className={`relative ${field.fullWidth ? "md:col-span-2" : ""}`}>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    {field.placeholder}
                                </label>
                                <div className="relative">
                                    <field.icon className={`absolute left-4 top-3.5 transition-colors ${isEditing ? "text-indigo-500" : "text-slate-400"}`} size={20} />
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={profile[field.name]}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all outline-none
                                            ${isEditing 
                                                ? "bg-white border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800" 
                                                : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"
                                            }
                                        `}
                                    />
                                </div>
                             </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition px-4 py-2 hover:bg-red-50 rounded-lg"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- Modals --- */}
      
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Signing Out?"
        showCloseButton={false} 
      >
        <p className="mb-6">You will need to sign back in to access your dashboard.</p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-300 transition"
          >
            Confirm Logout
          </button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="p-4 bg-red-50 rounded-xl mb-6 border border-red-100">
            <div className="flex gap-3 text-red-700 font-semibold mb-1">
                <Trash2 size={20} /> Warning
            </div>
            <p className="text-sm text-red-600">
                This action is permanent. All your data, business info, and settings will be erased.
            </p>
        </div>
        <button 
            onClick={handleDeleteAccount}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-200 transition"
        >
          Yes, Delete Forever
        </button>
      </Modal>

      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Success!">
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <Check size={32} />
            </div>
            <p className="text-slate-600">Your profile information has been updated successfully.</p>
        </div>
      </Modal>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Update Security" showCloseButton={false}>
         <div className="absolute top-6 right-6">
            <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600"><X/></button>
         </div>
        <div className="space-y-4 mt-2">
            {["current", "new", "confirm"].map((field, i) => (
                 <div key={i} className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                        type="password"
                        name={field}
                        value={passwordData[field]}
                        onChange={handlePasswordChange}
                        placeholder={
                            field === "current" ? "Current Password" :
                            field === "new" ? "New Password" : "Confirm Password"
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                    />
                 </div>
            ))}
        </div>
        <button 
            onClick={handleSavePassword}
            className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition"
        >
          Update Password
        </button>
      </Modal>

    </div>
  );
}

export default Profile;