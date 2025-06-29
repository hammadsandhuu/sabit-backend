const nodemailer = require("nodemailer");
const { getCustomerEmailTemplate } = require("../templates/customer-email");
const { getAdminEmailTemplate } = require("../templates/admin-email");

// ✅ Business Email Configuration
// Check if using Google Workspace or regular hosting
const isGoogleWorkspace =
  process.env.GMAIL_USER &&
  process.env.GMAIL_USER.includes("@") &&
  !process.env.GMAIL_USER.includes("@gmail.com");

let transporter;

if (isGoogleWorkspace) {
  // ✅ Google Workspace Configuration (for @justsabit.com with Google Workspace)
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER, // info@justsabit.com
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });
} else {
  // ✅ Regular hosting SMTP Configuration
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.justsabit.com", // Your domain's mail server
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || false,
    auth: {
      user: process.env.SMTP_USER || process.env.GMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 60000,
  });
}

// ✅ Helper to create Google Calendar Add Link
function getGoogleCalendarLink(event) {
  const title = encodeURIComponent(event.summary);
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.hangoutLink || "");
  const start = event.start.dateTime.replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = event.end.dateTime.replace(/[-:]/g, "").split(".")[0] + "Z";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

// ✅ Main SMTP Email Function
async function sendEmails(formData, meetEvent) {
  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");

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
      from: `"SABIT Freight Advisory Team" <${process.env.GMAIL_USER}>`,
      to: formData.userEmail,
      subject:
        "You're Confirmed — SABIT Freight Strategy Call | Google Meet Link Inside",
      html: getCustomerEmailTemplate(
        formData,
        meetEvent,
        meetingDate,
        meetLink,
        calendarLink
      ),
      text: getPlainTextVersion(
        formData,
        meetEvent,
        meetingDate,
        meetLink,
        calendarLink
      ),
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "Normal",
        "X-Mailer": "SABIT Freight System v1.0",
        "Return-Path": process.env.GMAIL_USER,
        "Reply-To": process.env.GMAIL_USER,
      },
    };

    const adminMailOptions = {
      from: `"SABIT Shipping System" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Booking: ${formData.userName}`,
      html: getAdminEmailTemplate(
        formData,
        meetEvent,
        meetingDate,
        meetLink,
        calendarLink
      ),
      headers: {
        "X-Priority": "2",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    };

    console.log(`Sending customer email to: ${formData.userEmail}`);
    const customerResult = await transporter.sendMail(customerMailOptions);
    console.log("✅ Customer email sent successfully");

    console.log(`Sending admin email to: ${process.env.ADMIN_EMAIL}`);
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log("✅ Admin email sent successfully");

    return {
      success: true,
      method: "SMTP",
      customerEmailId: customerResult.messageId,
      adminEmailId: adminResult.messageId,
      message: "Emails sent successfully via SMTP",
    };
  } catch (error) {
    console.error("SMTP Email sending failed:", error);

    // Detailed error reporting
    if (error.code === "EAUTH") {
      throw new Error(
        "Email authentication failed. Please check your email credentials."
      );
    } else if (error.code === "ECONNECTION") {
      throw new Error(
        "Cannot connect to email server. Please check your network connection."
      );
    } else if (error.responseCode === 550) {
      throw new Error(
        "Email rejected by server. Your domain might be blacklisted."
      );
    } else {
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }
}

// ✅ Plain text version
function getPlainTextVersion(
  formData,
  meetEvent,
  meetingDate,
  meetLink,
  calendarLink
) {
  return `
Dear ${formData.userName},

Your freight consultation meeting has been successfully confirmed!

MEETING DETAILS:
================
Date & Time: ${meetingDate}
Service Type: ${formData.serviceType || "General Consultation"}
Cargo Details: ${formData.cargoDetails || "Not specified"}

MEETING LINKS:
==============
Join Google Meet: ${meetLink}
Add to Calendar: ${calendarLink}

BEFORE THE MEETING:
==================
- Test your internet connection and audio/video
- Prepare any cargo-related documents
- Have your questions ready about freight services
- Join the meeting 2-3 minutes early

NEED HELP?
==========
If you need to reschedule or have questions, contact us:
Email: info@justsabit.com
Phone: +92-XXX-XXXXXXX

Thank you for choosing SABIT Freight Advisory Team!

Best regards,
SABIT Freight Advisory Team
  `;
}

// ✅ Test Functions
async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection is working!");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    return false;
  }
}

async function sendTestEmail(testEmail = "test@example.com") {
  const testMailOptions = {
    from: `"SABIT Test" <${process.env.GMAIL_USER}>`,
    to: testEmail,
    subject: "Test Email from SABIT Freight System",
    html: `<h2>Test Email</h2><p>SMTP is working correctly!</p>`,
    text: "Test Email - SMTP is working correctly!",
  };

  try {
    const result = await transporter.sendMail(testMailOptions);
    console.log("✅ Test email sent via SMTP");
    return { success: true, method: "SMTP", messageId: result.messageId };
  } catch (error) {
    console.error("❌ SMTP test failed:", error.message);
    throw error;
  }
}

module.exports = {
  sendEmails,
  testEmailConnection,
  sendTestEmail,
};
