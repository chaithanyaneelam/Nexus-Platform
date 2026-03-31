import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: process.env.NEXSKILL_ADMIN_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export const createInstantMeet = async (
  courseName: string,
  teacherEmail: string,
) => {
  const event = {
    summary: `${courseName} Live Class`,
    description: `Instant live class for ${courseName}, hosted by ${teacherEmail}`,
    start: {
      // Started right now
      dateTime: new Date().toISOString(),
      timeZone: "UTC",
    },
    end: {
      // Ends in 1 hour
      dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      timeZone: "UTC",
    },
    attendees: [
      {
        email: teacherEmail,
        responseStatus: "accepted",
      },
    ],
    guestsCanModify: true,
    conferenceData: {
      createRequest: {
        // generate a random unique requestId
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: event,
  });

  return response.data.hangoutLink;
};
