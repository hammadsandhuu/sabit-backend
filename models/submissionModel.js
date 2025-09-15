// models/submissionModel.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    selectedDate: { type: Date, required: true },
    selectedTime: { type: String, required: true },
    selectedTimeLocal: { type: String },
    userTimeZone: { type: String },

    meetingLink: { type: String },
    calendarLink: { type: String },
    eventId: { type: String },

    shippingType: { type: String },
    freightType: { type: String },
    serviceType: { type: String },
    handlingType: { type: String },
    packagingHelp: { type: String },

    locationInput: { type: String },
    deliveryAddress: { type: String },

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
