const { google } = require("googleapis");
const { getAuthorizedClient } = require("./googleAuthService");

async function createGoogleMeet(formData) {
  const oauth2Client = await getAuthorizedClient();
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const meetingDateTime = new Date(formData.selectedDate);
  const endDateTime = new Date(meetingDateTime.getTime() + 60 * 60 * 1000);

  const event = {
    summary: `Shipping Consultation - ${formData.userName}`,
    description: `Shipping Consultation with ${formData.userName} (${formData.userEmail})`,
    start: {
      dateTime: meetingDateTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "UTC",
    },
    attendees: [
      {
        email: process.env.ADMIN_EMAIL, // ✅ Only Admin invited
        responseStatus: "accepted",
      },
      // ❌ Do not add user here → they will "ask to join"
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: "all", // ensures admin gets official calendar invite
  });

  return response.data;
}

module.exports = { createGoogleMeet };
