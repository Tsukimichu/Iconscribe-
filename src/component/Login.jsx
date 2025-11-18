import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ICONS.png";
import orgImage from "../assets/org.jpg";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "./ui/ToastProvider.jsx";
import { useAuth } from "../context/authContext.jsx";
import { API_URL } from "../api";

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
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.token, data.user);
        showToast("Login successful!", "success");

        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "manager") navigate("/manager");
        else navigate("/dashboard");
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

  /* ---------------- RESET PASSWORD ---------------- */
  const requestResetOtp = async () => {
    if (!resetUsername) return showToast("Please enter your username", "error");

    setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/request-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: resetUsername }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("OTP sent to your email", "success");
        setStep(2);
      } else {
        showToast(data.message || "User not found", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    setResetLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) return showToast("Enter the OTP", "error");

    setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: resetUsername, otp }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("OTP verified!", "success");
        setOtpVerified(true);
      } else showToast("Invalid OTP", "error");
    } catch {
      showToast("Something went wrong", "error");
    }
    setResetLoading(false);
  };

  const submitNewPassword = async () => {
    if (!newPassword) return showToast("Enter new password", "error");

    setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resetUsername,
          otp,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Password updated!", "success");
        setShowResetModal(false);
        setStep(1);
        setOtp("");
        setNewPassword("");
        setResetUsername("");
        setOtpVerified(false);
      } else {
        showToast("Failed to update password", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    setResetLoading(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${orgImage})`, filter: "blur(5px)" }}
      />

      {/* MAIN CARD */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden min-h-[550px] lg:h-[650px]">
        
        {/* LEFT IMAGE (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          <img src={orgImage} className="w-full h-full object-cover" />
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
          <div className="flex flex-col flex-grow justify-center">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logo} className="h-14" />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Log In
            </h2>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-600" size={18} />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-600" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <p
                onClick={() => setShowResetModal(true)}
                className="text-xs text-gray-600 hover:text-yellow-500 cursor-pointer"
              >
                Forgot Password?
              </p>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-yellow-500 py-3 rounded-xl font-semibold shadow-lg"
              >
                {loading ? "Logging in..." : "Log in"}
              </motion.button>
            </form>

            {/* SIGNUP */}
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
              By signing up, you agree to Icons’
              <a href="/terms" className="text-yellow-500 ml-1 hover:underline">
                Terms of Service
              </a>{" "}
              and
              <a href="/privacy" className="text-yellow-500 ml-1 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => { setShowResetModal(false); setStep(1); }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Enter your username to receive an OTP.
                </p>

                <input
                  type="text"
                  placeholder="Username"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl mb-4 focus:ring-2 focus:ring-yellow-400"
                />

                <motion.button
                  onClick={requestResetOtp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-yellow-500 py-3 rounded-xl font-semibold shadow-md"
                >
                  {resetLoading ? "Sending..." : "Send OTP"}
                </motion.button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold text-center mb-4">
                  {otpVerified ? "Set New Password" : "Verify OTP"}
                </h2>

                {/* OTP */}
                {!otpVerified && (
                  <>
                    <div className="grid grid-cols-6 gap-2 justify-center mb-4">
                      {Array(6)
                        .fill("")
                        .map((_, i) => (
                          <input
                            key={i}
                            maxLength={1}
                            value={otp[i] || ""}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/, "");
                              if (!v) return;
                              let arr = otp.split("");
                              arr[i] = v;
                              setOtp(arr.join(""));
                              const n = document.getElementById(`otp-${i + 1}`);
                              if (n) n.focus();
                            }}
                            id={`otp-${i}`}
                            className="w-10 h-12 sm:w-12 sm:h-12 text-center border rounded-xl focus:ring-2 focus:ring-yellow-400"
                          />
                        ))}
                    </div>

                    <motion.button
                      onClick={verifyOtp}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-yellow-500 py-3 rounded-xl font-semibold shadow-md"
                    >
                      {resetLoading ? "Verifying..." : "Verify OTP"}
                    </motion.button>
                  </>
                )}

                {/* NEW PASSWORD */}
                {otpVerified && (
                  <>
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-4 py-2 border rounded-xl mb-4 focus:ring-2 focus:ring-yellow-400"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <motion.button
                      onClick={submitNewPassword}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-yellow-500 py-3 rounded-xl font-semibold shadow-md"
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
  );
}

export default Login;
