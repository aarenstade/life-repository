import { FC, useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import RecordIcon from "./RecordIcon";

interface TranscribeTextInputProps {
  initialText?: string;
  insetTop?: number;
  insetBottom?: number;
  insetLeft?: number;
  insetRight?: number;
  noFullScreen?: boolean;
  [inputProps: string]: any;
}

const TranscribeTextInput: FC<TranscribeTextInputProps> = ({
  initialText,
  insetTop = 0,
  insetBottom = 0,
  insetLeft = 0,
  insetRight = 0,
  noFullScreen = false,
  ...rest
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  const isMultiLine = rest.multiline ?? false;

  const handleNewTranscriptText = (transcript: string) => {
    if (rest.value) {
      if (rest.onChangeText) rest.onChangeText(rest.value + "\n" + transcript);
    } else {
      if (rest.onChangeText) rest.onChangeText(transcript);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: isFullScreen ? "absolute" : "relative",
      width: isFullScreen ? width - (insetLeft + insetRight) : "100%",
      height: isFullScreen ? height - (insets.top + insetTop + insets.bottom + insetBottom) : isMultiLine ? 150 : 40,
      zIndex: isFullScreen ? 100 : 1,
      top: isFullScreen ? insetTop : undefined,
      left: isFullScreen ? insetLeft : undefined,
      right: isFullScreen ? insetRight : undefined,
      bottom: isFullScreen ? insetBottom : undefined,
      backgroundColor: "white",
    },
    input: {
      width: "100%",
      height: isFullScreen ? height - (insets.top + insetTop + insets.bottom + insetBottom) : isMultiLine ? 150 : 40,
      padding: 10,
      paddingBottom: isMultiLine ? 50 : 10,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
    },
    recordButton: {
      position: "absolute",
      right: 10,
      top: isFullScreen ? 50 : "auto",
      bottom: isFullScreen ? 0 : 10,
    },
    fullscreenButton: {
      position: "absolute",
      right: 10,
      top: 10,
      zIndex: 20,
    },
  });

  return (
    <View style={styles.container}>
      {rest.multiline && !noFullScreen && (
        <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullScreen}>
          <Feather name={isFullScreen ? "minimize" : "maximize"} size={20} color='black' />
        </TouchableOpacity>
      )}
      <TextInput value={rest.value || ""} onChangeText={rest.onChangeText} placeholder='Write something here...' style={styles.input} {...rest} />
      <View style={styles.recordButton}>
        <RecordIcon onTranscriptionComplete={handleNewTranscriptText} />
      </View>
    </View>
  );
};

export default TranscribeTextInput;
//
