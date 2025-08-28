import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { Eye, EyeOff, ArrowBigLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${orgImage})`,
          filter: "blur(4px)",
        }}
      ></div>

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
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
                      required
                    />

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
                      <div className="text-sm text-center text-gray-800 mt-2">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-yellow-500 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-700 text-center">
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
