import { MediaTranscriptionCompletion } from "../../types/media";
import { ipcRenderer } from "electron";
import { blobToBase64 } from "../../../shared/utilities/general";
import ENDPOINTS from "../../../shared/config/endpoints";
import { GAP_WORD_CONSTANT } from "../../../shared/config/general";

class TranscriptionService {
  static processTranscriptData = (transcriptData: any) => {
    const words = transcriptData.result.results.channels[0].alternatives[0].words || [];
    if (!words) return transcriptData;
    const gaps = [];
    if (words.length > 0 && words[0].start > 0.1) {
      gaps.push({
        word: GAP_WORD_CONSTANT,
        start: 0,
        end: words[0].start,
      });
    }
    for (let i = 0; i < words.length - 1; i++) {
      const currentWordEnd = words[i].end;
      const nextWordStart = words[i + 1].start;
      if (nextWordStart - currentWordEnd > 0.1) {
        gaps.push({
          word: GAP_WORD_CONSTANT,
          start: currentWordEnd,
          end: nextWordStart,
        });
      }
    }
    const wordsWithGaps = [...gaps, ...words].sort((a, b) => a.start - b.start);
    transcriptData.result.results.channels[0].alternatives[0].words = wordsWithGaps;
    return transcriptData;
  };

  static async transcribeAudioPath(audioPath: string): Promise<MediaTranscriptionCompletion> {
    const res = await ipcRenderer.invoke(ENDPOINTS.PROCESSING.TRANSCRIBE.audio_path, { path: audioPath });
    return { media: { path: audioPath }, transcript_data: TranscriptionService.processTranscriptData(res) };
  }

  static async transcribeVideoPath(videoPath: string): Promise<MediaTranscriptionCompletion> {
    const res = await ipcRenderer.invoke(ENDPOINTS.PROCESSING.TRANSCRIBE.video_path, { path: videoPath });
    return { media: { path: videoPath }, transcript_data: TranscriptionService.processTranscriptData(res) };
  }

  static async transcribeAudioBlob(audioBlob: Blob): Promise<MediaTranscriptionCompletion> {
    const data = await blobToBase64(audioBlob);
    if (!data) return { errors: ["Failed to convert audio blob to base64"], media: { path: "" } };

    const path = await ipcRenderer.invoke(ENDPOINTS.FILE_IO.AUDIO.wav.write, { data });
    if (!path) return { errors: ["Failed to write audio base64 data to disk"], media: { path: "" } };

    const res = await ipcRenderer.invoke(ENDPOINTS.PROCESSING.TRANSCRIBE.audio_path, { path });
    return { media: { path }, transcript_data: TranscriptionService.processTranscriptData(res) };
  }

  static async transcribeVideoBlob(videoBlob: Blob): Promise<MediaTranscriptionCompletion> {
    const data = await blobToBase64(videoBlob);
    if (!data) return { errors: ["Failed to convert video blob to base64"], media: { path: "" } };

    const path = await ipcRenderer.invoke(ENDPOINTS.FILE_IO.VIDEO.mp4.write, { data });
    if (!path) return { errors: ["Failed to write video base64 data to disk"], media: { path: "" } };

    const res = await ipcRenderer.invoke(ENDPOINTS.PROCESSING.TRANSCRIBE.video_path, { path });
    return { media: { path }, transcript_data: TranscriptionService.processTranscriptData(res) };
  }
}

export default TranscriptionService;
