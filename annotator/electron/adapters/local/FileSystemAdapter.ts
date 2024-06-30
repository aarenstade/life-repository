import fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

type FileContent = Buffer | string;

class FileSystemAdapter {
  public static async readFile(filePath: string): Promise<FileContent> {
    return readFileAsync(filePath, "utf8");
  }

  public static async writeBase64File(filePath: string, base64Data: string): Promise<void> {
    const base64String = base64Data.replace(/^data:.+;base64,/, "");
    const buffer = Buffer.from(base64String, "base64");
    await writeFileAsync(filePath, buffer);
  }

  public static async writeFile(filePath: string, content: FileContent): Promise<void> {
    await writeFileAsync(filePath, content);
  }

  public static async deleteFile(filePath: string): Promise<void> {
    await unlinkAsync(filePath);
  }

  public static async listFiles(directoryPath: string): Promise<string[]> {
    return readdirAsync(directoryPath);
  }

  public static async getFileStats(filePath: string): Promise<fs.Stats> {
    return statAsync(filePath);
  }

  public static async exists(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
  }

  public static async createDirectory(directoryPath: string): Promise<void> {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  public static async deleteDirectory(directoryPath: string): Promise<void> {
    if (fs.existsSync(directoryPath)) {
      fs.rmdirSync(directoryPath, { recursive: true });
    }
  }
}

export default FileSystemAdapter;
