function getAdminEmailTemplate(formData, meetEvent, meetingDate, meetLink) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Consultation Request</title>
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
                  background: #2c2c2c;
                  color: #ffffff;
                  padding: 24px;
                  text-align: center;
              }
              
              .header h1 {
                  font-size: 20px;
                  font-weight: 600;
                  margin-bottom: 4px;
              }
              
              .header p {
                  font-size: 14px;
                  opacity: 0.9;
              }
              
              .alert {
                  background: #fff3cd;
                  border-left: 4px solid #ffc107;
                  padding: 12px 16px;
                  margin: 20px;
                  border-radius: 4px;
              }
              
              .alert-text {
                  color: #856404;
                  font-weight: 500;
                  font-size: 14px;
              }
              
              .content {
                  padding: 0 24px 24px;
              }
              
              .meeting-info {
                  background: #f8f9fa;
                  border: 1px solid #e9ecef;
                  border-radius: 6px;
                  padding: 20px;
                  margin: 20px 0;
              }
              
              .meeting-info h3 {
                  color: #2c2c2c;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 12px;
              }
              
              .meeting-info p {
                  margin-bottom: 8px;
                  font-size: 14px;
              }
              
              .meeting-link {
                  display: inline-block;
                  background: #c9f31d;
                  color: #2c2c2c;
                  text-decoration: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  font-weight: 500;
                  font-size: 14px;
                  margin-top: 8px;
              }
              
              .info-section {
                  margin: 20px 0;
                  border-bottom: 1px solid #e9ecef;
                  padding-bottom: 16px;
              }
              
              .info-section:last-child {
                  border-bottom: none;
                  padding-bottom: 0;
              }
              
              .info-section h4 {
                  color: #2c2c2c;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 8px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
              }
              
              .info-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 6px 0;
                  border-bottom: 1px solid #f8f9fa;
              }
              
              .info-row:last-child {
                  border-bottom: none;
              }
              
              .info-label {
                  font-weight: 500;
                  color: #6c757d;
                  font-size: 13px;
              }
              
              .info-value {
                  color: #2c2c2c;
                  font-size: 13px;
                  text-align: right;
                  max-width: 60%;
              }
              
              .footer {
                  background: #f8f9fa;
                  padding: 16px 24px;
                  text-align: center;
                  border-top: 1px solid #e9ecef;
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
                  
                  .info-row {
                      flex-direction: column;
                      align-items: flex-start;
                      gap: 4px;
                  }
                  
                  .info-value {
                      text-align: left;
                      max-width: 100%;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>New Consultation Request</h1>
                  <p>Admin Notification</p>
              </div>
              
              <div class="alert">
                  <div class="alert-text">⚡ New customer consultation scheduled - Review required</div>
              </div>
              
              <div class="content">
                  <div class="meeting-info">
                      <h3>Meeting Details</h3>
                      <p><strong>Date:</strong> ${meetingDate}</p>
                      <p><strong>Platform:</strong> Google Meet</p>
                      <a href="${meetLink}" class="meeting-link">Join Meeting</a>
                  </div>
                  
                  <div class="info-section">
                      <h4>Customer Information</h4>
                      <div class="info-row">
                          <span class="info-label">Name</span>
                          <span class="info-value">${formData.userName}</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">Email</span>
                          <span class="info-value">${formData.userEmail}</span>
                      </div>
                  </div>
                  
                  <div class="info-section">
                      <h4>Shipping Requirements</h4>
                      <div class="info-row">
                          <span class="info-label">Type</span>
                          <span class="info-value">${
                            formData.shippingType || "Not specified"
                          }</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">From</span>
                          <span class="info-value">${
                            formData.locationInput || "Not specified"
                          }</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">To</span>
                          <span class="info-value">${
                            formData.deliveryAddress || "Not specified"
                          }</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">Dimensions</span>
                          <span class="info-value">${
                            formData.dimensionLength || "N/A"
                          } × ${formData.dimensionWidth || "N/A"} × ${
    formData.dimensionHeight || "N/A"
  } ${formData.dimensionUnit || ""}</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">Weight</span>
                          <span class="info-value">${
                            formData.weight || "N/A"
                          } ${formData.weightUnit || ""}</span>
                      </div>
                  </div>
                  
                  <div class="info-section">
                      <h4>Service Details</h4>
                      <div class="info-row">
                          <span class="info-label">Freight Type</span>
                          <span class="info-value">${
                            formData.freightType || "Not specified"
                          }</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">Service Type</span>
                          <span class="info-value">${
                            formData.serviceType || "Not specified"
                          }</span>
                      </div>
                      <div class="info-row">
                          <span class="info-label">Ready Time</span>
                          <span class="info-value">${
                            formData.readyTime || "Not specified"
                          }</span>
                      </div>
                  </div>
              </div>
              
              <div class="footer">
                  <p>Admin Dashboard • Shipping Management System</p>
              </div>
          </div>
      </body>
      </html>
    `;
}

module.exports = { getAdminEmailTemplate };
