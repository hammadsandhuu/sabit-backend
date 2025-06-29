exports.getAdminEmailTemplate = (
  formData,
  meetEvent,
  meetingDate,
  meetLink,
  calendarLink
) => {
  const infoRow = (label, value) =>
    value
      ? `<tr><td style="padding: 6px 10px;"><strong>${label}:</strong></td><td style="padding: 6px 10px;">${value}</td></tr>`
      : "";

  return `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 650px; background: #fff; margin: auto; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #e74c3c;">🚨 New Shipping Consultation Booked</h2>
          <p>A new customer has booked a shipping consultation. Here are the details:</p>
  
          <table style="width: 100%; border-collapse: collapse; background-color: #fdfdfd; border: 1px solid #eee; border-radius: 4px; overflow: hidden;">
            ${infoRow("Customer Name", formData.userName)}
            ${infoRow("Email", formData.userEmail)}
            ${infoRow("Meeting Date", meetingDate)}
            ${infoRow("Shipping Type", formData.shippingType)}
            ${infoRow("Freight Type", formData.freightType)}
            ${infoRow("Service Type", formData.serviceType)}
            ${infoRow("Handling Type", formData.handlingType)}
            ${infoRow("Packaging Help", formData.packagingHelp)}
            ${infoRow("Pickup Location", formData.locationInput)}
            ${infoRow("Delivery Address", formData.deliveryAddress)}
            ${infoRow("Container Type", formData.containerType)}
            ${infoRow("Ready Time", formData.readyTime)}
            ${infoRow("CBM", formData.cbm)}
            ${infoRow(
              "Weight",
              formData.weight
                ? `${formData.weight} ${formData.weightUnit || ""}`
                : ""
            )}
            ${infoRow("Volume", formData.volume)}
            ${infoRow(
              "Dimensions",
              formData.dimensionLength &&
                formData.dimensionWidth &&
                formData.dimensionHeight
                ? `${formData.dimensionLength} x ${formData.dimensionWidth} x ${
                    formData.dimensionHeight
                  } ${formData.dimensionUnit || ""}`
                : ""
            )}
          </table>
  
          <div style="margin: 20px 0;">
            <a href="${meetLink}" target="_blank" style="display: inline-block; margin-right: 10px; padding: 10px 20px; background-color: #1a73e8; color: white; border-radius: 5px; text-decoration: none;">
              🔗 Join Google Meet
            </a>
            <a href="${calendarLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #34a853; color: white; border-radius: 5px; text-decoration: none;">
              📅 Add to Calendar
            </a>
          </div>
  
          <hr style="margin: 30px 0;"/>
  
          <footer style="font-size: 12px; color: #777;">
            <p>This is an internal notification. Please follow up if necessary.</p>
            <p>
              Company Links:
              <a href="https://facebook.com/yourpage" target="_blank">Facebook</a> |
              <a href="https://instagram.com/yourpage" target="_blank">Instagram</a> |
              <a href="https://twitter.com/yourpage" target="_blank">Twitter</a>
            </p>
            <p style="color: #aaa;">© ${new Date().getFullYear()} Premium Shipping — Internal Use Only</p>
          </footer>
        </div>
      </div>
    `;
};
