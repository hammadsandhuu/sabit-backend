require("dotenv").config();
const nodemailer = require("nodemailer");

(async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP verified! Credentials are correct.");
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
  }
})();
