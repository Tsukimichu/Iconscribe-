const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Send OTP to email
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOTP();

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>🔐 Your OTP Code</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
    </div>
  `;

  const success = await sendEmail(email, "Your OTP Code", html);

  if (success) {
    res.json({ success: true, otp }); 
  } else {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

module.exports = router;
