import { useState, useEffect, useRef } from "react";
import { View, Button, Alert, ActivityIndicator, Text, StyleSheet } from "react-native";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { Audio } from "expo-av";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, metadata: any) => void;
}

const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [duration, setDuration] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [playbackInstance, setPlaybackInstance] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = useState<number>(0);
  const { startRecording, stopRecording, pauseRecording, resumeRecording, recording, getRecordingUri } = useAudioRecorder();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    console.log(playbackDuration, playbackPosition);
  }, [playbackDuration, playbackPosition]);

  useEffect(() => {
    const updateDuration = () => setDuration((prevDuration) => prevDuration + 1);
    if (recording && !isPaused && timer === null) {
      setTimer(setInterval(updateDuration, 1000));
    } else if ((isPaused || !recording) && timer !== null) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [recording, isPaused, timer]);

  useEffect(() => {
    return playbackInstance
      ? () => {
          playbackInstance.unloadAsync();
        }
      : undefined;
  }, [playbackInstance]);

  useEffect(() => {
    if (playbackInstance && isPlaying) {
      const updatePosition = () => {
        playbackInstance.getStatusAsync().then((status) => {
          if (status.isLoaded && status.positionMillis) {
            setPlaybackPosition(status.positionMillis);
          }
        });
      };
      const positionTimer = setInterval(updatePosition, 1000);
      return () => clearInterval(positionTimer);
    }
  }, [playbackInstance, isPlaying]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleRecordingAction = async () => {
    if (!recording) {
      setLoading(true);
      await startRecording();
      setLoading(false);
    } else if (isPaused) {
      await resumeRecording();
      setIsPaused(false);
    } else {
      await pauseRecording();
      setIsPaused(true);
    }
  };

  const handleStopRecording = async () => {
    Alert.alert("Finish Recording", "Are you sure you want to finish the recording?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          setLoading(true);
          await stopRecording();
          setDuration(0);
          setIsPaused(false);
          const uri = getRecordingUri();
          if (uri) {
            const blob = await audioUriToBlob(uri);
            console.log(blob);
            if (blob) setBlob(blob);
            const { sound, status } = await Audio.Sound.createAsync({ uri });
            console.log(uri);
            setPlaybackInstance(sound);
            if ("durationMillis" in status) {
              setPlaybackDuration(status.durationMillis);
              onRecordingComplete(new Blob(), { uri, duration: status.durationMillis });
            } else {
              setPlaybackDuration(0);
              onRecordingComplete(new Blob(), { uri, duration: 0 });
            }
          }
          setLoading(false);
        },
      },
    ]);
  };

  const handleReset = async () => {
    if (recording) {
      await stopRecording();
    }
    if (playbackInstance) {
      setPlaybackInstance(null);
    }

    setDuration(0);
    setIsPaused(false);
    setPlaybackPosition(0);
    setPlaybackDuration(0);
  };

  const handlePlayPauseToggle = async () => {
    if (playbackInstance) {
      if (isPlaying) {
        await playbackInstance.pauseAsync();
        setIsPlaying(false);
      } else {
        await playbackInstance.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const audioUriToBlob = async (uri: string): Promise<Blob | null> => {
    try {
      const blob = (await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error:", error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      })) as Blob;
      return blob;
    } catch (error) {
      console.log("error:", error);
      return null;
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderColor: "#e2e8f0",
      borderWidth: 1,
      borderRadius: 8,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowColor: "#000",
      shadowOffset: { height: 0, width: 0 },
      margin: 4,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 4,
    },
    text: {
      fontSize: 18,
      fontWeight: "bold",
      margin: 4,
    },
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <View style={{ margin: 4 }}>
          <View style={styles.buttonContainer}>
            {!recording && <Button title='Record' onPress={handleRecordingAction} color='green' />}
            {recording && <Button title={isPaused ? "Resume" : "Pause"} onPress={handleRecordingAction} color={isPaused ? "green" : "blue"} />}
            <Button title='Stop' onPress={handleStopRecording} disabled={!recording} color='red' />
            <Button title='Reset' onPress={handleReset} color='grey' />
          </View>
          <Text style={styles.text}>{formatDuration(duration)}</Text>
          {playbackInstance && (
            <>
              <Button title={isPlaying ? "Pause" : "Play"} onPress={handlePlayPauseToggle} />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default AudioRecorder;
