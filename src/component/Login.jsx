import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { User, Lock } from "lucide-react";
import { motion } from "framer-motion";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Save JWT + user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("isLoggedIn", "true");

        if (onLogin) onLogin();

        // ✅ Role-based redirection
        if (data.data.role === "admin") {
          navigate("/admin");
        } else if (data.data.role === "manager") {
          navigate("/manager");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "❌ Invalid credentials");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${orgImage})`, filter: "blur(4px)" }}
      />

      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-4xl w-full max-w-5xl h-[650px] flex overflow-hidden">
        {/* Left Image */}
        <div className="w-1/2 h-full">
          <img
            src={orgImage}
            alt="Organization"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 p-10 flex flex-col relative overflow-y-auto">
          <div className="flex flex-col flex-grow justify-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="h-14 drop-shadow-md" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Log In
            </h2>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-gray-600"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-gray-600"
                  size={18}
                />
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
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2.5 rounded-xl shadow-lg font-semibold hover:shadow-xl transition-all disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Log in"}
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
