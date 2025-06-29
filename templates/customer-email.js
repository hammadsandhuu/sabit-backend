exports.getCustomerEmailTemplate = (
  formData,
  meetEvent,
  meetingDate,
  meetLink,
  calendarLink,
  pdfAttachment = null
) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    // Input already includes AM/PM, so display as is
    return timeStr;
  };

  const meetingDateFormatted = formatDate(formData.selectedDate);
  const meetingTimeFormatted = formatTime(formData.selectedTime);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Shipping Consultation Confirmed</title>
      <style>
        :root {
          --primary: #E3DAC9; /* Light color for text and headings */
          --primary2: #c9f31d; /* Bright accent for buttons */
          --secondary: #2c2c2c; /* Dark text or background elements */
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: var(--primary);
          background-color: #1a1a1a; /* Dark background */
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #222; /* Slightly lighter for contrast */
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        /* Header */
        .header {
          background-color: #444; /* Neutral background */
          color: var(--primary);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          color: #E3DAC9; /* All headings and main text color as requested */
        }
        .header p {
          font-size: 16px;
          opacity: 0.9;
          color: #E3DAC9; /* Ensure paragraph text matches */
        }
        /* Main Content */
        .content {
          padding: 30px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          font-size: 20px;
          color: #E3DAC9; /* Headings also in this color */
          margin-bottom: 16px;
          font-weight: 600;
        }
        .section p {
          font-size: 16px;
          color: #E3DAC9; /* Body text in same color for consistency */
          margin-bottom: 12px;
        }
        .section ul {
          color: #E3DAC9; /* Fix for ul color */
        }
        .section li {
          color: #E3DAC9; /* Fix for li color */
        }
        /* Meeting card */
        .meeting-card {
          background: #333;
          border-radius: 8px;
          padding: 24px;
          border-left: 4px solid var(--primary2);
        }
        .meeting-detail {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #444;
        }
        .meeting-detail:last-child {
          border-bottom: none;
        }
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          fill: var(--primary2);
        }
        .meeting-detail strong {
          color: var(--primary);
          font-weight: 600;
          margin-right: 8px;
        }
        /* Buttons */
        .button-container {
          text-align: center;
          margin: 24px 0;
        }
        .btn {
          display: inline-block;
          padding: 14px 28px;
          margin: 8px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.3px;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .btn-primary {
          background-color: #c9f31d !important;
          color: #000000 !important;
        }
        .btn-success {
          background-color: #c9f31d !important;
          color: #000000 !important;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        /* Alert box */
        .alert {
          background-color: #444;
          border: 1px solid #666;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          color: var(--primary);
        }
        .alert h3 {
          color: #ffd700; /* Gold for warning */
          margin-bottom: 8px;
          font-size: 16px;
        }
        .alert p {
          font-size: 14px;
          color: #E3DAC9; /* Fix alert paragraph color */
        }
        /* Footer */
        .footer {
          background-color: #2c2c2c;
          color: #ccc;
          padding: 30px;
          text-align: center;
        }
        .logo {
          max-width: 100px;
          margin-bottom: 12px;
          display: block !important;
        }
        .footer p {
          margin: 8px 0;
          font-size: 14px;
        }
        .footer a {
          color: var(--primary2);
          text-decoration: underline;
        }
        /* Help section contact info */
        .contact-info {
          margin-left: 20px; 
          color: #E3DAC9;
        }
        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .contact-item .icon {
          margin-right: 8px;
        }
        /* Responsive */
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 8px;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .meeting-card {
            padding: 16px;
          }
          .meeting-detail {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .btn {
            display: block;
            margin: 8px auto;
            text-align: center;
          }
          .logo {
            max-width: 80px;
          }
          .contact-item {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>✓ Consultation Confirmed</h1>
          <p style="color: #E3DAC9;">Hello ${
            formData.userName
          }, we're all set!</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          <!-- Welcome Message -->
          <div class="section">
            <p style="font-size: 16px; color: #E3DAC9;">
              Thank you for scheduling your shipping consultation with our expert team. 
              We're excited to help you find the best shipping solution for your needs.
            </p>
          </div>

          <!-- Meeting Details -->
          <div class="section">
            <h2>📅 Meeting Information</h2>
            <div class="meeting-card">
              <!-- Date with SVG -->
              <div class="meeting-detail">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <strong style="color: #E3DAC9;">Date:</strong>
                <span style="color: #E3DAC9;">${meetingDateFormatted}</span>
              </div>
              <!-- Time with SVG -->
              <div class="meeting-detail">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <strong style="color: #E3DAC9;">Time:</strong>
                <span style="color: #E3DAC9;">${meetingTimeFormatted}</span>
              </div>
              <!-- Type with SVG -->
              <div class="meeting-detail">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 2v-5l-4 2z"/>
                </svg>
                <strong style="color: #E3DAC9;">Type:</strong>
                <span style="color: #E3DAC9;">Google Meet</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="button-container">
              <a href="${meetLink}" class="btn btn-primary" style="background-color: #c9f31d !important; color: #000000 !important; text-decoration: none;">Join Meeting</a>
              <a href="${calendarLink}" class="btn btn-success" style="background-color: #c9f31d !important; color: #000000 !important; text-decoration: none;">Add to Calendar</a>
            </div>
          </div>

          <!-- Before Meeting -->
          <div class="section">
            <h2>📋 Before Your Meeting</h2>
            <p style="color: #E3DAC9;">To make the most of your consultation:</p>
            <ul style="margin-left: 20px; color: #E3DAC9;">
              <li>Review the attached shipping details document</li>
              <li>Prepare any questions about your shipment</li>
              <li>Have your shipment dimensions and weight ready</li>
              <li>Test your video/audio setup 5 minutes before the call</li>
            </ul>
          </div>

          <!-- Important Notice -->
          <div class="alert">
            <h3>⚠️ Important Notice</h3>
            <p style="color: #E3DAC9;">
              This consultation slot is reserved exclusively for you and cannot be rescheduled. 
              Please ensure you're available at the scheduled time. If you need to cancel, 
              please contact us at least 24 hours in advance.
            </p>
          </div>

          <!-- Help Section -->
          <div class="section">
            <h2>💬 Need Help?</h2>
            <p style="color: #E3DAC9;">If you have any questions or need assistance before your meeting:</p>
            <div class="contact-info">
              <div class="contact-item">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Email: <a href="mailto:support@yourcompany.com" style="color: var(--primary2);">support@justsabit.com</a></span>
              </div>
              <div class="contact-item">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>Phone: <a href="tel:+15551234567" style="color: var(--primary2);">+1 (555) 123-4567</a></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div style="text-align: center;">
            <img src="cid:logo" alt="Your Company Logo" class="logo" style="max-width: 100px; display: block !important; margin: 0 auto 12px auto;" />
          </div>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
          <p>
            <a href="#">Privacy Policy</a> | 
            <a href="#">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
