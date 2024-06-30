import fs from "fs";
import path from "path";
import { ipcMain } from "electron";
import ENDPOINTS from "../../shared/config/endpoints";
import FileSystemAdapter from "../adapters/local/FileSystemAdapter";

const writeDataToFile = async (data: string, extension: string, mimeType: string) => {
  if (typeof data !== "string") {
    throw new Error("Invalid data type, expected base64 string");
  }
  const filename = `${mimeType}_${Date.now()}${extension}`;
  const filepath = path.join(process.env.TMP_DIR || "./", filename);
  await FileSystemAdapter.writeBase64File(filepath, data);
  return filepath;
};

const registerFileIoEndpoints = () => {
  ipcMain.handle(ENDPOINTS.FILE_IO.AUDIO.wav.write, async (event, args) => {
    return writeDataToFile(args.data, ".wav", "audio");
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.AUDIO.mp3.write, async (event, args) => {
    return writeDataToFile(args.data, ".mp3", "audio");
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.VIDEO.mp4.write, async (event, args) => {
    return writeDataToFile(args.data, ".mp4", "video");
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.VIDEO.mkv.write, async (event, args) => {
    return writeDataToFile(args.data, ".mkv", "video");
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.IMAGE.png.write, async (event, args) => {
    return writeDataToFile(args.data, ".png", "image");
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.IMAGE.jpg.write, async (event, args) => {
    return writeDataToFile(args.data, ".jpg", "image");
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.TEXT.txt.write, async (event, args) => {
    return writeDataToFile(args.data, ".txt", "text");
  });

  ipcMain.on(ENDPOINTS.FILE_IO.VIDEO.stream, async (event, args) => {
    const { path: filepath, request_id } = args;
    const stream = fs.createReadStream(filepath);

    stream.on("data", (chunk) => {
      event.sender.send(`${ENDPOINTS.FILE_IO.VIDEO.on_stream_chunk}-${request_id}`, chunk);
    });
    stream.on("end", () => {
      event.sender.send(`${ENDPOINTS.FILE_IO.VIDEO.on_stream_end}-${request_id}`);
    });
    stream.on("error", (error) => {
      event.sender.send(`${ENDPOINTS.FILE_IO.VIDEO.on_stream_error}-${request_id}`, error);
    });
  });

  ipcMain.handle(ENDPOINTS.FILE_IO.IMAGE.read, async (event, args) => {
    const { path } = args;

    if (!fs.existsSync(path)) {
      throw new Error("File not found");
    }
    const buffer = fs.readFileSync(path);
    return buffer;
  });
};

export default registerFileIoEndpoints;
