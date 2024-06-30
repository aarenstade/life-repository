import { FC, useEffect, useState } from "react";
import useAudioRecorder from "../../hooks/media/useAudioRecorder";
import { PiWaveform } from "react-icons/pi";
import FlexibleTextarea from "./FlexibleTextArea";
import { MediaTranscriptionCompletion } from "../../types/media";
import TranscriptionService from "../../services/transcription/TranscriptionService";
import _ from "lodash";
import React from "react";

interface TranscribeTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onTranscriptionComplete?: (data: MediaTranscriptionCompletion) => void;
}

const TranscribeTextArea: FC<TranscribeTextAreaProps> = ({ value, onChange, onTranscriptionComplete }) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    value && onChange(value);
  }, [value]);

  const onRecordingComplete = async (audioBlob: Blob, metadata?: any) => {
    setLoading(true);
    await transcribe(audioBlob, metadata);
    setLoading(false);
  };

  const onRecordingError = (error?: string | Error) => {
    console.log(error);
  };

  const { startRecording, stopRecording, isRecording, microphoneSources, microphoneSource, handleMicrophoneSourceChange } = useAudioRecorder({
    onRecordingComplete,
    onRecordingError,
  });

  const transcribe = async (audioBlob: Blob, metadata?: any) => {
    let res = await TranscriptionService.transcribeAudioBlob(audioBlob);

    if (res && res.media.path) {
      res.media.metadata = metadata;
      res.media.audio_blob = audioBlob;
      const transcript = res.transcript_data.result.results.channels[0].alternatives[0].transcript;
      onChange(transcript);
      onTranscriptionComplete && onTranscriptionComplete(res);
    } else {
      console.error("Failed to transcribe audio blob");
      return;
    }
  };

  return (
    <div className='flex w-full h-full items-start justify-center space-x-2'>
      <FlexibleTextarea
        id='transcription'
        value={value || ""}
        onChange={onChange}
        placeholder='Write something...'
        loading={loading}
        button={
          <button
            className='p-1 w-[2.5rem] h-[2.5rem] flex text-lg items-center justify-center'
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <div className='animate-pulse h-3 w-3 bg-red-500 rounded-full' /> : <PiWaveform />}
          </button>
        }
      />
    </div>
  );
};

export default TranscribeTextArea;
