const { google } = require("googleapis");
const Token = require("../models/tokenModel");

// Create OAuth client
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

// Save / update tokens in DB
const saveTokens = async (tokens) => {
  const tokenDoc = await Token.findOne();
  if (tokenDoc) {
    Object.assign(tokenDoc, tokens);
    await tokenDoc.save();
  } else {
    await Token.create(tokens);
  }
  console.log("Tokens saved in DB");
};

const getAuthUrl = () => {
  const oauth2Client = createOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline", // required for refresh token
    scope: scopes,
    prompt: "consent", // ensures refresh token first time
  });
};

const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  // Save to DB
  await saveTokens(tokens);

  return tokens;
};

// Get authorized OAuth client (auto refresh)
const getAuthorizedClient = async () => {
  const oauth2Client = createOAuthClient();
  const storedTokens = await loadTokens();

  if (storedTokens) {
    oauth2Client.setCredentials(storedTokens);
  }

  // Handle automatic refresh + rotation
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) {
      console.log("Refresh token rotated");
    }
    await saveTokens({ ...storedTokens, ...tokens });
  });

  return oauth2Client;
};

module.exports = {
  getAuthUrl,
  getTokensFromCode,
  getAuthorizedClient,
};
