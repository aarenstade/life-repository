import { useState, useCallback } from "react";
import { Audio } from "expo-av";

const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [permissionResponse, setPermissionResponse] = useState<Audio.PermissionResponse | null>(null);
  const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

  const requestPermission = useCallback(async () => {
    const response = await Audio.requestPermissionsAsync();
    setPermissionResponse(response);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!permissionResponse || permissionResponse.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsPaused(false);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }, [permissionResponse, requestPermission]);

  const pauseRecording = useCallback(async () => {
    if (recording && !isPaused) {
      await recording.pauseAsync();
      setIsPaused(true);
    }
  }, [recording, isPaused]);

  const resumeRecording = useCallback(async () => {
    if (recording && isPaused) {
      await recording.startAsync(); // Expo documentation does not specify a resume method, startAsync is used for resuming as well.
      setIsPaused(false);
    }
  }, [recording, isPaused]);

  const stopRecording = useCallback(async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      setRecording(null);
      setIsPaused(false);
    }
  }, [recording]);

  const getRecordingUri = useCallback(() => {
    return recording?.getURI() ?? null;
  }, [recording]);

  return {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    recording,
    isPaused,
    requestPermission,
    permissionResponse,
    getRecordingUri,
  };
};

export default useAudioRecorder;
