import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { Eye, EyeOff, ArrowBigLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ui/ToastProvider.jsx";

function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    try {
      const signupRes = await axios.post("http://localhost:5000/api/signup", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });

      if (!signupRes.data.success) {
        showToast("Signup failed. Please try again.", "error");
        return;
      }

      const otpRes = await axios.post("http://localhost:5000/api/send-otp", {
        email: formData.email,
      });

      if (otpRes.data.success) {
        setGeneratedOtp(otpRes.data.otp);
        setOtpSent(true);
        showToast(`OTP sent to ${formData.email}`, "success");
      } else {
        showToast("Failed to send OTP. Please try again.", "error");
      }
    } catch (err) {
      console.error("Error during signup or OTP sending:", err);
      showToast("Something went wrong. Please try again later.", "error");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === String(generatedOtp)) {
      setSuccess(true);
      showToast("Your account has been verified successfully!", "success");
    } else {
      setShake(true);
      showToast("Incorrect OTP. Please try again.", "error");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${orgImage})`, filter: "blur(4px)" }}
      />

      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl md:h-[650px] flex flex-col md:flex-row overflow-hidden">

        {/* LEFT (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col relative overflow-y-auto">

          {/* Back Btn */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-gray-600 hover:text-yellow-500 transition md:block hidden"
          >
            <ArrowBigLeft size={26} />
          </button>

          {/* Content */}
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
                /* SUCCESS SCREEN */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <CheckCircle className="mx-auto text-green-400" size={56} />
                  <h2 className="text-2xl font-bold mt-4">Registration Successful</h2>
                  <p className="text-gray-700 mt-2 mb-6">
                    Your account has been verified.
                  </p>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-xl font-semibold hover:shadow-lg"
                  >
                    Continue to Login
                  </button>
                </motion.div>
              ) : otpSent ? (
                /* OTP VERIFY */
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
                    Verify Your Account
                  </h2>

                  <p className="text-gray-700 mb-4">
                    Enter the 6-digit OTP sent to your email.
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <motion.div
                      animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex justify-center gap-2 sm:gap-3 mb-2"
                    >
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength="1"
                          value={otp[i] || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/, "");
                            const otpArray = otp.split("");
                            otpArray[i] = value;
                            setOtp(otpArray.join(""));
                            if (value && e.target.nextSibling) {
                              e.target.nextSibling.focus();
                            }
                          }}
                          className="w-10 h-12 sm:w-12 sm:h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                        />
                      ))}
                    </motion.div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-xl shadow-lg font-semibold hover:shadow-xl"
                    >
                      Verify OTP
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                /* SIGNUP FORM */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-extrabold mb-4 text-gray-900 text-center">
                    Sign Up
                  </h2>

                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300"
                      required
                    />

                    {/* PASSWORD */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-3"
                      >
                        {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-xl shadow-lg font-semibold hover:shadow-xl"
                    >
                      Sign Up
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-sm text-center text-gray-800 mt-3">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-yellow-500 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </div>
        </div>

        {/* RIGHT IMAGE (moves below on small screens) */}
        <div className="hidden lg:block w-1/2 h-full">
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
