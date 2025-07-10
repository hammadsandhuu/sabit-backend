const {
  getAuthUrl,
  getTokensFromCode,
} = require("../services/googleAuthService");

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
      <h2>✅ Google Authentication Successful</h2>
      <p><strong>Refresh Token:</strong></p>
      <code>${tokens.refresh_token}</code>
      <p>Copy this refresh token into your <code>.env</code> as <strong>GOOGLE_REFRESH_TOKEN</strong>.</p>
    `);
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).send("Authentication failed. Check server logs.");
  }
};
