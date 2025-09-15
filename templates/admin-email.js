exports.getAdminEmailTemplate = (
  formData,
  meetEvent,
  meetingDate,
  meetLink,
  calendarLink
) => {
  // Dynamic friendly timezone name
  const getFriendlyTimeZone = (tz) => {
    try {
      const date = new Date();
      const options = { timeZone: tz, timeZoneName: "long" };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(date);
      const tzName = parts.find((p) => p.type === "timeZoneName");
      return tzName ? tzName.value : tz;
    } catch (e) {
      return tz; // fallback
    }
  };

  // Format meeting date/time in admin timezone
  const adminTimeZone = process.env.ADMIN_TIMEZONE || "Asia/Riyadh"; // default KSA
  const meetingDateAdmin = `${new Date(
    formData.selectedDate
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}, ${formData.selectedTime}`;

  const meetingDateUser = `${new Date(formData.selectedDate).toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  )}, ${formData.selectedTimeLocal}`;

  const userTimeZoneName = getFriendlyTimeZone(formData.userTimeZone);
  const adminTimeZoneName = getFriendlyTimeZone("Asia/Riyadh");

  // Helper function to create info rows
  const infoRow = (label, value, icon = "") => {
    if (!value || value.trim() === "") return "";
    return `
      <div class="info-row">
        <div class="info-label">${icon} ${label}</div>
        <div class="info-value">${value}</div>
      </div>
    `;
  };

  // Helper function for dimensions
  const getDimensions = () => {
    if (
      formData.dimensionLength &&
      formData.dimensionWidth &&
      formData.dimensionHeight
    ) {
      return `${formData.dimensionLength} x ${formData.dimensionWidth} x ${
        formData.dimensionHeight
      } ${formData.dimensionUnit || ""}`;
    }
    return "";
  };

  // Helper function for weight
  const getWeight = () => {
    if (formData.weight) {
      return `${formData.weight} ${formData.weightUnit || ""}`;
    }
    return "";
  };
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Freight Consultation Booking - Admin Notification</title>
      <style>
        :root {
          --primary: #E3DAC9;
          --primary2: #c9f31d;
          --secondary: #2c2c2c;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: var(--primary);
          background-color: #1a1a1a;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #222;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        /* Header */
        .header {
          background-color: #444;
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
        
        /* Main Content */
        .content {
          padding: 30px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          font-size: 18px;
          color: #E3DAC9;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .section p {
          font-size: 16px;
          color: #E3DAC9;
          margin-bottom: 12px;
        }
        
        /* Alert Section */
        .alert-section {
          background: #333;
          border-left: 4px solid var(--primary2);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .alert-section h2 {
          color: #E3DAC9;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .alert-section p {
          color: #E3DAC9;
          font-size: 14px;
        }
        
        /* Customer Info Card */
        .customer-card {
          background: #333;
          border-radius: 8px;
          padding: 24px;
          border-left: 4px solid var(--primary2);
          margin: 20px 0;
        }
        .customer-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .customer-detail {
          background: #444;
          padding: 16px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
        }
        .customer-detail:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .customer-detail .label {
          color: #aaa;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .customer-detail .value {
          color: #E3DAC9;
          font-weight: 600;
          font-size: 14px;
          word-break: break-word;
        }
        
        /* Meeting Schedule */
        .meeting-card {
          background: #333;
          border-radius: 8px;
          padding: 24px;
          border-left: 4px solid var(--primary2);
          margin: 20px 0;
        }
        .meeting-detail {
          display: flex;
          align-items: center;
          padding: 8px 0;
          color: #E3DAC9;
        }
        .meeting-detail strong {
          color: var(--primary2);
          font-weight: 600;
          margin-right: 8px;
          min-width: 100px;
        }
        
        /* Freight Details */
        .freight-details {
          background: #333;
          border-radius: 8px;
          padding: 24px;
          margin: 20px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          gap:10px;
          border-bottom: 1px solid #444;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #aaa;
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        }
        .info-value {
          color: #E3DAC9;
          font-weight: 600;
          font-size: 14px;
          margin-left:10px;
          flex: 2;
          text-align: left;
        }
        
        /* Divider */
        .divider {
          border-top: 2px solid #444;
          margin: 30px 0;
          position: relative;
        }
        .divider::before {
          content: "⸻";
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #222;
          padding: 0 20px;
          color: #666;
          font-size: 18px;
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
        
        /* Admin Actions */
        .admin-actions {
          background: #333;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border: 2px dashed var(--primary2);
        }
        .admin-actions h3 {
          color: #E3DAC9;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .admin-actions ul {
          list-style: none;
          padding: 0;
        }
        .admin-actions li {
          color: #E3DAC9;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        .admin-actions li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--primary2);
          font-weight: bold;
        }
        
        /* Footer */
        .footer {
          background-color: #2c2c2c;
          color: #ccc;
          padding: 30px;
          text-align: center;
        }
        .footer .signature {
          font-size: 16px;
          color: #E3DAC9;
          margin-bottom: 8px;
        }
        .footer .team {
          font-weight: 600;
          color: #E3DAC9;
          margin-bottom: 16px;
        }
        .footer .website {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .footer .tagline {
          font-size: 14px;
          color: #999;
        }
        .footer a {
          color: var(--primary2);
          text-decoration: none;
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
            font-size: 22px;
          }
          .content {
            padding: 20px;
          }
          .customer-info {
            grid-template-columns: 1fr;
          }
          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .info-value {
            text-align: left;
          }
          .btn {
            display: block;
            margin: 8px auto;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🚨 New Consultation Booked</h1>
          <p class="subtitle">Customer has scheduled a freight consultation</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          <!-- Alert Section -->
          <div class="alert-section">
            <h2>📋 Action Required</h2>
            <p>A new customer has booked a freight consultation. Please review the details below and prepare for the scheduled meeting.</p>
          </div>

          <!-- Customer Information -->
          <div class="section">
            <h2>👤 Customer Information</h2>
            <div class="freight-details">
              <div class="info-row">
                <div class="info-label">Customer Name</div>
                <div class="info-value"> ${formData.userName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email Address</div>
                <div class="info-value"> ${formData.userEmail}</div>
              </div>
              <div class="info-row">
              <div class="info-label">Customer Time Zone</div>
              <div class="info-value">${userTimeZoneName}</div>
            </div>            
            </div>
          </div>


          <!-- Meeting Schedule -->
          <div class="section">
            <h2>📅 Meeting Schedule</h2>
            <div class="meeting-card">
              <div class="info-row"><div class="info-label">Admin Local Time</div><div class="info-value">${meetingDateAdmin} (${adminTimeZoneName})</div></div>
              <div class="info-row"><div class="info-label">User Local Time</div><div class="info-value">${meetingDateUser} (${userTimeZoneName})</div></div>
              <div class="info-row"><div class="info-label">Meeting Location</div><div class="info-value">Google Meet</div></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="button-container">
            <a href="${meetLink}" class="btn btn-primary" style="background-color: #c9f31d !important; color: #000000 !important; text-decoration: none;">Join Meeting</a>
            <a href="${calendarLink}" class="btn btn-secondary" style="text-decoration: none;">Add to Calendar</a>
          </div>

          <div class="divider"></div>

          <!-- Freight Details -->
          <div class="section">
            <h2>🚢 Freight Details</h2>
            <div class="freight-details">
              ${infoRow("Shipping Type ", formData.shippingType, "🚢")}
              ${infoRow("Freight Type ", formData.freightType, "📦")}
              ${infoRow("Service Type ", formData.serviceType, "⚙️")}
              ${infoRow("Handling Type ", formData.handlingType, "🔧")}
              ${infoRow("Packaging Help ", formData.packagingHelp, "📦")}
              ${infoRow("Pickup Location ", formData.locationInput, "📍")}
              ${infoRow("Delivery Address ", formData.deliveryAddress, "🏠")}
              ${infoRow("Container Type ", formData.containerType, "📋")}
              ${infoRow("Ready Time ", formData.readyTime, "⏰")}
              ${infoRow("Port of Loading ", formData.portOfLoading, "🚢")}
              ${infoRow("Port of Discharge ", formData.portOfDischarge, "🏁")}
              ${infoRow("CBM ", formData.cbm, "📐")}
              ${infoRow("Weight ", getWeight(), "⚖️")}
              ${infoRow("Volume ", formData.volume, "📊")}
              ${infoRow("Dimensions ", getDimensions(), "📏")}
            </div>
          </div>

          <div class="divider"></div>

          <!-- Admin Pre-Meeting Checklist -->
          <div class="section">
            <h2>📋 Pre-Meeting Preparation</h2>
            <div class="admin-actions">
              <h3>Admin Checklist:</h3>
              <ul>
                <li>Review customer's freight requirements</li>
                <li>Prepare relevant questions about their shipping needs</li>
                <li>Have agent recommendations ready based on their location/cargo type</li>
                <li>Prepare cost estimates and timeline expectations</li>
                <li>Review any special handling or documentation requirements</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p class="signature">SABIT Admin Team</p>
          <p class="team">Internal Notification System</p>
          <p class="website"><a href="https://www.justsabit.com">www.justsabit.com</a></p>
          <p class="tagline">© ${new Date().getFullYear()} SABIT — Boutique Freight Advisors</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
