const { createGoogleMeet } = require("../services/calendarService");
const { sendEmails } = require("../services/emailService");
const {
  addSubmission,
  getAllSubmissions,
  getSubmissionById,
} = require("../models/submissionModel");
const { validateForm } = require("../utils/validators");

exports.submitForm = async (req, res) => {
  const formData = req.body;
  const validationError = validateForm(formData);
  if (validationError)
    return res.status(400).json({ success: false, message: validationError });

  try {
    const meetEvent = await createGoogleMeet(formData);
    await sendEmails(formData, meetEvent);

    const submission = addSubmission({
      ...formData,
      meetingLink: meetEvent.hangoutLink,
      eventId: meetEvent.id,
    });

    res.json({
      success: true,
      message: "Scheduled successfully",
      data: submission,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Scheduling failed",
        error: error.message,
      });
  }
};

exports.getSubmissions = (req, res) => {
  res.json({ success: true, data: getAllSubmissions() });
};

exports.getSubmission = (req, res) => {
  const submission = getSubmissionById(req.params.id);
  if (!submission)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: submission });
};
