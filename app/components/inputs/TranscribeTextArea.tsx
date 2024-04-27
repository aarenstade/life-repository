import { FC } from "react";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import useConfigStore from "../../state/config";

interface RecordIconProps {
  onTranscriptionComplete: (transcription: string) => void;
}

const RecordIcon: FC<RecordIconProps> = ({ onTranscriptionComplete }) => {
  const api_url = useConfigStore((state) => state.api_url);
  const { startRecording, stopRecording, recording, isPaused, getRecordingUri } = useAudioRecorder();
  const [isLoading, setIsLoading] = useState(false);

  const transcribeRecording = async () => {
    const uri = getRecordingUri();
    if (!uri) return "";

    let apiUrl = new URL("transcribe/audio", api_url);
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    // @ts-ignore
    formData.append("file", {
      uri,
      name: `recording_${Date.now()}.${fileType}`,
      type: `audio/x-${fileType}`,
    });

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error("Failed to transcribe audio");
    }

    const data = await response.json();
    if ("text" in data) {
      return data["text"];
    } else {
      throw new Error("Failed to transcribe audio");
    }
  };

  const handleRecord = async () => {
    if (recording) {
      setIsLoading(true);
      await stopRecording();
      const transcription = await transcribeRecording();
      onTranscriptionComplete(transcription || "");
      setIsLoading(false);
    } else {
      await startRecording();
    }
  };

  return (
    <View>
      {isLoading ? (
        <Feather name='loader' size={24} style={styles.iconLoading} />
      ) : recording && !isPaused ? (
        <TouchableOpacity onPress={handleRecord}>
          <Feather name='mic' size={24} color={"red"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleRecord}>
          <Feather name='mic' size={24} color='blue' />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface TranscribeTextAreaProps {
  initialText?: string;
}

const TranscribeTextArea: FC<TranscribeTextAreaProps> = ({ initialText }) => {
  const [value, setValue] = useState(initialText || "");

  const handleNewTranscriptText = (transcript: string) => {
    if (value) {
      setValue(value + "\n" + transcript);
    } else {
      setValue(transcript);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput multiline={true} style={styles.textInput} value={value} onChangeText={setValue} />
      <View style={styles.recordIcon}>
        <RecordIcon onTranscriptionComplete={handleNewTranscriptText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    position: "relative",
    width: "100%",
  },
  textInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    height: 96,
    width: "100%",
  },
  recordIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  iconLoading: {},
});

export default TranscribeTextArea;
