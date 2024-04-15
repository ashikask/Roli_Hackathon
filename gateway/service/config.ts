import {
  Endpoint,
  Session,
  createSession,
  getModel,
  Program,
  Prompt,
  ChatModelResponse,
  Instruction,
  Step,
  postHttp,
  getHttp,
  HttpResponse,
} from "./roli-runtime";

const YOUR_API_KEY = "e87c6067b9d345c08166ce56e842f0b6";
const FILE_URL =
  "https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3";
const TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript";
const API_URL = "https://transcribe.whisperapi.com";
const API_KEY = "UMWMY2QV7D5EJG8SP8ME4U7ZJBJPTDII";

export class GatewayApi extends Endpoint {
  constructor(primaryKey: string) {
    super(primaryKey);
  }

  getSession(userName: string): GatewaySession {
    const session = createSession(GatewaySession);
    session.userName = userName;
    return session;
  }
}

export class GatewaySession extends Session {
  userName: string | null;
  private _history: Instruction[];

  constructor(sessionId: string) {
    super(sessionId);
    this.userName = null;
    this._history = [];
  }

  async tell(message: string): Promise<string> {
    return this.transcribeAudio(FILE_URL); // Handle direct YouTube link or audio file URL
  }

  private async submitTranscription(audioUrl: string): Promise<string> {
    const headers = {
      Authorization: `${YOUR_API_KEY}`,
      "Content-Type": "application/json",
    };

    const body = {
      audio_url: audioUrl,
    };

    try {
      const response: HttpResponse = await postHttp(
        TRANSCRIPT_ENDPOINT,
        { audio_url: audioUrl },
        { headers }
      );
      // const response: HttpResponse = await getHttp(url);
      if (response.status === 200 && response.data) {
        const transcriptData = response.data as { id: string }; // Assuming response.data contains an ID
        return this.pollForTranscription(transcriptData.id); // Polling for the result
      } else {
        throw new Error(
          `Failed to submit audio for transcription. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(
        "Error in transcribing video:",
        JSON.stringify(error, null, 2)
      );

      return "Error processing your request.";
    }
  }
  private async pollForTranscription(transcriptId: string): Promise<string> {
    // Polling logic here
    // This is a simplified version of the polling mechanism
    let attempts = 0;
    while (attempts < 5) {
      // Limit the number of attempts
      const response: HttpResponse = await postHttp(
        `${TRANSCRIPT_ENDPOINT}/${transcriptId}`,
        "", // No body needed for GET request
        { headers: { authorization: YOUR_API_KEY } }
      );

      if (response.status === 200 && response.data) {
        const transcriptData = response.data as {
          status: string;
          transcript: string;
        };
        if (transcriptData.status === "completed") {
          return transcriptData.transcript;
        } else if (transcriptData.status === "error") {
          throw new Error("Error during transcription.");
        }
      } else {
        throw new Error(
          `Failed to retrieve transcription. Status: ${response.status}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before next attempt
      attempts++;
    }
    throw new Error("Transcription did not complete in the allotted time.");
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    const body = {
      url: audioUrl, // URL to the audio file
      diarization: false,
      numSpeakers: 2,
      fileType: "mp3", // Adjust as necessary
      language: "en",
      task: "transcribe",
      callbackURL: "",
    };

    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "multipart/form-data",
      "Content-Length": JSON.stringify(body).length.toString(),
    };

    try {
      const response: HttpResponse = await postHttp(`${API_URL}`, body, {
        headers,
      });

      if (response.status === 200 && response.data) {
        const transcriptData = response.data as { transcript: string };
        return transcriptData.transcript; // Assuming 'transcript' is the key in the response JSON
      } else {
        throw new Error(
          `Failed to transcribe audio. Status: ${response.status}, Message: ${response.data}`
        );
      }
    } catch (error) {
      console.error(
        "Error in transcribing video:",
        JSON.stringify(error, null, 2)
      );
      return "Error processing your request.";
    }
  }
}
