// services/googleAuthService.js
const { google } = require("googleapis");
const Token = require("../models/tokenModel");

// Create OAuth2 client
const createOAuthClient = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

// Load tokens from DB
const loadTokens = async () => {
  const tokenDoc = await Token.findOne().sort({ createdAt: -1 });
  return tokenDoc ? tokenDoc.toObject() : null;
};

// Save tokens safely (keep old refresh_token if missing)
const saveTokens = async (tokens) => {
  let tokenDoc = await Token.findOne();

  if (tokenDoc) {
    // Keep the old refresh_token if new one is missing
    if (!tokens.refresh_token) {
      tokens.refresh_token = tokenDoc.refresh_token;
    }
    Object.assign(tokenDoc, tokens);
    await tokenDoc.save();
  } else {
    await Token.create(tokens);
  }

  console.log("✅ Tokens saved in DB safely");
};

// Generate Google Auth URL (one-time use only)
const getAuthUrl = () => {
  const oauth2Client = createOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline", // ensures refresh_token is returned
    prompt: "consent", // only for the very first time
    scope: scopes,
  });
};

// Exchange code for tokens (first time only)
const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  await saveTokens(tokens);
  return tokens;
};

// Get authorized client (auto-refresh enabled)
const getAuthorizedClient = async () => {
  const oauth2Client = createOAuthClient();
  const storedTokens = await loadTokens();

  if (!storedTokens || !storedTokens.refresh_token) {
    throw new Error(
      "❌ No refresh token found. Please authenticate with Google first."
    );
  }

  oauth2Client.setCredentials(storedTokens);

  // Auto-save new tokens if refreshed
  oauth2Client.on("tokens", async (tokens) => {
    console.log("♻️ Token refreshed:", tokens);
    await saveTokens({ ...storedTokens, ...tokens });
  });

  try {
    // Force refresh to validate token
    await oauth2Client.getAccessToken();
  } catch (err) {
    console.error("Error refreshing access token:", err.message);
    throw new Error("Google authentication failed, please re-authenticate.");
  }

  return oauth2Client;
};

module.exports = { getAuthUrl, getTokensFromCode, getAuthorizedClient };
