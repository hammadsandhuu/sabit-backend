const { createGoogleMeet } = require("../services/calendarService");
const { sendEmails } = require("../services/emailService");
const Submission = require("../models/submissionModel");

exports.submitForm = async (req, res) => {
  const formData = req.body;

  try {
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
    });
  } catch (error) {
    console.error("SubmitForm Error:", error);
    res.status(500).json({
      success: false,
      message: "Scheduling failed",
      error: error.message,
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
