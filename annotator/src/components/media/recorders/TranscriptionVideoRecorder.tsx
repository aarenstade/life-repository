import { FC, useState } from "react";
import VideoRecorder from "./core/VideoRecorder";
import { MediaTranscriptionCompletion } from "../../../types/media";
import TranscriptionService from "../../../services/transcription/TranscriptionService";
import { ipcRenderer } from "electron";
import ENDPOINTS from "../../../../shared/config/endpoints";
import { blobToBase64 } from "../../../../shared/utilities/general";
import React from "react";

interface TranscriptionVideoRecorderProps {
  onComplete: (data: MediaTranscriptionCompletion) => void;
}

const TranscriptionVideoRecorder: FC<TranscriptionVideoRecorderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onRecordingComplete = async (videoBlob: Blob, metadata: any) => {
    setLoading(true);

    const base64Data = await blobToBase64(videoBlob);
    if (!base64Data) return;

    const mkvPath = await ipcRenderer.invoke(ENDPOINTS.FILE_IO.VIDEO.mkv.write, { data: base64Data });
    const path = await ipcRenderer.invoke(ENDPOINTS.PROCESSING.VIDEO.CONVERT.to_mp4, { path: mkvPath });
    if (!path) return;

    let res = await TranscriptionService.transcribeVideoPath(path);

    if (res.errors) {
      console.error(res.errors);
      return;
    }

    res.media.metadata = { ...(res.media.metadata || {}), ...metadata };
    onComplete(res);
    setLoading(false);
  };

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center space-y-4 p-4 border border-gray-200 rounded-lg shadow'>
        <div className='flex space-x-2'>
          <div className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
            <span className='mr-2'>Transcribing...</span>
          </div>
        </div>
      </div>
    );

  return <VideoRecorder onVideoComplete={onRecordingComplete} />;
};

export default TranscriptionVideoRecorder;
