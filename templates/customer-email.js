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
      <title>Your Freight Strategy Call Is Confirmed</title>
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
        /* Logo Section */
        .logo-section {
          background-color: #1a1a1a;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #333;
        }
        .logo-section img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
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
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          color: #E3DAC9;
          line-height: 1.2;
        }
        .header .subtitle {
          font-size: 16px;
          opacity: 0.9;
          color: #E3DAC9;
          margin-bottom: 8px;
          font-weight: 400;
        }
        .celebration {
          font-size: 20px;
          margin-bottom: 16px;
        }
        /* Main Content */
        .content {
          padding: 30px;
        }
        .content p {
          font-size: 16px;
          color: #E3DAC9;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        .content strong {
          color: #E3DAC9;
          font-weight: 600;
        }
        /* Divider */
        .divider {
          border-top: 2px solid #444;
          margin: 30px 0;
          position: relative;
        }
        .divider::before {
          content: "—";
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #222;
          padding: 0 20px;
          color: #666;
          font-size: 18px;
        }
        /* Session Details */
        .session-details {
          background: #333;
          border-radius: 8px;
          padding: 24px;
          border-left: 4px solid var(--primary2);
          margin: 20px 0;
        }
        .session-details h3 {
          color: #E3DAC9;
          font-size: 18px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .session-details ul {
          list-style: none;
          padding: 0;
        }
        .session-details li {
          color: #E3DAC9;
          margin-bottom: 8px;
          font-size: 16px;
        }
        /* Preparation list */
        .prep-section {
          background: #333;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .prep-section h3 {
          color: #E3DAC9;
          font-size: 18px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .prep-section ul {
          list-style: none;
          padding: 0;
        }
        .prep-section li {
          color: #E3DAC9;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .prep-note {
          font-style: italic;
          color: #ccc;
          margin-top: 12px;
          font-size: 15px;
        }
        /* Important Note */
        .important-note {
          background-color: #444;
          border: 1px solid #666;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          color: var(--primary);
        }
        .important-note h3 {
          color: #E3DAC9;
          font-size: 18px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .important-note p {
          font-size: 16px;
          color: #E3DAC9;
          margin-bottom: 12px;
          line-height: 1.6;
        }
        
        /* Action Buttons */
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
        .btn-secondary {
          background-color: #444 !important;
          color: #E3DAC9 !important;
          border: 1px solid #666;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        /* Social Media Icons */
        .social-media {
          margin: 20px 0;
          text-align: center;
        }
        .social-icons {
          display: inline-flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
        }
        .social-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #444;
          text-align: center;
          line-height: 40px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .social-icon:hover {
          transform: translateY(-2px);
          border-color: var(--primary2);
          background-color: #555;
        }
        .social-icon svg {
          width: 20px;
          height: 20px;
          fill: #E3DAC9;
          vertical-align: middle;
        }
        /* Footer */
        .footer {
          background-color: #2c2c2c;
          color: #ccc;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          font-size: 16px;
          color: #E3DAC9;
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .footer .website {
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        .footer .tagline {
          font-size: 14px;
          color: #999;
        }
        .footer a {
          color: var(--primary2);
          text-decoration: none;
        }
        .footer strong {
          color: #E3DAC9;
          font-weight: 600;
        }
        /* Responsive */
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 8px;
          }
          .logo-section {
            padding: 15px 10px;
          }
          .logo-section img {
            max-width: 150px;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 22px;
          }
          .header .subtitle {
            font-size: 14px;
          }
          .content {
            padding: 20px;
          }
          .session-details {
            padding: 16px;
          }
          .prep-section {
            padding: 15px 10px;
          }
          .important-note {
            padding: 16px;
          }
          .btn {
            display: block;
            margin: 8px auto;
            text-align: center;
          }
          .social-icons {
            gap: 12px;
          }
          .social-icon {
            width: 36px;
            height: 36px;
            line-height: 36px;
          }
          .social-icon svg {
            width: 18px;
            height: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        
        <!-- Header -->
        <div class="header">
          <img
            src="https://www.justsabit.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.da54b973.png&w=256&q=75"
            alt="SABIT Logo"
            width="300"
            height="85"
            style="display: block; margin: 0 auto 20px; border-radius: 12px;"
          />
          <h1>Consultation Confirmed</h1>
        </div>



        <!-- Main Content -->
        <div class="content">
          <p>Hi <strong>${formData.userName}</strong>,</p>
          
          <p><strong>You're officially booked for your free 15-minute freight strategy call with a senior advisor from SABIT</strong> — the trusted name in <br/> high-performance logistics.</p>
          
          <p>Whether it's your first shipment or you're scaling global operations, this consult is built to expose what's slowing you down, costing you money, or putting cargo at risk — and show you how to fix it.</p>
          
          <p><strong>This is not a sales call.</strong></p>
          
          <p>It's a tactical consult for serious operators who are done chasing quotes and ready for clarity, speed, and vetted execution.</p>

          <div class="divider"></div>

          <!-- Session Details -->
          <div class="session-details">
            <h3>🗓 Session Details</h3>
            <ul>
              <li>• <strong>Date:</strong> ${meetingDateFormatted}</li>
              <li>• <strong>Time:</strong> ${meetingTimeFormatted} (your local time)</li>
              <li>• <strong>Location:</strong> Google Meet (link below)</li>
            </ul>
          </div>
          <!-- Action Buttons -->
          <div class="button-container">
            <a href="${meetLink}" class="btn btn-primary" style="background-color: #c9f31d !important; color: #000000 !important; text-decoration: none;">Join Meeting</a>
            <a href="${calendarLink}" class="btn btn-secondary" style="text-decoration: none;">Add to Calendar</a>
          </div>

          <div class="divider"></div>

          <!-- Preparation Section -->
          <div class="prep-section">
            <h3>📂 To move faster, bring what you can:</h3>
            <ul>
              <li>• Packing list</li>
              <li>• Cargo readiness date</li>
              <li>• Supplier contact</li>
              <li>• Commercial invoice (if available)</li>
              <li>• Any shipment goals or questions</li>
            </ul>
            <p class="prep-note">If you're missing anything — we'll walk you through it live.</p>
          </div>

          <div class="divider"></div>

          <!-- Important Note -->
          <div class="important-note">
            <h3>⏳ Important Note:</h3>
            <p>Out of respect for our team and other booked operators, this session cannot be rescheduled or canceled.</p>
            <p>We hold time for those serious about solving problems, not window shopping.</p>
          </div>

          <div class="divider"></div>

          <p>At SABIT, we don't sell freight. <strong>We solve it.</strong></p>
          <p>We cut through red tape, match you with elite agents, and ship with zero drama.</p>
          <p><strong>See you in session.</strong></p>
        </div>
        
        <!-- Footer -->
        <!-- Footer with Rounded Background Social Icons -->
        <div class="footer" style="background-color: #2c2c2c; color: #ccc; padding: 30px; text-align: center;">        
          <!-- Rounded Background Social Media Icons -->
          <div style="margin: 20px 0;">
            <!-- Instagram -->
            <a href="https://www.instagram.com/justsabit" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #444; border-radius: 50%; padding: 8px;">
              <img src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png" alt="Instagram" width="20" height="20" style="display: block;" />
            </a>
            <!-- Facebook -->
            <a href="https://www.facebook.com/itsSABIT" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #444; border-radius: 50%; padding: 8px;">
              <img src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png" alt="Facebook" width="20" height="20" style="display: block;" />
            </a>
            <!-- TikTok -->
            <a href="https://www.tiktok.com/@justsabit_" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #444; border-radius: 50%; padding: 8px;">
              <img src="https://img.icons8.com/ios-filled/24/ffffff/tiktok.png" alt="TikTok" width="20" height="20" style="display: block;" />
            </a>
            <!-- YouTube -->
            <a href="https://www.youtube.com/@justsabit" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #444; border-radius: 50%; padding: 8px;">
              <img src="https://img.icons8.com/ios-filled/24/ffffff/youtube-play.png" alt="YouTube" width="20" height="20" style="display: block;" />
            </a>
          </div>
        
          <p class="tagline" style="font-size: 14px; color: #999;">Global Freight | Personal Support</p>
          <p class="tagline" style="font-size: 14px; color: #999;">© ${new Date().getFullYear()} SABIT — Boutique Freight Advisors</p>
        </div>        
      </div>
    </body>
    </html>
  `;
};
