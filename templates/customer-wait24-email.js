exports.getCustomerWait24EmailTemplate = (formData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>We’ve received your request – SABIT Car Shipping</title>
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
          font-size: 24px;
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
        .section h2 {
          font-size: 18px;
          color: #E3DAC9;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #444;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #aaa;
          font-size: 14px;
          flex: 1;
        }
        .info-value {
          color: #E3DAC9;
          font-weight: 600;
          font-size: 14px;
          flex: 2;
          text-align: left;
        }
        .footer {
          background-color: #2c2c2c;
          color: #ccc;
          padding: 30px;
          text-align: center;
        }
        .footer a {
          color: var(--primary2);
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>We’ve Received Your Request</h1>
          <p class="subtitle">Our team will contact you within 24 hours.</p>
        </div>

        <div class="content">
          <div class="section">
            <h2>Your Submitted Details</h2>
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
              <div class="info-value">${formData.whatsapp || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Pickup</div>
              <div class="info-value">${formData.pickupState || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Drop-off</div>
              <div class="info-value">${formData.dropOffCity || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Car Type</div>
              <div class="info-value">${formData.carType || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Mode</div>
              <div class="info-value">${formData.mode || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Timeline</div>
              <div class="info-value">${formData.timeline || "N/A"}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing SABIT Freight Advisors.</p>
          <p>Visit <a href="https://www.justsabit.com">www.justsabit.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
