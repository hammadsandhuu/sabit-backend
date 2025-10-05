// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  getAuthUrl,
  getTokensFromCode,
} = require("../services/googleAuthService");

router.get("/auth-url", (req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

router.post("/auth-callback", async (req, res) => {
  try {
    const { code } = req.body;
    await getTokensFromCode(code);
    res.json({ success: true, message: "Authenticated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
