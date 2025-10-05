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
    tokenDoc = await Token.create(tokens);
  }

  console.log("Tokens saved in DB safely");
  return tokenDoc.toObject();
};

// Generate Google Auth URL
const getAuthUrl = () => {
  const oauth2Client = createOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

// Exchange code for tokens
const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  await saveTokens(tokens);
  return tokens;
};

// Check token status
const checkTokenStatus = async () => {
  try {
    const oauth2Client = createOAuthClient();
    const storedTokens = await loadTokens();

    if (!storedTokens || !storedTokens.refresh_token) {
      return { valid: false, message: "No refresh token found" };
    }

    oauth2Client.setCredentials(storedTokens);

    // Test token with a simple API call
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    await calendar.calendarList.list({ maxResults: 1 });

    return { valid: true, message: "Token is valid" };
  } catch (error) {
    return {
      valid: false,
      message: "Token is invalid or expired",
      error: error.message,
    };
  }
};

const getAuthorizedClient = async () => {
  const oauth2Client = createOAuthClient();
  let storedTokens = await loadTokens();

  if (!storedTokens || !storedTokens.refresh_token) {
    throw new Error(
      "No refresh token found. Please authenticate with Google first."
    );
  }
  oauth2Client.setCredentials(storedTokens);
  oauth2Client.on("tokens", async (newTokens) => {
    console.log("Token refreshed automatically");
    const currentTokens = await loadTokens();
    const updatedTokens = {
      ...currentTokens,
      ...newTokens,
      refresh_token: newTokens.refresh_token || currentTokens.refresh_token,
    };
    await saveTokens(updatedTokens);
  });

  try {
    // Validate token with API call
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    await calendar.calendarList.list({ maxResults: 1 });
    console.log("Token is valid");
    return oauth2Client;
  } catch (error) {
    console.error("Token validation failed:", error.message);

    if (error.code === 401 || error.code === 403) {
      console.log("Attempting to refresh token...");
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        await saveTokens(credentials);
        console.log("Token refreshed successfully");
        return oauth2Client;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        throw new Error(
          "Google authentication expired. Please re-authenticate."
        );
      }
    }

    throw error;
  }
};

module.exports = {
  getAuthUrl,
  getTokensFromCode,
  getAuthorizedClient,
  checkTokenStatus,
  loadTokens,
};
