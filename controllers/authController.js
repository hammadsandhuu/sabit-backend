// controllers/authController.js
const {
  getAuthUrl,
  getTokensFromCode,
} = require("../services/zohoAuthService"); // ✅ Use Zoho service

exports.startAuth = (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
};

exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Missing authorization code");
    }

    const tokens = await getTokensFromCode(code);

    res.send(`
      <h2>✅ Zoho Authentication Successful</h2>
      <p><strong>Refresh Token:</strong></p>
      <code>${tokens.refresh_token}</code>
      <p>Copy this refresh token into your <code>.env</code> as <strong>ZOHO_REFRESH_TOKEN</strong>.</p>
      <p><strong>Access Token:</strong></p>
      <code>${tokens.access_token}</code>
    `);
  } catch (error) {
    console.error(
      "OAuth Callback Error:",
      error.response?.data || error.message
    );
    res.status(500).send("Authentication failed. Check server logs.");
  }
};
