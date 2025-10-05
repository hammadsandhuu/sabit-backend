// services/emailService.js
const axios = require("axios");
const { getCustomerEmailTemplate } = require("../templates/customer-email");
const { getAdminEmailTemplate } = require("../templates/admin-email");

const ZEPTO_API_URL = "https://api.zeptomail.sa/v1.1/email";
const ZEPTO_API_TOKEN = process.env.ZEPTO_API_TOKEN;

function getGoogleCalendarLink(event) {
  if (!event || !event.start || !event.end) return "";

  const title = encodeURIComponent(event.summary || "SABIT Freight Call");
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.hangoutLink || "");
  const start = event.start.dateTime.replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = event.end.dateTime.replace(/[-:]/g, "").split(".")[0] + "Z";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

async function sendEmails(formData, meetEvent = null) {
  const meetLink =
    meetEvent?.hangoutLink || "Meeting link will be shared soon.";
  const calendarLink = meetEvent ? getGoogleCalendarLink(meetEvent) : "";

  const meetingDateUser = meetEvent
    ? new Date(meetEvent.start.dateTime).toLocaleString("en-US", {
        timeZone: formData.userTimeZone || "UTC",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : formData.selectedDate
    ? new Date(formData.selectedDate).toLocaleString("en-US", {
        timeZone: formData.userTimeZone || "UTC",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "To be scheduled";

  const meetingDateAdmin = meetEvent
    ? new Date(meetEvent.start.dateTime).toLocaleString("en-US", {
        timeZone: "Asia/Riyadh",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : meetingDateUser;

  const from = {
    address: "noreply@justsabit.com",
    name: "SABIT Freight Strategy Call",
  };

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

  try {
    await axios.post(
      ZEPTO_API_URL,
      {
        from,
        to: [
          {
            email_address: {
              address: formData.userEmail,
              name: formData.userName,
            },
          },
        ],
        subject:
          "You're Confirmed — SABIT Freight Strategy Call" +
          (meetEvent ? " | Google Meet Link Inside" : " (Pending Scheduling)"),
        htmlbody: customerHtml,
      },
      {
        headers: {
          Authorization: ZEPTO_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    await axios.post(
      ZEPTO_API_URL,
      {
        from,
        to: [
          {
            email_address: {
              address: process.env.ADMIN_EMAIL,
              name: "SABIT Admin",
            },
          },
        ],
        subject: `New Booking: ${formData.userName} ${
          meetEvent ? "" : "(Meet Pending)"
        }`,
        htmlbody: adminHtml,
      },
      {
        headers: {
          Authorization: ZEPTO_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw error;
  }
}

module.exports = { sendEmails };
