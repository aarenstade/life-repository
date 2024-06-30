import fs from "fs";
import { createClient } from "@deepgram/sdk";

class TranscriptionAdapter {
  private deepgram: any;

  constructor() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    this.deepgram = createClient(apiKey || "");
  }

  async transcribeFile(filePath: string) {
    try {
      const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(fs.readFileSync(filePath), {
        model: "nova-2",
        punctuate: "true",
        smart_format: true,
      });
      return { result, error };
    } catch (error) {
      return { error };
    }
  }
}

export default TranscriptionAdapter;
