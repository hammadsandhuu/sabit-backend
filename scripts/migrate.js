// migrate.js
require("dotenv").config();
const mongoose = require("mongoose");
const Submission = require("../models/submissionModel");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourDB";

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Migration: ensure new fields exist with default values
    const result = await Submission.updateMany(
      {}, // all documents
      {
        $set: {
          userTimeZone: "UTC", // default if missing
          selectedTimeLocal: null, // can be set later when needed
        },
      },
      { strict: false } // allow updating even if fields not in old schema
    );

    console.log(
      `🔄 Migration complete. ${result.modifiedCount} documents updated.`
    );

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
}

migrate();
