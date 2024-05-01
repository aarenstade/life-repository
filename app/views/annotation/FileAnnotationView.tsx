import { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import FilePreviewGrid from "../../components/media/FilePreviewGrid";
import MultiStepChinView from "../../components/control/MultiStepChinView";
import FileDisplay from "../../components/media/FileDisplay";
import { IndividualFileAnnotation } from "../../types/annotation";

interface FileAnnotationViewProps {
  file_uris: string[];
  hideFilePreviewGrid?: boolean;
  onDataChange: (data: any) => void;
  onFileUrisChange: (file_uris: string[]) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

const FileGroupAnnotationView: FC<FileAnnotationViewProps> = ({
  file_uris,
  onFileUrisChange,
  hideFilePreviewGrid,
  onDataChange,
  onNextStep,
  onPreviousStep,
}) => {
  const [groupData, setGroupData] = useState({
    title: "",
    description: "",
    tags: [],
  });

  useEffect(() => {
    onDataChange(groupData);
  }, [groupData]);

  return (
    <View style={groupViewStyles.annotateGroupContainer}>
      <Text style={groupViewStyles.groupDetailsText}>Group Details</Text>
      <TranscribeTextInput
        initialText={groupData.title}
        onChangeText={(text) => setGroupData({ ...groupData, title: text })}
        placeholder='Enter title'
      />
      <TranscribeTextInput
        initialText={groupData.description}
        onChangeText={(text) => setGroupData({ ...groupData, description: text })}
        multiline
        placeholder='Enter description'
      />
      <TranscribeTextInput
        initialText={groupData.tags.join(",")}
        onChangeText={(text) => setGroupData({ ...groupData, tags: text.split(",") })}
        placeholder='Enter tags, separated by commas'
      />
      {!hideFilePreviewGrid && (
        <ScrollView style={groupViewStyles.scollViewContainer}>
          <FilePreviewGrid files_uris={file_uris} onFileUrisChange={onFileUrisChange} />
        </ScrollView>
      )}
    </View>
  );
};

const FileIndividualAnnotationView: FC<FileAnnotationViewProps> = ({ file_uris, onFileUrisChange, onNextStep, onPreviousStep }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<IndividualFileAnnotation[]>(Array(file_uris.length).fill({ description: "" }));

  const navigateToNextStep = () => {
    if (currentStep < file_uris.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNextStep();
    }
  };

  const navigateToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onPreviousStep();
    }
  };

  const updateFileDescription = (text: string) => {
    const updatedData = data.map((item, index) => (index === currentStep ? { ...item, description: text } : item));
    setData(updatedData);
  };

  return (
    <View style={individualViewStyles.annotateIndividualContainer}>
      <Text style={{ textAlign: "center", fontSize: 12, padding: 10 }}>
        {currentStep + 1} of {file_uris.length}
      </Text>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <View style={{ marginBottom: 20, minHeight: 250 }}>
          <FileDisplay file_uri={file_uris[currentStep]} />
        </View>
        <TranscribeTextInput multiline value={data[currentStep].description} onChangeText={(text) => updateFileDescription(text)} />
      </ScrollView>
      <View style={{ width: "100%", height: "10%", display: "flex", justifyContent: "flex-end", overflow: "hidden" }}>
        <MultiStepChinView onContinue={navigateToNextStep} onCancel={null} onBack={navigateToPreviousStep} />
      </View>
    </View>
  );
};

const groupViewStyles = StyleSheet.create({
  selectImagesContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  annotateGroupContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
    gap: 20,
  },
  groupDetailsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
  },
  inputMargin: {
    marginBottom: 20,
  },

  scollViewContainer: {
    flex: 1,
    height: "100%",
    marginBottom: 20,
  },
});

const individualViewStyles = StyleSheet.create({
  annotateIndividualContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  individualDetailsText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  fileDisplayContainer: {
    width: "100%",
  },
});

export { FileGroupAnnotationView, FileIndividualAnnotationView };
