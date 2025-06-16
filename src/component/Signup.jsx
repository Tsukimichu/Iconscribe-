import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ICONS.png';
import bgImage from '../assets/org.jpg';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate success (replace with actual sign-up logic)
    setTimeout(() => setSuccess(true), 500);
  };

  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-bottom flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 text-blue-700 hover:text-blue-900 transition"
        >
          <ArrowLeft size={24} />
        </button>

        {/* 🖼️ Logo */}
        <div className="flex justify-center mb-4 mt-2">
          <img src={logo} alt="Logo" className="h-20" />
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
              <CheckCircle className="mx-auto text-green-600" size={48} />
              <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-800">Registration Successful</h2>
              <p className="text-gray-600 mb-6">You have successfully signed up.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#243b7d] text-white py-2 rounded-lg hover:bg-blue-800 transition"
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign up</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                {/* 🔒 Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* 🔁 Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-blue-600"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#243b7d] text-white py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Sign Up
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-600">
                Already have an account?{' '}
                <span
                  className="text-blue-700 font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Login
                </span>
              </p>

              <p className="mt-4 text-xs text-gray-500">
                By signing up, you agree to Icons{' '}
                <a
                  href="/terms"
                  className="text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="text-blue-700 hover:underline"
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
