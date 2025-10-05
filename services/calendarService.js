// services/googleMeetService.js
const { google } = require("googleapis");
const {
  getAuthorizedClient,
  checkTokenStatus,
} = require("./googleAuthService");

async function createGoogleMeet(formData) {
  let oauth2Client;
  let retryCount = 0;
  const maxRetries = 2;

  while (retryCount <= maxRetries) {
    try {
      oauth2Client = await getAuthorizedClient();
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const meetingDateTime = new Date(formData.selectedDate);
      const endDateTime = new Date(meetingDateTime.getTime() + 60 * 60 * 1000);

      const event = {
        summary: `Shipping Consultation - ${formData.userName}`,
        description: `Shipping Consultation with ${formData.userName} (${formData.userEmail})`,
        start: {
          dateTime: meetingDateTime.toISOString(),
          timeZone: formData.userTimeZone || "UTC",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: formData.userTimeZone || "UTC",
        },
        attendees: [
          {
            email: process.env.ADMIN_EMAIL,
            responseStatus: "accepted",
          },
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${retryCount}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
      });
      console.log("Google Meet created successfully");
      return response.data;
    } catch (err) {
      console.error(`Attempt ${retryCount + 1} failed:`, err.message);
      if ((err.code === 401 || err.code === 403) && retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying authentication (attempt ${retryCount})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      throw err;
    }
  }
}

async function checkAuthStatus() {
  return await checkTokenStatus();
}

module.exports = { createGoogleMeet, checkAuthStatus };
