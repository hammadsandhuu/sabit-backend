// models/carTransportBookingModel.js
const mongoose = require("mongoose");

const carBookingSchema = new mongoose.Schema(
  {
    numberOfCars: { type: String, required: true },
    carType: { type: String, required: true },
    pickupState: { type: String, required: true },
    dropOffCity: { type: String, default: "Riyadh" },
    mode: { type: String, required: true },
    timeline: { type: String },
    whatsapp: { type: String },
    email: { type: String, required: true },
    name: { type: String },
    selectedDate: { type: Date },
    selectedTime: { type: String },
    selectedTimeLocal: { type: String },
    userTimeZone: { type: String, default: "Asia/Riyadh" },
    intent: {
      type: String,
      enum: ["wait-24-hours", "book-now"],
      required: true,
    },
    meetingLink: { type: String },
    eventId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarBooking", carBookingSchema);
