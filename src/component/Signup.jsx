import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ICONS.png";
import bgImage from "../assets/org.jpg";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSuccess(true), 500);
  };

  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 🌫️ Softer Blur Overlay (not too white, not too blue) */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px]"></div>

      {/* ✨ Subtle Glow Orbs */}
      <motion.div
        className="absolute w-72 h-72 bg-yellow-300/15 rounded-full blur-3xl"
        animate={{ x: [0, 80, -80, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-blue-300/15 rounded-full blur-3xl"
        animate={{ x: [50, -50, 50], y: [80, -80, 80] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🔲 Frosted Glass Card */}
      <div className="relative bg-white/30 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/40">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={26} />
        </button>

        {/* 🖼️ Logo */}
        <div className="flex justify-center mb-6">
          <motion.img
            src={logo}
            alt="Logo"
            className="h-20 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="mx-auto text-green-500 drop-shadow-md" size={56} />
              <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-800">
                Registration Successful
              </h2>
              <p className="text-gray-600 mb-6">You have successfully signed up.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Continue to Login
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
                Sign Up
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />

                {/* 🔒 Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* 🔁 Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-xl shadow-lg font-semibold hover:shadow-xl transition-all"
                >
                  Sign Up
                </motion.button>
              </form>

              <p className="mt-4 text-sm text-gray-700">
                Already have an account?{" "}
                <span
                  className="text-yellow-600 font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>

              <p className="mt-4 text-xs text-gray-600">
                By signing up, you agree to{" "}
                <a
                  href="/terms"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Signup;
