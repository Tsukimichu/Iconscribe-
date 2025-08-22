import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { Eye, EyeOff, ArrowBigLeft, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gray-150 flex items-center justify-center relative">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[650px] flex overflow-hidden">
        
        <div className="w-1/2 p-10 flex flex-col relative overflow-y-auto">
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-gray-600 hover:text-yellow-500 transition"
          >
            <ArrowBigLeft size={26} />
          </button>

          
          <div className="flex flex-col flex-grow justify-center">
            
            <div className="flex justify-center mb-6">
              <motion.img
                src={logo}
                alt="Logo"
                className="h-14 drop-shadow-md"
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
                  className="text-center"
                >
                  <CheckCircle
                    className="mx-auto text-green-400 drop-shadow-md"
                    size={56}
                  />
                  <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-900">
                    Registration Successful
                  </h2>
                  <p className="text-gray-700 mb-6">
                    You have successfully signed up.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold"
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
                  className="flex flex-col flex-grow"
                >
                  <h2 className="text-2xl font-extrabold mb-4 text-gray-900 text-center">
                    Sign Up
                  </h2>

                  <form className="space-y-3 flex-grow" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />

                    
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2.5 rounded-xl shadow-lg font-semibold hover:shadow-xl transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </form>

                  
                  <div className="mt-auto text-center">
                    <p className="mt-3 text-sm text-gray-800">
                      Already have an account?{" "}
                      <span
                        className="text-yellow-500 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-gray-700">
                      By signing up, you agree to{" "}
                      <a
                        href="/terms"
                        className="text-yellow-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-yellow-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        
        <div className="w-1/2 h-full">
          <img
            src={orgImage}
            alt="Organization"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
