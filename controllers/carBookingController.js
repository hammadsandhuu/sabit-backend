// controllers/carBookingController.js
const CarBookingModel = require("../models/carBookingModel");
const {
  createGoogleMeet,
  checkAuthStatus,
} = require("../services/calendarService");
const { sendCarBookingEmails } = require("../services/carBookingEmailService");

exports.CarBooking = async (req, res) => {
  const formData = req.body;
  const { intent } = formData;

  try {
    const record = new CarBookingModel(formData);

    // Case 1: User chose "wait-24-hours"
    if (intent === "wait-24-hours") {
      await sendCarBookingEmails({
        ...formData,
        intent,
      });
      await record.save();

      return res.status(200).json({
        success: true,
        message:
          "Thank you! Your request has been received. The SABIT team will contact you within 24 hours.",
      });
    }

    // Case 2: User chose "book-now"
    if (intent === "book-now") {
      const authStatus = await checkAuthStatus();
      if (!authStatus.valid) {
        return res.status(401).json({
          success: false,
          message: "Google authentication expired. Please reconnect.",
          requiresReauth: true,
        });
      }
      const meetEvent = await createGoogleMeet({
        userName: formData.name,
        userEmail: formData.email,
        userTimeZone: formData.userTimeZone || "Asia/Riyadh",
        selectedDate: formData.selectedDate || new Date().toISOString(),
      });
      await sendCarBookingEmails(
        {
          ...formData,
          intent,
          userTimeZone: formData.userTimeZone || "Asia/Riyadh",
        },
        meetEvent
      )
      record.meetingLink = meetEvent.hangoutLink;
      record.eventId = meetEvent.id;
      await record.save();

      return res.status(200).json({
        success: true,
        message:
          "Booking confirmed! A Google Meet invite has been sent to your email. We look forward to speaking with you soon.",
        meetLink: meetEvent.hangoutLink,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid intent. Must be 'wait-24-hours' or 'book-now'.",
    });
  } catch (error) {
    console.error("CarBookingController Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process car booking request",
      error: error.message,
    });
  }
};
