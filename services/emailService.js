// // services/emailService.js

// const axios = require("axios");
// const { getCustomerEmailTemplate } = require("../templates/customer-email");
// const { getAdminEmailTemplate } = require("../templates/admin-email");

// const ZEPTO_API_URL = "https://api.zeptomail.sa/v1.1/email";
// const ZEPTO_API_TOKEN = process.env.ZEPTO_API_TOKEN;

// //  Generate a Google Calendar link for the given event.
// function getGoogleCalendarLink(event) {
//   if (!event?.start?.dateTime || !event?.end?.dateTime) return "";

//   const title = encodeURIComponent(event.summary || "SABIT Freight Call");
//   const details = encodeURIComponent(event.description || "");
//   const location = encodeURIComponent(event.hangoutLink || "");
//   const formatDate = (dateStr) =>
//     dateStr.replace(/[-:]/g, "").split(".")[0] + "Z";

//   return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(
//     event.start.dateTime
//   )}/${formatDate(
//     event.end.dateTime
//   )}&details=${details}&location=${location}&sf=true&output=xml`;
// }

// // Format meeting date/time for user or admin.
// function formatMeetingDate(date, timeZone) {
//   if (!date) return "To be scheduled";

//   return new Date(date).toLocaleString("en-US", {
//     timeZone,
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// // Send an email using ZeptoMail API.
// async function sendZeptoEmail({ to, subject, htmlbody }) {
//   const from = {
//     address: "noreply@justsabit.com",
//     name: "SABIT Freight Strategy Call",
//   };

//   const payload = {
//     from,
//     to: [{ email_address: to }],
//     subject,
//     htmlbody,
//   };

//   const headers = {
//     Authorization: ZEPTO_API_TOKEN,
//     "Content-Type": "application/json",
//   };

//   return axios.post(ZEPTO_API_URL, payload, { headers });
// }

// //Main function to send confirmation and admin notification emails.
// async function sendEmails(formData, meetEvent = null) {
//   try {
//     const meetLink =
//       meetEvent?.hangoutLink || "Meeting link will be shared soon.";
//     const calendarLink = meetEvent ? getGoogleCalendarLink(meetEvent) : "";

//     const meetingDateUser = meetEvent
//       ? formatMeetingDate(
//           meetEvent.start.dateTime,
//           formData.userTimeZone || "UTC"
//         )
//       : formatMeetingDate(
//           formData.selectedDate,
//           formData.userTimeZone || "UTC"
//         );

//     const meetingDateAdmin = meetEvent
//       ? formatMeetingDate(meetEvent.start.dateTime, "Asia/Riyadh")
//       : meetingDateUser;

//     const customerHtml = getCustomerEmailTemplate(
//       formData,
//       meetEvent,
//       meetingDateUser,
//       meetLink,
//       calendarLink
//     );

//     const adminHtml = getAdminEmailTemplate(
//       formData,
//       meetEvent,
//       meetingDateAdmin,
//       meetLink,
//       calendarLink
//     );

//     // Send customer email
//     await sendZeptoEmail({
//       to: { address: formData.userEmail, name: formData.userName },
//       subject:
//         "You're Confirmed — SABIT Freight Strategy Call" +
//         (meetEvent ? " | Google Meet Link Inside" : " (Pending Scheduling)"),
//       htmlbody: customerHtml,
//     });

//     // Send admin email
//     await sendZeptoEmail({
//       to: { address: process.env.ADMIN_EMAIL, name: "SABIT Admin" },
//       subject: `New Booking From ${formData.userName} ${
//         meetEvent ? "" : "(Meet Pending)"
//       }`,
//       htmlbody: adminHtml,
//     });

//     console.log("Emails sent successfully!");
//   } catch (error) {
//     console.error(
//       "Error sending emails:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to send emails");
//   }
// }

// module.exports = { sendEmails };

const nodemailer = require("nodemailer");
const { getCustomerEmailTemplate } = require("../templates/customer-email");
const { getAdminEmailTemplate } = require("../templates/admin-email");

// Generate a Google Calendar link for the given event
function getGoogleCalendarLink(event) {
  if (!event?.start?.dateTime || !event?.end?.dateTime) return "";

  const title = encodeURIComponent(event.summary || "SABIT Freight Call");
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.hangoutLink || "");
  const formatDate = (dateStr) =>
    dateStr.replace(/[-:]/g, "").split(".")[0] + "Z";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(
    event.start.dateTime
  )}/${formatDate(
    event.end.dateTime
  )}&details=${details}&location=${location}&sf=true&output=xml`;
}

// Format meeting date/time
function formatMeetingDate(date, timeZone) {
  if (!date) return "To be scheduled";

  return new Date(date).toLocaleString("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // App password
  },
});

// Send email helper
async function sendEmail({ to, subject, html }) {
  if (!to?.address && !to) throw new Error("Missing recipient email");

  const mailOptions = {
    from: `"SABIT Freight Strategy Call" <${process.env.GMAIL_USER}>`,
    to: to.address || to, // supports {address, name} or string email
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to.address || to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
}

// Main function to send customer & admin emails
async function sendEmails(formData, meetEvent = null) {
  try {
    const meetLink =
      meetEvent?.hangoutLink || "Meeting link will be shared soon.";
    const calendarLink = meetEvent ? getGoogleCalendarLink(meetEvent) : "";

    const meetingDateUser = meetEvent
      ? formatMeetingDate(
          meetEvent.start.dateTime,
          formData.userTimeZone || "UTC"
        )
      : formatMeetingDate(
          formData.selectedDate,
          formData.userTimeZone || "UTC"
        );

    const meetingDateAdmin = meetEvent
      ? formatMeetingDate(meetEvent.start.dateTime, "Asia/Riyadh")
      : meetingDateUser;

    const customerHtml = getCustomerEmailTemplate(
      formData,
      meetEvent,
      meetingDateUser,
      meetLink,
      calendarLink
    );

    const adminHtml = getAdminEmailTemplate(
      formData,
      meetEvent,
      meetingDateAdmin,
      meetLink,
      calendarLink
    );

    // Send customer email
    await sendEmail({
      to: { address: formData.userEmail, name: formData.userName },
      subject:
        "You're Confirmed — SABIT Freight Strategy Call" +
        (meetEvent ? " | Google Meet Link Inside" : " (Pending Scheduling)"),
      html: customerHtml,
    });

    // Send admin email
    await sendEmail({
      to: { address: process.env.ADMIN_EMAIL, name: "SABIT Admin" },
      subject: `New Booking From ${formData.userName}${
        meetEvent ? "" : " (Meet Pending)"
      }`,
      html: adminHtml,
    });

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw new Error("Failed to send emails");
  }
}

module.exports = { sendEmails };
