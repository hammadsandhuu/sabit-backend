// models/submissionModel.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    selectedDate: { type: Date, required: true }, // Meeting UTC date
    selectedTime: { type: String, required: true }, // Original time input
    selectedTimeLocal: { type: String }, // Localized user time (e.g., 9:00 AM)
    userTimeZone: { type: String }, // User timezone (e.g., Asia/Karachi)

    meetingLink: { type: String }, // Google Meet link
    calendarLink: { type: String }, // Google Calendar link
    eventId: { type: String }, // Google Calendar event ID

    shippingType: { type: String },
    freightType: { type: String },
    serviceType: { type: String },
    handlingType: { type: String },
    packagingHelp: { type: String },

    locationInput: { type: String }, // Pickup
    deliveryAddress: { type: String }, // Delivery

    containerType: { type: String },
    readyTime: { type: String },

    portOfLoading: { type: String },
    portOfDischarge: { type: String },

    cbm: { type: String },
    weight: { type: String },
    weightUnit: { type: String },

    volume: { type: String },

    dimensionLength: { type: String },
    dimensionWidth: { type: String },
    dimensionHeight: { type: String },
    dimensionUnit: { type: String },

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
