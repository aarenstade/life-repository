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
      const transcription = await transcribeRecording(uri);
      onTranscriptionComplete(transcription || "");
      setIsLoading(false);
    } else {
      await startRecording();
    }
  };

  return (
    <View>
      {isLoading ? (
        <Feather name='loader' size={18} />
      ) : recording && !isPaused ? (
        <TouchableOpacity onPress={handleRecord}>
          <Feather name='mic' size={18} color={"red"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleRecord}>
          <Feather name='mic' size={18} color='blue' />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RecordIcon;
