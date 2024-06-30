import { useState, useEffect } from "react";
import useAudioRecorder from "../../../../hooks/media/useAudioRecorder";
import LoadingIndicator from "../../../general/LoadingIndicator";
import { AiOutlineAudio, AiOutlinePause, AiOutlineStop } from "react-icons/ai";
import React from "react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, metadata: any) => void;
}

const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [duration, setDuration] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onRecordingError = (error?: Error | string) => {
    if (error) {
      alert(`AudioRecorder Error: ${error.toString()}`);
    }
  };

  const { startRecording, stopRecording, isRecording, microphoneSource, microphoneSources, handleMicrophoneSourceChange } = useAudioRecorder({
    onRecordingComplete,
    onRecordingError,
  });

  useEffect(() => {
    if (isRecording && timer === null) {
      setTimer(setInterval(() => setDuration((prevDuration) => prevDuration + 1), 1000));
    } else if (!isRecording && timer !== null) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [isRecording, timer]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-4 p-4 border border-gray-200 rounded-lg shadow'>
      {loading ? (
        <LoadingIndicator text='Recording...' className='text-blue-500' />
      ) : (
        <div className='space-y-4'>
          <div className='flex space-x-2'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <AiOutlinePause className='mr-2' /> : <AiOutlineAudio className='mr-2' />}
              {isRecording ? "Pause" : "Record"}
            </button>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'
              onClick={stopRecording}
              disabled={!isRecording}
            >
              <AiOutlineStop className='mr-2' />
              Stop
            </button>
          </div>
          <span className='text-lg font-semibold'>{formatDuration(duration)}</span>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Microphone:</span>
            <select
              className='form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
              value={microphoneSource?.deviceId || ""}
              onChange={(e) => {
                const selectedDevice = microphoneSources.find((device) => device.deviceId === e.target.value);
                if (selectedDevice) {
                  handleMicrophoneSourceChange(selectedDevice);
                }
              }}
            >
              {microphoneSources.map((source) => (
                <option key={source.deviceId} value={source.deviceId}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
