// services/googleAuthService.js
const { google } = require("googleapis");
const Token = require("../models/tokenModel");

const createOAuthClient = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
const loadTokens = async () => {
  const tokenDoc = await Token.findOne().sort({ createdAt: -1 });
  return tokenDoc ? tokenDoc.toObject() : null;
};

const saveTokens = async (tokens) => {
  let tokenDoc = await Token.findOne();

  if (tokenDoc) {
    if (!tokens.refresh_token) {
      tokens.refresh_token = tokenDoc.refresh_token;
    }
    Object.assign(tokenDoc, tokens);
    await tokenDoc.save();
  } else {
    await Token.create(tokens);
  }

  console.log("Tokens saved in DB safely");
};

// Get Google Auth URL
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

//Auto-refresh enabled client
const getAuthorizedClient = async () => {
  const oauth2Client = createOAuthClient();
  const storedTokens = await loadTokens();

  if (!storedTokens) {
    throw new Error("No tokens found. Please authenticate with Google first.");
  }

  oauth2Client.setCredentials(storedTokens);
  oauth2Client.on("tokens", async (tokens) => {
    console.log("Token refreshed:", tokens);
    await saveTokens({ ...storedTokens, ...tokens });
  });
  try {
    await oauth2Client.getAccessToken();
  } catch (err) {
    console.error("Error refreshing access token:", err);
    throw new Error("Google authentication failed, please re-authenticate.");
  }

  return oauth2Client;
};

module.exports = { getAuthUrl, getTokensFromCode, getAuthorizedClient };
