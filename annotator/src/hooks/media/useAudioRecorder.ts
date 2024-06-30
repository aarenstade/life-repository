import { useEffect, useRef, useState } from "react";

interface UseAudioRecorderHookProps {
  onRecordingComplete: (audioBlob: Blob, metadata: any) => void;
  onRecordingError: (error?: Error | string) => void;
}

const useAudioRecorder = ({ onRecordingComplete, onRecordingError }: UseAudioRecorderHookProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [microphoneSources, setMicrophoneSources] = useState<MediaDeviceInfo[]>([]);
  const [microphoneSource, setMicrophoneSource] = useState<MediaDeviceInfo | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const getMicrophones = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices.filter((device) => device.kind === "audioinput");
        if (microphones.length > 0) {
          setMicrophoneSources(microphones);
        }
      } catch (error) {
        console.error("Error enumerating audio devices:", error);
      }
    };

    const interval = setInterval(() => {
      if (!isRecording) getMicrophones().then();
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: microphoneSource?.deviceId ? { exact: microphoneSource.deviceId } : undefined,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaRecorder.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = completeRecording;

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      onRecordingError();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.pause();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.resume();
    }
  };

  const completeRecording = () => {
    const audioBlob = new Blob(recordedChunks.current, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.onloadedmetadata = () => {
      if (audio.duration === Infinity) {
        audio.currentTime = Number.MAX_SAFE_INTEGER;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          const duration = audio.duration;
          onRecordingComplete(audioBlob, { duration });
          URL.revokeObjectURL(audioUrl);
          resetRecording();
        };
      } else {
        const duration = audio.duration;
        onRecordingComplete(audioBlob, { duration });
        URL.revokeObjectURL(audioUrl);
        resetRecording();
      }
    };

    audio.onerror = (error) => {
      onRecordingError(error.toString());
      resetRecording();
    };
  };

  const resetRecording = () => {
    setIsRecording(false);
    recordedChunks.current = [];
    if (mediaRecorder.current) {
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder.current = null;
    }
  };

  const handleMicrophoneSourceChange = (source: MediaDeviceInfo) => {
    setMicrophoneSource(source);
  };

  return {
    isRecording,
    microphoneSources,
    microphoneSource,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    handleMicrophoneSourceChange,
  };
};

export default useAudioRecorder;
