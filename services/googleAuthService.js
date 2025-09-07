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
    Object.assign(tokenDoc, tokens);
    await tokenDoc.save();
  } else {
    await Token.create(tokens);
  }
  console.log("✅ Tokens saved in DB");
};

const getAuthUrl = () => {
  const oauth2Client = createOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // ensures refresh token is returned
    scope: scopes,
  });
};

const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  await saveTokens(tokens);
  return tokens;
};

const getAuthorizedClient = async () => {
  const oauth2Client = createOAuthClient();
  const storedTokens = await loadTokens();

  if (storedTokens) {
    oauth2Client.setCredentials(storedTokens);
  }

  oauth2Client.on("tokens", async (tokens) => {
    console.log("♻️ Token event:", tokens);
    await saveTokens({ ...storedTokens, ...tokens });
  });

  return oauth2Client;
};

module.exports = { getAuthUrl, getTokensFromCode, getAuthorizedClient };
