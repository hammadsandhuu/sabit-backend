// services/zohoAuthService.js
const axios = require("axios");

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;
const ZOHO_REGION = process.env.ZOHO_REGION || "com"; // eg: "sa", "eu"

const getAuthUrl = () => {
  const base = `https://accounts.zoho.${ZOHO_REGION}/oauth/v2/auth`;
  const scope = "ZohoMail.accounts.READ,ZohoMail.messages.CREATE";

  const url = `${base}?scope=${scope}&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(
    ZOHO_REDIRECT_URI
  )}`;
  return url;
};

const getTokensFromCode = async (code) => {
  const url = `https://accounts.zoho.${ZOHO_REGION}/oauth/v2/token`;

  const response = await axios.post(url, null, {
    params: {
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      redirect_uri: ZOHO_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    },
  });

  return response.data;
};

module.exports = {
  getAuthUrl,
  getTokensFromCode,
};
