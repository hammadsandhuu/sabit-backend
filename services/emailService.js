const axios = require("axios");
const { getCustomerEmailTemplate } = require("../templates/customer-email");
const { getAdminEmailTemplate } = require("../templates/admin-email");

const ZEPTO_API_URL = "https://api.zeptomail.sa/v1.1/email";
const ZEPTO_API_TOKEN = process.env.ZEPTO_API_TOKEN;

function getGoogleCalendarLink(event) {
  const title = encodeURIComponent(event.summary);
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.hangoutLink || "");
  const start = event.start.dateTime.replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = event.end.dateTime.replace(/[-:]/g, "").split(".")[0] + "Z";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

async function sendEmails(formData, meetEvent) {
  const meetLink = meetEvent.hangoutLink;
  const calendarLink = getGoogleCalendarLink(meetEvent);
  const meetingDate = new Date(meetEvent.start.dateTime).toLocaleString(
    "en-US",
    {
      timeZone: "Asia/Karachi",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  const from = {
    address: "noreply@justsabit.com",
    name: "SABIT Freight Strategy Call",
  };
  const customerHtml = getCustomerEmailTemplate(
    formData,
    meetEvent,
    meetingDate,
    meetLink,
    calendarLink
  );
  const adminHtml = getAdminEmailTemplate(
    formData,
    meetEvent,
    meetingDate,
    meetLink,
    calendarLink
  );

  // ✅ Send Customer Email
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
        "You're Confirmed — SABIT Freight Strategy Call | Google Meet Link Inside",
      htmlbody: customerHtml,
    },
    {
      headers: {
        Authorization: ZEPTO_API_TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  // ✅ Send Admin Email
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
      subject: `New Booking: ${formData.userName}`,
      htmlbody: adminHtml,
    },
    {
      headers: {
        Authorization: ZEPTO_API_TOKEN,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = { sendEmails };
