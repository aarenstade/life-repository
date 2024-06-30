import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { ipcMain } from "electron";
import ENDPOINTS from "../../shared/config/endpoints";
import FileSystemAdapter from "../adapters/local/FileSystemAdapter";
import TranscriptionAdapter from "../adapters/external/deepgram";

const registerProcessingEndpoints = () => {
  ipcMain.handle(ENDPOINTS.PROCESSING.VIDEO.CONVERT.to_proxy, async (event, args) => {
    const { path: videoPath } = args;
    const escapedVideoPath = videoPath.split(" ").join("\\ ");
    const outputFilename = `proxy_${Date.now()}.mp4`;
    const outputFilePath = path.join(process.env.TMP_DIR || "./", outputFilename);
    const escapedOutputFilePath = outputFilePath.split(" ").join("\\ ");

    const command = `yes | ffmpeg -i ${escapedVideoPath} -c:v libx264 -profile:v high -c:a aac -b:a 128k -ar 44100 -vsync 1 -r 30 -preset ultrafast -tune fastdecode -x264-params keyint=1 -pix_fmt yuv420p ${escapedOutputFilePath}`;
    try {
      execSync(command);
      if (fs.existsSync(outputFilePath)) {
        return outputFilePath;
      } else {
        throw new Error("Proxy file not found");
      }
    } catch (error) {
      console.error("Error creating video proxy:", error);
      return { error: "Error creating video proxy" };
    }
  });

  ipcMain.handle(ENDPOINTS.PROCESSING.VIDEO.CONVERT.to_mp4, async (event, args) => {
    const { path: videoPath } = args;

    const newFilename = `video_${Date.now()}.mp4`;
    const newFilepath = path.join(process.env.TMP_DIR || "./", newFilename);

    const escapedFilepath = videoPath.split(" ").join("\\ ");

    const command = `ffmpeg -i ${escapedFilepath} -c:v libx264 -c:a aac ${newFilepath}`;
    execSync(command);

    if (fs.existsSync(newFilepath)) {
      await FileSystemAdapter.deleteFile(videoPath);
      return newFilepath;
    }

    return { error: "Video file not found" };
  });

  ipcMain.handle(ENDPOINTS.PROCESSING.TRANSCRIBE.video_path, async (event, args) => {
    const { path } = args;

    console.log("Transcribing video path", path);

    const audioPath = path.replace(".mp4", ".wav").replaceAll(" ", "_");
    const escapedAudioPath = audioPath.split(" ").join("\\ ");
    const escapedVideoPath = path.split(" ").join("\\ ");
    const command = `yes | ffmpeg -i ${escapedVideoPath} -vn -acodec pcm_s16le -ar 44100 -ac 2 ${escapedAudioPath}`;
    execSync(command);

    if (fs.existsSync(audioPath)) {
      const transcription = await new TranscriptionAdapter().transcribeFile(audioPath);
      await FileSystemAdapter.deleteFile(audioPath);
      return transcription;
    }

    return { error: "Audio file not found" };
  });

  ipcMain.handle(ENDPOINTS.PROCESSING.TRANSCRIBE.audio_path, async (event, args) => {
    const { path } = args;
    const transcription = await new TranscriptionAdapter().transcribeFile(path);
    await FileSystemAdapter.deleteFile(path);
    return transcription;
  });
};

export default registerProcessingEndpoints;
