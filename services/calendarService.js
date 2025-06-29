const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function createGoogleMeet(formData) {
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
  });

  return response.data;
}


module.exports = { createGoogleMeet };
