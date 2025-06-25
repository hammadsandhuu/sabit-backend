const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Google Calendar and Meet Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Email Setup (using Gmail) - FIXED CONFIGURATION
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

// Test email configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

// Helper function to create Google Meet
async function createGoogleMeet(formData) {
  try {
    const meetingDateTime = new Date(
      `${formData.selectedDate}T${formData.selectedTime}`
    );
    const endDateTime = new Date(meetingDateTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

    const event = {
      summary: `Shipping Consultation - ${formData.userName}`,
      description: `
        Shipping Consultation Meeting
        
        Customer Details:
        - Name: ${formData.userName}
        - Email: ${formData.userEmail}
        
        Shipping Details:
        - Shipping Type: ${formData.shippingType}
        - Freight Type: ${formData.freightType}
        - Service Type: ${formData.serviceType}
        - Handling Type: ${formData.handlingType}
        - Location: ${formData.locationInput}
        - Delivery Address: ${formData.deliveryAddress}
        - Container Type: ${formData.containerType}
        
        Package Details:
        - Dimensions: ${formData.dimensionLength} x ${formData.dimensionWidth} x ${formData.dimensionHeight} ${formData.dimensionUnit}
        - Weight: ${formData.weight} ${formData.weightUnit}
        - CBM: ${formData.cbm}
        - Volume: ${formData.volume}
        
        Ready Time: ${formData.readyTime}
        Packaging Help: ${formData.packagingHelp}
      `,
      start: {
        dateTime: meetingDateTime.toISOString(),
        timeZone: "Asia/Karachi",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Karachi",
      },
      attendees: [
        { email: formData.userEmail },
        { email: process.env.ADMIN_EMAIL }, // Admin email
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 10 }, // 10 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating Google Meet:", error);
    throw error;
  }
}

// BEAUTIFUL EMAIL TEMPLATES WITH BLACK, BONE, AND GOLD COLORS
function getCustomerEmailTemplate(formData, meetEvent, meetingDate, meetLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipping Consultation Scheduled</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #1a1a1a; color: #f5f5dc;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);">
            
            <!-- Header Section -->
            <div style="background: linear-gradient(45deg, #d4af37, #ffd700, #b8860b); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <div style="background-color: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; backdrop-filter: blur(10px);">
                    <h1 style="margin: 0; color: #d4af37; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                        🚢 CONSULTATION SCHEDULED
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #f5f5dc; font-size: 16px; opacity: 0.9;">
                        Your Premium Shipping Solution Awaits
                    </p>
                </div>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px; background-color: #000000; border-left: 4px solid #d4af37;">
                
                <!-- Greeting -->
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #d4af37; margin: 0 0 15px 0; font-size: 24px;">
                        Dear ${formData.userName},
                    </h2>
                    <p style="color: #f5f5dc; line-height: 1.6; font-size: 16px; margin: 0;">
                        Thank you for choosing our premium shipping services. We have successfully scheduled your consultation meeting to discuss your specific requirements.
                    </p>
                </div>

                <!-- Meeting Details Card -->
                <div style="background: linear-gradient(135deg, #2d2d2d, #1a1a1a); border: 2px solid #d4af37; border-radius: 12px; padding: 25px; margin: 30px 0; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);">
                    <h3 style="color: #d4af37; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">📅</span> Meeting Details
                    </h3>
                    <div style="background-color: rgba(245, 245, 220, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37;">
                        <p style="margin: 0 0 15px 0; color: #f5f5dc; font-size: 16px;">
                            <strong style="color: #d4af37;">📍 Date & Time:</strong><br>
                            <span style="font-size: 18px; font-weight: bold;">${meetingDate}</span>
                        </p>
                        <p style="margin: 0; color: #f5f5dc; font-size: 16px;">
                            <strong style="color: #d4af37;">🔗 Google Meet Link:</strong><br>
                            <a href="${meetLink}" style="color: #ffd700; text-decoration: none; font-weight: bold; background-color: rgba(212, 175, 55, 0.2); padding: 8px 15px; border-radius: 5px; display: inline-block; margin-top: 5px; transition: all 0.3s ease;">
                                Join Meeting →
                            </a>
                        </p>
                    </div>
                </div>

                <!-- Shipping Requirements -->
                <div style="background-color: #1a1a1a; border-radius: 10px; padding: 25px; margin: 25px 0; border: 1px solid #333;">
                    <h3 style="color: #d4af37; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">📦</span> Your Shipping Requirements
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div style="background-color: rgba(245, 245, 220, 0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #d4af37;">
                            <strong style="color: #d4af37;">Shipping Type:</strong> 
                            <span style="color: #f5f5dc;">${
                              formData.shippingType || "Not specified"
                            }</span>
                        </div>
                        <div style="background-color: rgba(245, 245, 220, 0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #d4af37;">
                            <strong style="color: #d4af37;">From:</strong> 
                            <span style="color: #f5f5dc;">${
                              formData.locationInput || "Not specified"
                            }</span>
                        </div>
                        <div style="background-color: rgba(245, 245, 220, 0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #d4af37;">
                            <strong style="color: #d4af37;">To:</strong> 
                            <span style="color: #f5f5dc;">${
                              formData.deliveryAddress || "Not specified"
                            }</span>
                        </div>
                        <div style="background-color: rgba(245, 245, 220, 0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #d4af37;">
                            <strong style="color: #d4af37;">Dimensions:</strong> 
                            <span style="color: #f5f5dc;">${
                              formData.dimensionLength || "N/A"
                            } x ${formData.dimensionWidth || "N/A"} x ${
    formData.dimensionHeight || "N/A"
  } ${formData.dimensionUnit || ""}</span>
                        </div>
                        <div style="background-color: rgba(245, 245, 220, 0.05); padding: 12px; border-radius: 6px; border-left: 3px solid #d4af37;">
                            <strong style="color: #d4af37;">Weight:</strong> 
                            <span style="color: #f5f5dc;">${
                              formData.weight || "N/A"
                            } ${formData.weightUnit || ""}</span>
                        </div>
                    </div>
                </div>

                <!-- Instructions -->
                <div style="background: linear-gradient(135deg, #d4af37, #ffd700); padding: 20px; border-radius: 10px; margin: 30px 0;">
                    <div style="background-color: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px;">
                        <h3 style="color: #d4af37; margin: 0 0 10px 0; font-size: 18px;">
                            💡 What to Expect
                        </h3>
                        <p style="color: #f5f5dc; margin: 0; line-height: 1.6;">
                            Please join the meeting at the scheduled time. Our expert team will discuss all details and provide you with the most efficient and cost-effective shipping solution tailored to your needs.
                        </p>
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #000000; padding: 30px; text-align: center; border-top: 2px solid #d4af37;">
                <p style="color: #d4af37; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
                    Premium Shipping Solutions
                </p>
                <p style="color: #f5f5dc; margin: 0; font-size: 14px; opacity: 0.8;">
                    Thank you for choosing our services. We look forward to serving you.
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
                    <p style="color: #888; margin: 0; font-size: 12px;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </div>

        </div>
    </body>
    </html>
  `;
}

function getAdminEmailTemplate(formData, meetEvent, meetingDate, meetLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Shipping Consultation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #1a1a1a; color: #f5f5dc;">
        <div style="max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);">
            
            <!-- Header Section -->
            <div style="background: linear-gradient(45deg, #d4af37, #ffd700, #b8860b); padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
                <div style="background-color: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px;">
                    <h1 style="margin: 0; color: #d4af37; font-size: 24px; font-weight: bold;">
                        🚨 NEW CONSULTATION REQUEST
                    </h1>
                    <p style="margin: 5px 0 0 0; color: #f5f5dc; font-size: 14px;">
                        Admin Dashboard Alert
                    </p>
                </div>
            </div>

            <!-- Main Content -->
            <div style="padding: 30px; background-color: #000000;">
                
                <!-- Meeting Details -->
                <div style="background: linear-gradient(135deg, #2d2d2d, #1a1a1a); border: 2px solid #d4af37; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">📅 Meeting Information</h3>
                    <p style="margin: 0 0 10px 0; color: #f5f5dc;"><strong style="color: #d4af37;">Date & Time:</strong> ${meetingDate}</p>
                    <p style="margin: 0; color: #f5f5dc;">
                        <strong style="color: #d4af37;">Google Meet:</strong> 
                        <a href="${meetLink}" style="color: #ffd700; text-decoration: none; font-weight: bold;">Join Meeting</a>
                    </p>
                </div>

                <!-- Customer Info -->
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">👤 Customer Information</h3>
                    <p style="margin: 0 0 8px 0; color: #f5f5dc;"><strong style="color: #d4af37;">Name:</strong> ${
                      formData.userName
                    }</p>
                    <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Email:</strong> ${
                      formData.userEmail
                    }</p>
                </div>

                <!-- Shipping Requirements -->
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">🚢 Shipping Requirements</h3>
                    <div style="display: grid; gap: 8px;">
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Type:</strong> ${
                          formData.shippingType || "Not specified"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Freight:</strong> ${
                          formData.freightType || "Not specified"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Service:</strong> ${
                          formData.serviceType || "Not specified"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Handling:</strong> ${
                          formData.handlingType || "Not specified"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Container:</strong> ${
                          formData.containerType || "Not specified"
                        }</p>
                    </div>
                </div>

                <!-- Package Details -->
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">📦 Package Details</h3>
                    <div style="display: grid; gap: 8px;">
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Dimensions:</strong> ${
                          formData.dimensionLength || "N/A"
                        } x ${formData.dimensionWidth || "N/A"} x ${
    formData.dimensionHeight || "N/A"
  } ${formData.dimensionUnit || ""}</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Weight:</strong> ${
                          formData.weight || "N/A"
                        } ${formData.weightUnit || ""}</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">CBM:</strong> ${
                          formData.cbm || "N/A"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Volume:</strong> ${
                          formData.volume || "N/A"
                        }</p>
                    </div>
                </div>

                <!-- Location Details -->
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">📍 Location Details</h3>
                    <div style="display: grid; gap: 8px;">
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Pickup:</strong> ${
                          formData.locationInput || "Not specified"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Delivery:</strong> ${
                          formData.deliveryAddress || "Not specified"
                        }</p>
                        <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Ready Time:</strong> ${
                          formData.readyTime || "Not specified"
                        }</p>
                    </div>
                </div>

                <!-- Additional Information -->
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; border-left: 4px solid #d4af37;">
                    <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">ℹ️ Additional Information</h3>
                    <p style="margin: 0; color: #f5f5dc;"><strong style="color: #d4af37;">Packaging Help:</strong> ${
                      formData.packagingHelp || "Not specified"
                    }</p>
                </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #000000; padding: 20px; text-align: center; border-top: 2px solid #d4af37;">
                <p style="color: #d4af37; margin: 0; font-size: 14px; font-weight: bold;">
                    Admin Dashboard - Shipping Management System
                </p>
            </div>

        </div>
    </body>
    </html>
  `;
}

// Helper function to send emails - FIXED VERSION
async function sendEmails(formData, meetEvent) {
  const meetLink = meetEvent.hangoutLink;
  const meetingDate = new Date(meetEvent.start.dateTime).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Karachi",
    }
  );

  try {
    // Email to Customer with beautiful template
    const customerMailOptions = {
      from: {
        name: "Premium Shipping Services",
        address: process.env.GMAIL_USER,
      },
      to: formData.userEmail,
      subject: "✅ Your Shipping Consultation is Confirmed - Premium Service",
      html: getCustomerEmailTemplate(
        formData,
        meetEvent,
        meetingDate,
        meetLink
      ),
    };

    // Email to Admin with detailed template
    const adminMailOptions = {
      from: {
        name: "Shipping System",
        address: process.env.GMAIL_USER,
      },
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Consultation: ${formData.userName} - ${
        formData.shippingType || "General"
      }`,
      html: getAdminEmailTemplate(formData, meetEvent, meetingDate, meetLink),
    };

    // Send customer email
    console.log("Sending email to customer:", formData.userEmail);
    const customerResult = await transporter.sendMail(customerMailOptions);
    console.log("Customer email sent successfully:", customerResult.messageId);

    // Send admin email
    console.log("Sending email to admin:", process.env.ADMIN_EMAIL);
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent successfully:", adminResult.messageId);

    return {
      customerEmailSent: true,
      adminEmailSent: true,
      customerMessageId: customerResult.messageId,
      adminMessageId: adminResult.messageId,
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

// Store form submissions (in production, use a database)
const submissions = [];

// Main endpoint to handle form submission
app.post("/api/submit-shipping-form", async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.selectedDate ||
      !formData.selectedTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userName, userEmail, selectedDate, selectedTime",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate date (should be in future)
    const meetingDate = new Date(
      `${formData.selectedDate}T${formData.selectedTime}`
    );
    if (meetingDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Meeting date should be in the future",
      });
    }

    // Create Google Meet
    console.log("Creating Google Meet...");
    const meetEvent = await createGoogleMeet(formData);

    // Send emails with error handling
    console.log("Sending emails...");
    let emailResult;
    try {
      emailResult = await sendEmails(formData, meetEvent);
    } catch (emailError) {
      console.error(
        "Email sending failed, but meeting was created:",
        emailError
      );
      // Continue execution even if email fails
      emailResult = {
        customerEmailSent: false,
        adminEmailSent: false,
        error: emailError.message,
      };
    }

    // Store submission (in production, save to database)
    const submission = {
      id: Date.now(),
      ...formData,
      meetingLink: meetEvent.hangoutLink,
      eventId: meetEvent.id,
      emailStatus: emailResult,
      createdAt: new Date(),
    };
    submissions.push(submission);

    res.json({
      success: true,
      message: "Shipping consultation scheduled successfully!",
      data: {
        meetingLink: meetEvent.hangoutLink,
        meetingDate: meetEvent.start.dateTime,
        eventId: meetEvent.id,
        emailStatus: emailResult,
      },
    });
  } catch (error) {
    console.error("Error processing form submission:", error);

    res.status(500).json({
      success: false,
      message: "Failed to schedule meeting. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all submissions (for admin)
app.get("/api/submissions", (req, res) => {
  res.json({
    success: true,
    data: submissions,
  });
});

// Get specific submission
app.get("/api/submissions/:id", (req, res) => {
  const submission = submissions.find((s) => s.id === parseInt(req.params.id));

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: "Submission not found",
    });
  }

  res.json({
    success: true,
    data: submission,
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});
// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// Test email endpoint - ADD THIS FOR DEBUGGING
app.post("/api/test-email", async (req, res) => {
  try {
    const { email } = req.body;

    const testMailOptions = {
      from: {
        name: "Test Email",
        address: process.env.GMAIL_USER,
      },
      to: email || "test@example.com",
      subject: "Test Email - Server Working",
      html: `
        <div style="padding: 20px; background-color: #f0f0f0;">
          <h2>Test Email Successful!</h2>
          <p>If you receive this email, your email configuration is working correctly.</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(testMailOptions);

    res.json({
      success: true,
      message: "Test email sent successfully",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).json({
      success: false,
      message: "Test email failed",
      error: error.message,
    });
  }
});

// Token generation endpoint
app.get("/auth/google", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/auth/google/callback"
  );

  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Ensures you get a refresh token every time
  });

  res.redirect(url);
});

// Callback endpoint to handle the token exchange
app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI ||
        "http://localhost:3000/auth/google/callback"
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Store these tokens securely in production (database)
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    console.log("Token Expiry:", new Date(tokens.expiry_date));

    // Set the credentials in your main OAuth client
    oauth2Client.setCredentials(tokens);

    // In production, you would save the refresh token to your database/config
    res.send(`
      <h1>Authentication Successful</h1>
      <p>Refresh Token: ${tokens.refresh_token}</p>
      <p>Copy this refresh token to your .env file as GOOGLE_REFRESH_TOKEN</p>
    `);
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).send("Authentication failed");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Test email: POST http://localhost:${PORT}/api/test-email`);
});

module.exports = app;
