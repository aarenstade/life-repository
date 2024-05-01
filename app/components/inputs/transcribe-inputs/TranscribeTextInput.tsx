import { FC } from "react";
import { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import RecordIcon from "./RecordIcon";

interface TranscribeTextInputProps {
  initialText?: string;
  [inputProps: string]: any;
}

const TranscribeTextInput: FC<TranscribeTextInputProps> = ({ initialText, ...rest }) => {
  const handleNewTranscriptText = (transcript: string) => {
    if (rest.value) {
      if (rest.onChangeText) rest.onChangeText(rest.value + "\n" + transcript);
    } else {
      if (rest.onChangeText) rest.onChangeText(transcript);
    }
  };

  const isMultiLine = rest.multiline ?? false;

  const styles = StyleSheet.create({
    container: {
      position: "relative",
      width: "100%",
    },
    input: {
      width: "100%",
      minHeight: isMultiLine ? 150 : 40,
      padding: 10,
      paddingBottom: isMultiLine ? 50 : 10, // Make space for the record button if multiline
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
    },
    recordButton: {
      position: "absolute",
      right: 10,
      bottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput value={rest.value || ""} onChangeText={rest.onChangeText} placeholder='Write something here...' style={styles.input} {...rest} />
      <View style={styles.recordButton}>
        <RecordIcon onTranscriptionComplete={handleNewTranscriptText} />
      </View>
    </View>
  );
};
export default TranscribeTextInput;
