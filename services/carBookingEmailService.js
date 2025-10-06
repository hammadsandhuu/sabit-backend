// // services/carBookingEmailService.js

// const axios = require("axios");
// const {
//   getCarBookingCustomerTemplate,
//   getCarBookingAdminTemplate,
// } = require("../templates/carBooking-email-template");

// const ZEPTO_API_URL = "https://api.zeptomail.sa/v1.1/email";
// const ZEPTO_API_TOKEN = process.env.ZEPTO_API_TOKEN;
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
// async function sendZeptoEmail({ to, subject, htmlbody }) {
//   const from = {
//     address: "noreply@justsabit.com",
//     name: "SABIT Car Booking",
//   };

//   const payload = {
//     from,
//     to: [
//       {
//         email_address: {
//           address: to.email || to.address,
//           name: to.name || "",
//         },
//       },
//     ],
//     subject,
//     htmlbody,
//   };

//   const headers = {
//     Authorization: ZEPTO_API_TOKEN,
//     "Content-Type": "application/json",
//   };
//   if (!payload.to[0].email_address.address)
//     throw new Error("Missing recipient email address");
//   if (!subject) throw new Error("Missing email subject");

//   return axios.post(ZEPTO_API_URL, payload, { headers });
// }
// async function sendCarBookingEmails(formData, meetEvent = null) {
//   try {
//     const meetLink =
//       meetEvent?.hangoutLink || "Meeting link will be shared soon.";
//     const meetingDateUser = meetEvent
//       ? formatMeetingDate(
//           meetEvent.start.dateTime,
//           formData.userTimeZone || "Asia/Riyadh"
//         )
//       : formatMeetingDate(
//           formData.selectedDate,
//           formData.userTimeZone || "Asia/Riyadh"
//         );

//     const meetingDateAdmin = meetEvent
//       ? formatMeetingDate(meetEvent.start.dateTime, "Asia/Riyadh")
//       : meetingDateUser;
//     const customerHtml = getCarBookingCustomerTemplate(
//       formData,
//       meetingDateUser,
//       meetLink
//     );

//     const adminHtml = getCarBookingAdminTemplate(
//       formData,
//       meetingDateAdmin,
//       meetLink
//     );
//     await sendZeptoEmail({
//       to: { email: formData.email, name: formData.name },
//       subject:
//         formData.intent === "book-now"
//           ? "Your Car Booking is Confirmed | SABIT"
//           : "SABIT Car Booking Request Received",
//       htmlbody: customerHtml,
//     });
//     await sendZeptoEmail({
//       to: { email: process.env.ADMIN_EMAIL, name: "SABIT Admin" },
//       subject: `New Car Booking from ${formData.name}`,
//       htmlbody: adminHtml,
//     });

//     console.log("Car booking emails sent successfully!");
//   } catch (error) {
//     console.error(
//       "Error sending car booking emails:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to send car booking emails");
//   }
// }

// module.exports = { sendCarBookingEmails };

const nodemailer = require("nodemailer");
const {
  getCarBookingCustomerTemplate,
  getCarBookingAdminTemplate,
} = require("../templates/carBooking-email-template");

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

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // App password
  },
});

async function sendEmail({ to, subject, html }) {
  if (!to) throw new Error("Missing recipient email");
  if (!subject) throw new Error("Missing email subject");

  const mailOptions = {
    from: `"SABIT Car Booking" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
}

async function sendCarBookingEmails(formData, meetEvent = null) {
  try {
    const meetLink =
      meetEvent?.hangoutLink || "Meeting link will be shared soon.";

    const meetingDateUser = meetEvent
      ? formatMeetingDate(
          meetEvent.start.dateTime,
          formData.userTimeZone || "Asia/Riyadh"
        )
      : formatMeetingDate(
          formData.selectedDate,
          formData.userTimeZone || "Asia/Riyadh"
        );

    const meetingDateAdmin = meetEvent
      ? formatMeetingDate(meetEvent.start.dateTime, "Asia/Riyadh")
      : meetingDateUser;

    const customerHtml = getCarBookingCustomerTemplate(
      formData,
      meetingDateUser,
      meetLink
    );

    const adminHtml = getCarBookingAdminTemplate(
      formData,
      meetingDateAdmin,
      meetLink
    );

    // Send emails
    await sendEmail({
      to: formData.email,
      subject:
        formData.intent === "book-now"
          ? "Your Car Booking is Confirmed | SABIT"
          : "SABIT Car Booking Request Received",
      html: customerHtml,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Car Booking from ${formData.name}`,
      html: adminHtml,
    });

    console.log("Car booking emails sent successfully!");
  } catch (error) {
    console.error("Error sending car booking emails:", error.message);
    throw new Error("Failed to send car booking emails");
  }
}

module.exports = { sendCarBookingEmails };
