function getCustomerEmailTemplate(formData, meetEvent, meetingDate, meetLink) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Confirmed</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.5;
                  color: #2c2c2c;
                  background-color: #f5f5f5;
                  padding: 20px;
              }
              
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              
              .header {
                  background: linear-gradient(135deg, #2c2c2c 0%, #1d1d1d 100%);
                  color: #ffffff;
                  padding: 32px 24px;
                  text-align: center;
              }
              
              .logo {
                  width: 48px;
                  height: 48px;
                  background: #c9f31d;
                  border-radius: 50%;
                  margin: 0 auto 16px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
              }
              
              .header h1 {
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 8px;
                  color: #e3dac9;
              }
              
              .header p {
                  font-size: 14px;
                  opacity: 0.8;
                  color: #e3dac9;
              }
              
              .content {
                  padding: 32px 24px;
              }
              
              .greeting {
                  margin-bottom: 24px;
              }
              
              .greeting h2 {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 8px;
                  color: #2c2c2c;
              }
              
              .greeting p {
                  color: #6c757d;
                  font-size: 14px;
                  line-height: 1.6;
              }
              
              .meeting-card {
                  background: #f8f9fa;
                  border: 2px solid #c9f31d;
                  border-radius: 8px;
                  padding: 24px;
                  margin: 24px 0;
                  text-align: center;
              }
              
              .meeting-card h3 {
                  color: #2c2c2c;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 16px;
              }
              
              .meeting-date {
                  font-size: 18px;
                  font-weight: 600;
                  color: #2c2c2c;
                  margin-bottom: 16px;
              }
              
              .meeting-link {
                  display: inline-block;
                  background: #c9f31d;
                  color: #2c2c2c;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 6px;
                  font-weight: 600;
                  font-size: 14px;
                  transition: all 0.2s ease;
              }
              
              .meeting-link:hover {
                  background: #b8c91d;
              }
              
              .summary-section {
                  background: #f8f9fa;
                  border-radius: 6px;
                  padding: 20px;
                  margin: 20px 0;
              }
              
              .summary-section h4 {
                  color: #2c2c2c;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
              }
              
              .summary-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 12px;
              }
              
              .summary-item {
                  background: #ffffff;
                  padding: 12px;
                  border-radius: 4px;
                  border-left: 3px solid #c9f31d;
              }
              
              .summary-item strong {
                  color: #2c2c2c;
                  font-size: 12px;
                  font-weight: 600;
                  display: block;
                  margin-bottom: 4px;
              }
              
              .summary-item span {
                  color: #6c757d;
                  font-size: 13px;
              }
              
              .next-steps {
                  background: #e3dac9;
                  border-radius: 6px;
                  padding: 20px;
                  margin: 24px 0;
                  text-align: center;
              }
              
              .next-steps h4 {
                  color: #2c2c2c;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 8px;
              }
              
              .next-steps p {
                  color: #2c2c2c;
                  font-size: 14px;
                  line-height: 1.5;
              }
              
              .footer {
                  background: #f8f9fa;
                  padding: 20px 24px;
                  text-align: center;
                  border-top: 1px solid #e9ecef;
              }
              
              .footer-logo {
                  width: 32px;
                  height: 32px;
                  background: #c9f31d;
                  border-radius: 50%;
                  margin: 0 auto 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 16px;
              }
              
              .footer h5 {
                  color: #2c2c2c;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 4px;
              }
              
              .footer p {
                  color: #6c757d;
                  font-size: 12px;
              }
              
              @media (max-width: 600px) {
                  .container {
                      margin: 0;
                      border-radius: 0;
                  }
                  
                  .summary-grid {
                      grid-template-columns: 1fr;
                  }
                  
                  .content {
                      padding: 24px 20px;
                  }
                  
                  .header {
                      padding: 24px 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">🚢</div>
                  <h1>Consultation Confirmed</h1>
                  <p>We're ready to help with your shipping needs</p>
              </div>
              
              <div class="content">
                  <div class="greeting">
                      <h2>Hello ${formData.userName},</h2>
                      <p>Thank you for choosing our shipping services. Your consultation has been successfully scheduled.</p>
                  </div>
                  
                  <div class="meeting-card">
                      <h3>📅 Your Meeting Details</h3>
                      <div class="meeting-date">${meetingDate}</div>
                      <a href="${meetLink}" class="meeting-link">Join Google Meet</a>
                  </div>
                  
                  <div class="summary-section">
                      <h4>Shipping Summary</h4>
                      <div class="summary-grid">
                          <div class="summary-item">
                              <strong>Service Type</strong>
                              <span>${
                                formData.shippingType || "Not specified"
                              }</span>
                          </div>
                          <div class="summary-item">
                              <strong>From</strong>
                              <span>${
                                formData.locationInput || "Not specified"
                              }</span>
                          </div>
                          <div class="summary-item">
                              <strong>To</strong>
                              <span>${
                                formData.deliveryAddress || "Not specified"
                              }</span>
                          </div>
                          <div class="summary-item">
                              <strong>Dimensions</strong>
                              <span>${formData.dimensionLength || "N/A"} × ${
    formData.dimensionWidth || "N/A"
  } × ${formData.dimensionHeight || "N/A"} ${
    formData.dimensionUnit || ""
  }</span>
                          </div>
                      </div>
                  </div>
                  
                  <div class="next-steps">
                      <h4>What's Next?</h4>
                      <p>Our shipping expert will discuss your requirements, provide pricing options, and answer any questions you may have. Please join the meeting on time.</p>
                  </div>
              </div>
              
              <div class="footer">
                  <div class="footer-logo">🚢</div>
                  <h5>Professional Shipping Solutions</h5>
                  <p>This is an automated confirmation email</p>
              </div>
          </div>
      </body>
      </html>
    `;
}

module.exports = { getCustomerEmailTemplate };
