import { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import MultiStepChinView from "../../components/control/MultiStepChinView";
import FileDisplay from "../../components/media/FileDisplay";
import { IndividualFileAnnotation } from "../../types/annotation";
import { AnnotationViewProps } from "./AnnotationViewFileGroup";
import _ from "lodash";

const AnnotationViewIndividualFile: FC<AnnotationViewProps> = ({
  file_uris,
  onFileUrisChange,
  initialData,
  onDataChange,
  onNextStep,
  onPreviousStep,
}) => {
  const [currentFileUri, setCurrentFileUri] = useState<string>(file_uris[0]);
  const [data, setData] = useState<Record<string, IndividualFileAnnotation>>(
    !_.isEmpty(initialData) ? initialData : file_uris.reduce((acc, uri) => ({ ...acc, [uri]: { description: "" } }), {})
  );

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    onDataChange(data);
  }, [data]);

  const navigateToNextStep = () => {
    const currentIndex = file_uris.indexOf(currentFileUri);
    if (currentIndex < file_uris.length - 1) {
      setCurrentFileUri(file_uris[currentIndex + 1]);
    } else {
      onNextStep();
    }
  };

  const navigateToPreviousStep = () => {
    const currentIndex = file_uris.indexOf(currentFileUri);
    if (currentIndex > 0) {
      setCurrentFileUri(file_uris[currentIndex - 1]);
    } else {
      onPreviousStep();
    }
  };

  const updateFileDescription = (text: string) => {
    setData({ ...data, [currentFileUri]: { ...data[currentFileUri], description: text } });
  };

  return (
    <View style={individualViewStyles.annotateIndividualContainer}>
      <Text style={{ textAlign: "right", fontSize: 10, paddingRight: 5, paddingTop: 5, paddingBottom: 5 }}>
        {file_uris.indexOf(currentFileUri) + 1} of {file_uris.length}
      </Text>
      <View style={individualViewStyles.mainContentContainer}>
        <FileDisplay file_uri={currentFileUri} />
        <TranscribeTextInput
          multiline
          value={data[currentFileUri]?.description || ""}
          onChangeText={updateFileDescription}
          insetBottom={height * 0.12}
        />
      </View>
      <View style={{ width: "100%", height: "10%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
        <MultiStepChinView onContinue={navigateToNextStep} onCancel={null} onBack={navigateToPreviousStep} />
      </View>
    </View>
  );
};

const individualViewStyles = StyleSheet.create({
  annotateIndividualContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  mainContentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  individualDetailsText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  fileDisplayContainer: {
    width: "100%",
  },
});

export default AnnotationViewIndividualFile;
