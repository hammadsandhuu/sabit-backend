exports.getCarBookingCustomerTemplate = (formData, calendarLink, meetLink) => {
  const isBookNow = formData.intent === "book-now";

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => timeStr || "N/A";

  const getFriendlyTimeZone = (tz) => {
    try {
      const date = new Date();
      const options = { timeZone: tz, timeZoneName: "long" };
      const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(
        date
      );
      const tzName = parts.find((p) => p.type === "timeZoneName");
      return tzName ? tzName.value : tz || "N/A";
    } catch {
      return tz || "N/A";
    }
  };

  const meetingDateUser = `${formatDate(formData.selectedDate)}, ${formatTime(
    formData.selectedTimeLocal
  )}`;
  const userTZName = getFriendlyTimeZone(formData.userTimeZone || "UTC");

  const infoRow = (label, value, icon = "") => {
    if (!value && value !== 0) return "";
    return `
      <div class="info-row">
        <div class="info-label">${icon} ${label}</div>
        <div class="info-value">${value}</div>
      </div>
    `;
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Your Car Transport Booking</title>
    <style>
      :root { --primary: #E3DAC9; --primary2: #c9f31d; --secondary: #2c2c2c; }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height:1.6; color: var(--primary); background-color:#1a1a1a; }
      .email-container { max-width:600px; margin:0 auto; background:#222; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.3); }
      .header { background-color:#444; color: var(--primary); padding:40px 30px; text-align:center; }
      .header h1 { font-size:28px; font-weight:700; margin-bottom:12px; letter-spacing:-0.5px; color:#E3DAC9; line-height:1.2; }
      .header .subtitle { font-size:16px; opacity:0.9; color:#E3DAC9; margin-bottom:8px; font-weight:400; }
      .content { padding:30px; }
      .section { margin-bottom:30px; }
      .section h2 { font-size:18px; color:#E3DAC9; margin-bottom:16px; font-weight:600; }
      .section p { font-size:16px; color:#E3DAC9; margin-bottom:12px; }
      .alert-section { background:#333; border-left:4px solid var(--primary2); border-radius:8px; padding:20px; margin-bottom:30px; }
      .alert-section h2 { color:#E3DAC9; font-size:18px; margin-bottom:8px; }
      .alert-section p { color:#E3DAC9; font-size:14px; }
      .customer-card { background:#333; border-radius:8px; padding:24px; border-left:4px solid var(--primary2); margin:20px 0; }
      .customer-info { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      .customer-detail { background:#444; padding:16px; border-radius:6px; display:flex; flex-direction:column; align-items:center; text-align:center; transition:all 0.3s ease; margin:10px 0; }
      .customer-detail .label { color:#aaa; font-size:14px; text-transform:uppercase; font-weight:500; margin-right:8px; }
      .customer-detail .value { color:#E3DAC9; font-weight:600; font-size:14px; word-break:break-word; }
      .meeting-card { background:#333; border-radius:8px; padding:24px; border-left:4px solid var(--primary2); margin:20px 0; }
      .freight-details { background:#333; border-radius:8px; padding:24px; margin:20px 0; }
      .info-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; gap:10px; border-bottom:1px solid #444; }
      .info-row:last-child { border-bottom:none; }
      .info-label { color:#aaa; font-size:14px; font-weight:500; flex:1; }
      .info-value { color:#E3DAC9; font-weight:600; font-size:14px; margin-left:10px; flex:2; text-align:left; }
      .divider { border-top:2px solid #444; margin:30px 0; position:relative; }
      .divider::before { content:"⸻"; position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:#222; padding:0 20px; color:#666; font-size:18px; }
      .button-container { text-align:center; margin:24px 0; }
      .btn { display:inline-block; padding:14px 28px; margin:8px; text-decoration:none; border-radius:6px; font-weight:600; font-size:14px; letter-spacing:0.3px; transition:all 0.3s ease; text-transform:uppercase; }
      .btn-primary { background-color: #c9f31d !important; color:#000 !important; }
      .btn-secondary { background-color:#444 !important; color:#E3DAC9 !important; border:1px solid #666; }
      .btn:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.2); }
      .prep-section { background:#333; border-radius:8px; padding:24px; margin:20px 0; border-left:4px solid var(--primary2); }
      .prep-section ul { list-style:none; padding:0; }
      .prep-section li { color:#E3DAC9; margin-bottom:8px; font-size:16px; }
      .prep-note { font-style:italic; color:#ccc; margin-top:12px; font-size:15px; }
      .footer { background-color:#2c2c2c; color:#ccc; padding:30px; text-align:center; }
      .footer p { font-size:16px; color:#E3DAC9; margin-bottom:8px; line-height:1.6; }
      .footer a { color: var(--primary2); text-decoration:none; }
      @media (max-width:600px) {
        .email-container { margin:10px; border-radius:8px; }
        .header { padding:30px 20px; }
        .header h1 { font-size:22px; }
        .content { padding:20px; }
        .customer-info { grid-template-columns:1fr; }
        .info-row { flex-direction:column; align-items:flex-start; gap:4px; }
        .info-value { text-align:left; }
        .btn { display:block; margin:8px auto; text-align:center; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Car Transport Booking Confirmed</h1>
        <p class="subtitle">Thank you for booking with SABIT!</p>
      </div>

      <div class="content">
        <div class="alert-section">
          <h2>📋 Booking Details</h2>
          <p>Your car transport booking ${
            isBookNow ? "has been scheduled" : "request has been received"
          }. Below are the details.</p>
        </div>

        <div class="section">
        <h2>📄 Your Booking Summary</h2>
        <div class="customer-card">
          <div class="customer-info">
            ${
              formData.name
                ? `<div class="customer-detail"><div class="label">Name</div><div class="value">${formData.name}</div></div>`
                : ""
            }
            ${
              formData.email
                ? `<div class="customer-detail"><div class="label">Email</div><div class="value">${formData.email}</div></div>`
                : ""
            }
            ${
              formData.whatsapp
                ? `<div class="customer-detail"><div class="label">WhatsApp</div><div class="value">${formData.whatsapp}</div></div>`
                : ""
            }
            ${
              isBookNow && formData.userTimeZone
                ? `<div class="customer-detail"><div class="label">Time Zone</div><div class="value">${userTZName}</div></div>`
                : ""
            }
          </div>
        </div>
        <p style="margin-top:12px; font-size:14px; color:#ccc;">
          This is just a quick summary of the details you provided. If any information is incorrect, please contact our support team.
        </p>
      </div>
      

        ${
          isBookNow
            ? `
        <div class="section">
          <h2>📅 Meeting Schedule</h2>
          <div class="meeting-card">
            <div class="info-row"><div class="info-label">Date & Time</div><div class="info-value">${meetingDateUser} (${userTZName})</div></div>
            <div class="info-row"><div class="info-label">Meeting Location</div><div class="info-value">Google Meet</div></div>
          </div>

          <div class="button-container">
            <a href="${meetLink}" class="btn btn-primary">Join Meeting</a>
            <a href="${calendarLink}" class="btn btn-secondary">Add to Calendar</a>
          </div>
        </div>`
            : ""
        }

        <div class="section">
          <h2>Car Shipping Details</h2>
          <div class="freight-details">
            ${infoRow("Number of Cars", formData.numberOfCars, "🚗")}
            ${infoRow("Car Type", formData.carType, "🏷️")}
            ${infoRow("Pickup State", formData.pickupState, "📍")}
            ${infoRow(
              "Pickup City",
              formData.pickupCity || formData.pickupLocation,
              "📍"
            )}
            ${infoRow(
              "Drop-off City",
              formData.dropOffCity || formData.deliveryCity,
              "📍"
            )}
            ${infoRow("Transport Mode", formData.mode, "🚚")}
            ${infoRow("Timeline", formData.timeline, "⏳")}
            ${infoRow(
              "Additional Notes",
              formData.additionalNotes || formData.notes,
              "📝"
            )}
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <h2>Preparation Checklist</h2>
          <div class="prep-section">
            <ul>
              <li>Double-check your car details and pickup/drop-off locations.</li>
              <li>Keep all vehicle documents (registration, insurance) ready.</li>
              <li>Ensure the car is ready for pickup (clean and accessible).</li>
              <li>Be available at the scheduled pickup and delivery times.</li>
              ${
                isBookNow
                  ? "<li>Join the scheduled Google Meet consultation to discuss your transport.</li>"
                  : ""
              }
              <li>Have any special requests or notes ready for our team.</li>
            </ul>
            <p class="prep-note">Following these steps will ensure a smooth transport experience!</p>
          </div>
        </div>

      </div>

      <div class="footer">
        <p>SABIT Customer Support</p>
        <p><a href="https://www.justsabit.com">www.justsabit.com</a></p>
        <p>© ${new Date().getFullYear()} SABIT — Boutique Freight Advisors</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

exports.getCarBookingAdminTemplate = (formData, calendarLink, meetLink) => {
  const isBookNow = formData.intent === "book-now";
  const getFriendlyTimeZone = (tz) => {
    try {
      const date = new Date();
      const options = { timeZone: tz, timeZoneName: "long" };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(date);
      const tzName = parts.find((p) => p.type === "timeZoneName");
      return tzName ? tzName.value : tz;
    } catch (e) {
      return tz;
    }
  };

  const adminTZ = process.env.ADMIN_TIMEZONE || "Asia/Riyadh";
  const userTZName = getFriendlyTimeZone(formData.userTimeZone || "UTC");
  const adminTZName = getFriendlyTimeZone(adminTZ);
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
  const infoRow = (label, value, icon = "") => {
    if (!value && value !== 0) return "";
    return `
      <div class="info-row">
        <div class="info-label">${icon} ${label}</div>
        <div class="info-value">${value}</div>
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Car Shipping Booking - Admin Notification</title>
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
          margin:10px 0;
        }
        .customer-detail:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .customer-detail .label {
          color: #aaa;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 500;
          margin-right: 8px;
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
          <h1>New Car Shipping Booking</h1>
          <p class="subtitle">Customer has ${
            isBookNow
              ? "scheduled a car shipping consultation"
              : "requested car shipping information"
          }</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          <!-- Alert Section -->
          <div class="alert-section">
            <h2>📋 Action Required</h2>
            <p>A new customer has ${
              isBookNow
                ? "booked a car shipping consultation"
                : "requested car shipping information"
            }. ${
    isBookNow
      ? "Please review the details below and prepare for the scheduled meeting."
      : "Please contact the customer within 24 hours to discuss their requirements."
  }</p>
          </div>

          <!-- Customer Information -->
          <div class="section">
            <h2>👤 Customer Information</h2>
            <div class="customer-card">
              <div class="customer-info">
                <div class="customer-detail">
                  <div class="label">Customer Name : </div>
                  <div class="value">${
                    formData.name || formData.userName || "N/A"
                  }</div>
                </div>
                <div class="customer-detail">
                  <div class="label">Email Address : </div>
                  <div class="value">${
                    formData.email || formData.userEmail || "N/A"
                  }</div>
                </div>
                <div class="customer-detail">
                  <div class="label">Phone / WhatsApp :  </div>
                  <div class="value">${formData.whatsapp || "N/A"}</div>
                </div>
                ${
                  isBookNow
                    ? `<div class="customer-detail">
                         <div class="label">Customer Time Zone : </div>
                         <div class="value">${userTZName}</div>
                       </div>`
                    : ""
                }
              </div>
            </div>
          </div>

          ${
            isBookNow
              ? `<!-- Meeting Schedule -->
                 <div class="section">
                   <h2>📅 Meeting Schedule</h2>
                   <div class="meeting-card">
                     <div class="info-row"><div class="info-label">Admin Local Time</div><div class="info-value">${meetingDateAdmin} (${adminTZName})</div></div>
                     <div class="info-row"><div class="info-label">User Local Time</div><div class="info-value">${meetingDateUser} (${userTZName})</div></div>
                     <div class="info-row"><div class="info-label">Meeting Location</div><div class="info-value">Google Meet</div></div>
                   </div>
                 </div>

                 <!-- Action Buttons -->
                 <div class="button-container">
                   <a href="${meetLink}" class="btn btn-primary" style="background-color: #c9f31d !important; color: #000000 !important; text-decoration: none;">Join Meeting</a>
                   <a href="${calendarLink}" class="btn btn-secondary" style="text-decoration: none;">Add to Calendar</a>
                 </div>`
              : `<div class="divider"></div>`
          }

          <!-- Car Shipping Details -->
          <div class="section">
            <h2>Car Shipping Details</h2>
            <div class="freight-details">
              ${infoRow("Number of Cars", formData.numberOfCars, "🚗")}
              ${infoRow("Car Type", formData.carType, "🏷️")}
              ${infoRow("Pickup State", formData.pickupState, "📍")}
              ${infoRow(
                "Pickup City",
                formData.pickupCity || formData.pickupLocation || "",
                "📍"
              )}
              ${infoRow(
                "Drop-off City",
                formData.dropOffCity || formData.deliveryCity || "",
                "📍"
              )}
              ${infoRow("Transport Mode", formData.mode, "🚚")}
              ${infoRow("Timeline", formData.timeline, "⏳")}
              ${infoRow(
                "Additional Notes",
                formData.additionalNotes || formData.notes || "",
                "📝"
              )}
            </div>
          </div>

          <div class="divider"></div>

          <!-- Admin Pre-Meeting Checklist -->
          <div class="section">
            <h2>📋 ${
              isBookNow ? "Pre-Meeting Preparation" : "Action Required"
            }</h2>
            <div class="admin-actions">
              <h3>${isBookNow ? "Admin Checklist:" : "Next Steps:"}</h3>
              <ul>
                ${
                  isBookNow
                    ? `
                    <li>Review customer's vehicle transport requirements</li>
                    <li>Prepare carrier options for the specified route</li>
                    <li>Have cost estimates ready based on vehicle type and distance</li>
                    <li>Prepare timeline expectations and pickup/delivery process</li>
                    <li>Review any special vehicle requirements or documentation</li>
                    `
                    : `
                    <li>Contact customer within 24 hours via phone or WhatsApp</li>
                    <li>Discuss their vehicle transport requirements in detail</li>
                    <li>Provide preliminary cost estimates and timeline</li>
                    <li>Schedule a follow-up meeting if needed</li>
                    <li>Update the booking status in the admin system</li>
                    `
                }
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
