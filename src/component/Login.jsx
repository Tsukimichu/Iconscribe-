import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { User, Lock } from "lucide-react";
import { motion } from "framer-motion"; 

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${orgImage})`,
          filter: "blur(4px)"
        }}>

  </div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[650px] flex overflow-hidden">
        
        
        <div className="w-1/2 h-full">
          <img
            src={orgImage}
            alt="Organization"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-1/2 p-10 flex flex-col relative overflow-y-auto">
          <div className="flex flex-col flex-grow justify-center">
            
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="Logo"
                className="h-14 drop-shadow-md"
              />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Log In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-600" size={18} />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-600" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2.5 rounded-xl shadow-lg font-semibold hover:shadow-xl transition-all"
                    >
                      Log in
                    </motion.button>
            </form>

            <div className="text-sm text-center text-gray-800 mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-yellow-500 font-medium cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </div>

            <p className="mt-6 text-xs text-gray-700 text-center">
              By signing up, you agree to Icons’{" "}
              <a href="/terms" className="text-yellow-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-yellow-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
