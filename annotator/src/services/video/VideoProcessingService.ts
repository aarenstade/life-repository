import { ipcRenderer } from "electron";
import ENDPOINTS from "../../../shared/config/endpoints";

class VideoProcessingService {
  static async createVideoProxy(videoPath: string): Promise<string | null> {
    const res = await ipcRenderer.invoke(ENDPOINTS.PROCESSING.VIDEO.CONVERT.to_proxy, { path: videoPath });
    return res ? res : null;
  }
}

export default VideoProcessingService;
