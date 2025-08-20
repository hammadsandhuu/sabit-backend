// scripts/cleanupTokens.js
const mongoose = require("mongoose");
const Token = require("../models/tokenModel");

require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Token.deleteMany({});
    console.log(`Tokens cleanup complete. Deleted: ${result.deletedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
})();
