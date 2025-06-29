const nodemailer = require("nodemailer");
const { getCustomerEmailTemplate } = require("../templates/customer-email");
const { getAdminEmailTemplate } = require("../templates/admin-email");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Helper to create Google Calendar Add Link
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

  const customerMailOptions = {
    from: { name: "Premium Shipping", address: process.env.GMAIL_USER },
    to: formData.userEmail,
    subject: "✅ Your Consultation is Confirmed",
    html: getCustomerEmailTemplate(
      formData,
      meetEvent,
      meetingDate,
      meetLink,
      calendarLink
    ),
  };

  const adminMailOptions = {
    from: { name: "Shipping System", address: process.env.GMAIL_USER },
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 New Booking: ${formData.userName}`,
    html: getAdminEmailTemplate(
      formData,
      meetEvent,
      meetingDate,
      meetLink,
      calendarLink
    ),
  };

  await transporter.sendMail(customerMailOptions);
  await transporter.sendMail(adminMailOptions);
}

module.exports = { sendEmails };
