import { google } from "googleapis";

// Validate credentials on service startup
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.NEXSKILL_ADMIN_REFRESH_TOKEN
) {
  console.warn(
    "⚠️  Google API credentials are not fully configured in environment variables.",
  );
  console.warn(
    "Expected env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXSKILL_ADMIN_REFRESH_TOKEN",
  );
}

// Create OAuth2 client with proper configuration
const createOAuth2Client = () => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback",
  );

  client.setCredentials({
    refresh_token: process.env.NEXSKILL_ADMIN_REFRESH_TOKEN,
  });

  return client;
};

let oauth2Client = createOAuth2Client();

// Helper function to get fresh OAuth2 client with refreshed token
const getFreshAuthClient = async () => {
  try {
    const client = createOAuth2Client();

    // Request the necessary scopes
    const { credentials } = await client.refreshAccessToken();
    client.setCredentials(credentials);
    console.log("✅ Access token refreshed with scopes");
    return client;
  } catch (error: any) {
    console.error("❌ Failed to refresh access token:", error.message);
    throw new Error(
      `Authentication failed: ${error.message || "Unable to refresh token"}`,
    );
  }
};

const meet = google.meet({ version: "v2", auth: oauth2Client });
const drive = google.drive({ version: "v3", auth: oauth2Client });

export const createClassSpace = async () => {
  try {
    // Get fresh auth client with valid access token
    const authClient = await getFreshAuthClient();

    const meet = google.meet({ version: "v2", auth: authClient });

    let response;
    try {
      response = await meet.spaces.create({
        requestBody: {
          config: {
            accessType: "OPEN",
            artifactConfig: {
              recordingConfig: {
                autoRecordingGeneration: "ON",
              },
            },
          },
        },
      });
    } catch (apiError: any) {
      if (
        apiError.message &&
        apiError.message.includes(
          "updateAutoRecordingGeneration is not available",
        )
      ) {
        console.warn(
          "⚠️ Auto-recording not available for this account. Creating standard space instead.",
        );
        response = await meet.spaces.create({
          requestBody: {
            config: {
              accessType: "OPEN",
            },
          },
        });
      } else {
        throw apiError;
      }
    }

    if (!response.data.meetingUri) {
      throw new Error("No meetingUri returned from Google Meet API");
    }

    console.log(
      "✅ Google Meet space created successfully:",
      response.data.meetingUri,
    );

    return {
      meetingUri: response.data.meetingUri,
      meetingId: response.data.name?.split("/")[1], // 'spaces/xyz' -> 'xyz'
    };
  } catch (error: any) {
    console.error("❌ Error creating class space:", error.message);
    console.error("Full error:", error);
    throw new Error(
      `Failed to create Google Meet: ${error.message || "Unknown error"}`,
    );
  }
};

export const moveRecordingToNexskill = async (conferenceId: string) => {
  try {
    // Get fresh auth client with valid access token
    const authClient = await getFreshAuthClient();

    const drive = google.drive({ version: "v3", auth: authClient });

    // 1. Find or create 'nexskill' folder in root
    let nexskillFolderId = "";
    const folderQuery = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and name='nexskill' and trashed=false",
      fields: "files(id, name)",
    });

    if (folderQuery.data.files && folderQuery.data.files.length > 0) {
      nexskillFolderId = folderQuery.data.files[0].id!;
    } else {
      const folderMetadata = {
        name: "nexskill",
        mimeType: "application/vnd.google-apps.folder",
      };
      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: "id",
      });
      nexskillFolderId = folder.data.id!;
    }

    // 2. Locate recording in 'Meet Recordings' matching conferenceId
    // Google Meet recordings typically contain the meeting code in the file name or properties
    // We'll search for files containing the conferenceId in the title
    const recordingQuery = await drive.files.list({
      q: `mimeType='video/mp4' and name contains '${conferenceId}' and trashed=false`, // Adjust if necessary
      fields: "files(id, name, parents)",
    });

    const recordings = recordingQuery.data.files;
    if (!recordings || recordings.length === 0) {
      console.log(`No recordings found for meeting: ${conferenceId}`);
      return;
    }

    // Move the files
    for (const file of recordings) {
      if (file.id) {
        const previousParents = file.parents ? file.parents.join(",") : "";
        await drive.files.update({
          fileId: file.id,
          addParents: nexskillFolderId,
          removeParents: previousParents,
          fields: "id, parents",
        });
        console.log(`Moved recording ${file.name} to nexskill folder.`);
      }
    }
  } catch (error) {
    console.error("Error moving recording:", error);
    throw error;
  }
};
