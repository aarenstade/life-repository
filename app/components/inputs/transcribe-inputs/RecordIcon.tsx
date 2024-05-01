import { FC } from "react";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import useAudioRecorder from "../../../hooks/useAudioRecorder";
import { TouchableOpacity, View } from "react-native";
import { transcribeRecording } from "./transcribe-functions";

interface RecordIconProps {
  onTranscriptionComplete: (transcription: string) => void;
}

const RecordIcon: FC<RecordIconProps> = ({ onTranscriptionComplete }) => {
  const { startRecording, stopRecording, recording, isPaused, getRecordingUri } = useAudioRecorder();
  const [isLoading, setIsLoading] = useState(false);

  const handleRecord = async () => {
    if (recording) {
      setIsLoading(true);
      await stopRecording();
      const uri = getRecordingUri();
      try {
        const transcriptionResult = await transcribeRecording(uri);
        if (typeof transcriptionResult === "string") {
          onTranscriptionComplete(transcriptionResult);
        } else {
          console.error("Transcription error:", transcriptionResult.message);
          onTranscriptionComplete("");
        }
      } catch (error) {
        console.error("Error transcribing recording:", error);
        onTranscriptionComplete("");
      } finally {
        setIsLoading(false);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <View>
      {isLoading ? (
        <Feather name='loader' size={20} />
      ) : recording && !isPaused ? (
        <TouchableOpacity onPress={handleRecord}>
          <Feather name='mic' size={20} color={"red"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleRecord}>
          <Feather name='mic' size={20} color='blue' />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RecordIcon;
