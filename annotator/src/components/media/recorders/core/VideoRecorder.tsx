import React, { useState, useRef, useEffect } from "react";
import { BsFillRecordFill, BsFillStopFill } from "react-icons/bs";
import { MdReplay, MdCheckCircle } from "react-icons/md";

interface VideoRecorderProps {
  onVideoComplete: (videoBlob: Blob, metadata: any) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      setRecordingStartTime(Date.now());
      interval = setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      const audioDevices = devices.filter((device) => device.kind === "audioinput");
      setDevices(devices);
      if (videoDevices.length > 0) {
        setSelectedVideoDeviceId(videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0) {
        setSelectedAudioDeviceId(audioDevices[0].deviceId);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedVideoDeviceId) {
      updateVideoStream(selectedVideoDeviceId, selectedAudioDeviceId);
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId]);

  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoBlob]);

  const updateVideoStream = async (videoDeviceId: string, audioDeviceId: string) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined },
        audio: { deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    }
  };

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined },
        audio: { deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        setVideoBlob(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsRecording(false);
      const duration = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : recordingSeconds;
      setRecordingSeconds(duration);
      setRecordingStartTime(null);
    }
  };

  const resetRecording = () => {
    setVideoBlob(null);
    setVideoUrl(null);
    setRecordingSeconds(0);
    setRecordingStartTime(null);
  };

  const handleDone = () => {
    if (videoBlob) {
      const metadata = { duration: recordingSeconds };
      onVideoComplete(videoBlob, metadata);
      resetRecording();
    }
  };

  const handleVideoDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value;
    setSelectedVideoDeviceId(deviceId);
    updateVideoStream(deviceId, selectedAudioDeviceId);
  };

  const handleAudioDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value;
    setSelectedAudioDeviceId(deviceId);
    updateVideoStream(selectedVideoDeviceId, deviceId);
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex justify-center space-x-4 w-full mb-4'>
        <div className='flex flex-col'>
          <label htmlFor='videoDevices' className='text-sm mb-1 text-gray-500'>
            Video
          </label>
          <select id='videoDevices' onChange={handleVideoDeviceChange} value={selectedVideoDeviceId} className='p-1 rounded bg-gray-800 text-white text-sm'>
            {devices
              .filter((device) => device.kind === "videoinput")
              .map((device) => (
                <option key={device.deviceId} value={device.deviceId} className='bg-gray-800 text-white'>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
          </select>
        </div>
        <div className='flex flex-col'>
          <label htmlFor='audioDevices' className='text-sm mb-1 text-gray-500'>
            Audio
          </label>
          <select id='audioDevices' onChange={handleAudioDeviceChange} value={selectedAudioDeviceId} className='p-1 rounded bg-gray-800 text-white text-sm'>
            {devices
              .filter((device) => device.kind === "audioinput")
              .map((device) => (
                <option key={device.deviceId} value={device.deviceId} className='bg-gray-800 text-white'>
                  {device.label || `Microphone ${device.deviceId}`}
                </option>
              ))}
          </select>
        </div>
      </div>
      {!videoBlob && <video ref={videoRef} className='w-full h-auto bg-black' autoPlay playsInline muted />}
      {videoUrl && <video src={videoUrl} className='w-full h-auto bg-black' controls />}
      <div className='flex justify-center space-x-4 my-4'>
        {!isRecording && !videoBlob && (
          <button onClick={startRecording} className='p-2 rounded bg-red-500 hover:bg-red-400'>
            <BsFillRecordFill className='text-xl' />
          </button>
        )}
        {isRecording && (
          <>
            <span className='p-2 rounded text-white'>{recordingSeconds} seconds</span>
            <button onClick={stopRecording} className='p-2 rounded text-white'>
              <BsFillStopFill className='text-xl' />
            </button>
          </>
        )}
        {videoBlob && (
          <>
            <button onClick={resetRecording} className='p-2 rounded bg-yellow-500 hover:bg-yellow-400'>
              <MdReplay className='text-xl' />
            </button>
            <button onClick={handleDone} className='p-2 rounded bg-blue-500 hover:bg-blue-400'>
              <MdCheckCircle className='text-xl' />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
