exports.getAdminWait24EmailTemplate = (formData) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>New Car Shipping Request - Admin Notification</title>
        <style>
          :root {
            --primary: #E3DAC9;
            --primary2: #c9f31d;
            --secondary: #2c2c2c;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #1a1a1a;
            color: var(--primary);
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #222;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          .header {
            background-color: #444;
            color: var(--primary);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #E3DAC9;
          }
          .header .subtitle {
            font-size: 16px;
            color: #E3DAC9;
            opacity: 0.9;
          }
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
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
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
            flex: 2;
            text-align: left;
          }
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
          .divider {
            border-top: 2px solid #444;
            margin: 30px 0;
          }
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
          @media (max-width: 600px) {
            .content { padding: 20px; }
            .info-row { flex-direction: column; align-items: flex-start; }
            .info-value { text-align: left; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <h1>New Car Shipping Request</h1>
            <p class="subtitle">A customer has submitted a car shipping form.</p>
          </div>
  
          <!-- Content -->
          <div class="content">
            <!-- Alert -->
            <div class="alert-section">
              <h2>Action Required</h2>
              <p>A customer has requested to be contacted within 24 hours. Please review their information and follow up promptly.</p>
            </div>
  
            <!-- Customer Info -->
            <div class="section">
              <h2>Customer Information</h2>
              <div class="info-row">
                <div class="info-label">Name</div>
                <div class="info-value">${formData.name || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value">${formData.email || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Phone</div>
                <div class="info-value">${formData.phone || "N/A"}</div>
              </div>
            </div>
  
            <div class="divider"></div>
  
            <!-- Car Shipping Info -->
            <div class="section">
              <h2>Car Shipping Details</h2>
              <div class="info-row">
                <div class="info-label">Number of Cars</div>
                <div class="info-value">${formData.numberOfCars || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Car Type</div>
                <div class="info-value">${formData.carType || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Pickup State</div>
                <div class="info-value">${formData.pickupState || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Pickup City</div>
                <div class="info-value">${formData.pickupCity || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Delivery State</div>
                <div class="info-value">${formData.deliveryState || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Delivery City</div>
                <div class="info-value">${formData.deliveryCity || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Transport Type</div>
                <div class="info-value">${formData.transportType || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Preferred Date</div>
                <div class="info-value">${formData.preferredDate || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Additional Notes</div>
                <div class="info-value">${
                  formData.additionalNotes || "N/A"
                }</div>
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
