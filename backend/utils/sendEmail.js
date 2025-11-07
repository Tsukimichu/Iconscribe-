const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./database.env" }); 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Capstone System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(" Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error(" Email sending failed:", error);
    return false;
  }
}

module.exports = sendEmail;
