import { FC, useState } from "react";
import AudioRecorder from "./core/AudioRecorder";
import { MediaTranscriptionCompletion } from "../../../types/media";
import TranscriptionService from "../../../services/transcription/TranscriptionService";
import React from "react";

interface TranscriptionAudioRecorderProps {
  onComplete: (data: MediaTranscriptionCompletion) => void;
}

const TranscriptionAudioRecorder: FC<TranscriptionAudioRecorderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onRecordingComplete = async (audioBlob: Blob, metadata: any) => {
    setLoading(true);

    let res = await TranscriptionService.transcribeAudioBlob(audioBlob);

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

  return <AudioRecorder onRecordingComplete={onRecordingComplete} />;
};

export default TranscriptionAudioRecorder;
