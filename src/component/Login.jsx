import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "./ui/ToastProvider.jsx";
import { useAuth } from "../context/authContext.jsx";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth(); 
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);


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
        login(data.token, data.user);

        showToast("Login successful!", "success");

        // navigate based on role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "manager") {
          navigate("/manager");
        } else {
          navigate("/dashboard");
        }
      } else {
        showToast(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request OTP
  const requestResetOtp = async () => {
    if (!resetUsername) {
      showToast("Please enter your username", "error");
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/request-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: resetUsername }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`OTP sent to your email`, "success");
        setStep(2); // Go to OTP input
      } else {
        showToast(data.message || "User not found", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setResetLoading(false);
    }
  };

  // Step 2a: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      showToast("Enter the OTP", "error");
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: resetUsername, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("OTP verified! You can now set a new password.", "success");
        setOtpVerified(true); // Allow password input
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setResetLoading(false);
    }
  };

  // Step 2b: Set new password
  const submitNewPassword = async () => {
    if (!newPassword || !otp) {
      showToast("Enter both OTP and new password", "error");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reset-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: resetUsername, 
          password: newPassword, 
          otp 
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Password updated successfully!", "success");
        setShowResetModal(false);
        setStep(1);
        setResetUsername("");
        setOtp("");
        setNewPassword("");
        setOtpVerified(false);
      } else {
        showToast(data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setResetLoading(false);
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
          <img src={orgImage} alt="Organization" className="w-full h-full object-cover" />
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
                <User className="absolute left-3 top-2.5 text-gray-600" size={18} />
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
                <Lock className="absolute left-3 top-2.5 text-gray-600" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-2.5"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
              </div>
                <p
                  className="text-xs text-gray-500 hover:text-yellow-500 cursor-pointer mb-4"
                  onClick={() => setShowResetModal(true)}
                >
                  Forgot Password?
                </p>
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

            {showResetModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
                >
                  <button
                    onClick={() => { setShowResetModal(false); setStep(1); }}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>

                  {step === 1 && (
                    <>
                      <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
                      <p className="text-gray-600 text-sm text-center mb-4">
                        Enter your username to receive a password reset OTP.
                      </p>
                      <input
                        type="text"
                        placeholder="Username"
                        value={resetUsername}
                        onChange={(e) => setResetUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl mb-4 focus:ring-2 focus:ring-yellow-400"
                      />
                      <motion.button
                        onClick={requestResetOtp}  // ✅ replaced
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-yellow-500 text-black py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg"
                        disabled={resetLoading}
                      >
                        {resetLoading ? "Sending..." : "Send OTP"}
                      </motion.button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h2 className="text-xl font-semibold text-center mb-4">
                        {otpVerified ? "Set New Password" : "Verify OTP"}
                      </h2>

                      {!otpVerified && (
                        <>
                          {/* Replace your single OTP input with this component */}
                          <div className="flex justify-center gap-2 mb-4">
                            {Array(6).fill(0).map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={otp[index] || ""}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/, ""); // only digits
                                  if (!val) return;

                                  const newOtp = otp.split("");
                                  newOtp[index] = val;
                                  setOtp(newOtp.join(""));

                                  // focus next input
                                  const nextInput = document.getElementById(`otp-${index + 1}`);
                                  if (nextInput) nextInput.focus();
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Backspace" && !otp[index] && index > 0) {
                                    const prevInput = document.getElementById(`otp-${index - 1}`);
                                    if (prevInput) prevInput.focus();
                                    const newOtp = otp.split("");
                                    newOtp[index - 1] = "";
                                    setOtp(newOtp.join(""));
                                  }
                                }}
                                id={`otp-${index}`}
                                className="w-12 h-12 text-center border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                              />
                            ))}
                          </div>
                          <motion.button
                            onClick={verifyOtp}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-yellow-500 text-black py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg"
                            disabled={resetLoading}
                          >
                            {resetLoading ? "Verifying..." : "Verify OTP"}
                          </motion.button>
                        </>
                      )}

                      {otpVerified && (
                        <>
                          <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl mb-4 focus:ring-2 focus:ring-yellow-400"
                          />
                          <motion.button
                            onClick={submitNewPassword}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-yellow-500 text-black py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg"
                            disabled={resetLoading}
                          >
                            {resetLoading ? "Updating..." : "Update Password"}
                          </motion.button>
                        </>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
