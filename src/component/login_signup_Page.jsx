import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import orgImage from "../assets/org.jpg"; 

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex w-[900px] h-[600px] bg-white shadow-xl rounded-3xl overflow-hidden">
        
        <AnimatePresence mode="wait">
          <motion.div
    className={`absolute top-0 h-full w-1/2 ${isLogin ? "left-0" : "right-0"}`}
    initial={{ x: isLogin ? "-100%" : "100%", opacity: 0 }}
    animate={{ x: "0%", opacity: 1 }}
    exit={{ x: isLogin ? "-100%" : "100%", opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={orgImage}
              alt="Organization"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login-form"
              className="absolute right-0 w-1/2 h-full flex flex-col items-center justify-center p-10"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold mb-6">Login</h2>
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 p-3 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-4 p-3 border rounded-lg"
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Login
              </button>
              <p className="mt-6 text-sm">
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup-form"
              className="absolute left-0 w-1/2 h-full flex flex-col items-center justify-center p-10"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
              <input
                type="text"
                placeholder="Name"
                className="w-full mb-4 p-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 p-3 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-4 p-3 border rounded-lg"
              />
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Sign Up
              </button>
              <p className="mt-6 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Auth;
