// services/googleMeetService.js
const { google } = require("googleapis");
const { getAuthorizedClient } = require("./googleAuthService");

async function createGoogleMeet(formData) {
  let oauth2Client = await getAuthorizedClient();
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
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    // Try inserting event
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    return response.data;
  } catch (err) {
    console.error("❌ Error creating Google Meet event:", err.message);

    // Retry once if token expired
    if (err.code === 401 || err.code === 403) {
      console.log("⚠️ Token expired. Retrying with refreshed token...");
      oauth2Client = await getAuthorizedClient(); // get fresh client
      const retryResponse = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
      });
      return retryResponse.data;
    }

    throw err; // rethrow if it's another error
  }
}

module.exports = { createGoogleMeet };
