const { sendEmails } = require("../services/emailService");
const Submission = require("../models/submissionModel");
const {
  checkAuthStatus,
  createGoogleMeet,
} = require("../services/calendarService");

exports.submitForm = async (req, res) => {
  const formData = req.body;

  try {
    const selectedDate = new Date(formData.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "You cannot select a past date.",
      });
    }

    const authStatus = await checkAuthStatus();
    if (!authStatus.valid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please reconnect Google account.",
        requiresReauth: true,
      });
    }

    const meetEvent = await createGoogleMeet(formData);
    await sendEmails(formData, meetEvent);

    const submission = new Submission({
      ...formData,
      meetingLink: meetEvent.hangoutLink,
      eventId: meetEvent.id,
    });
    await submission.save();

    res.json({
      success: true,
      message: "Scheduled successfully",
      meetLink: meetEvent.hangoutLink,
    });
  } catch (error) {
    console.error("SubmitForm Error:", error);

    if (error.message.includes("re-authenticate") || error.code === 401) {
      return res.status(401).json({
        success: false,
        message: "Google authentication expired. Please reconnect.",
        requiresReauth: true,
      });
    }

    res.status(500).json({
      success: false,
      message: "Scheduling failed",
      error: error.message,
    });
  }
};

exports.getAuthStatus = async (req, res) => {
  try {
    const status = await checkAuthStatus();
    res.json({
      success: status.valid,
      valid: status.valid,
      message: status.message,
    });
  } catch (error) {
    res.json({
      success: false,
      valid: false,
      message: "Unable to check authentication status",
    });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve submissions",
      error: error.message,
    });
  }
};

exports.getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve submission",
      error: error.message,
    });
  }
};

exports.getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }
    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.999Z");

    const bookings = await Submission.find({
      selectedDate: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error getting bookings by date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};
