import { FC, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import FilePreviewGrid from "../../components/media/FilePreviewGrid";
import MultiStepChinView from "../../components/control/MultiStepChinView";

interface FileAnnotationViewProps {
  file_uris: string[];
  hideFilePreviewGrid?: boolean;
  onFileUrisChange: (file_uris: string[]) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

const FileGroupAnnotationView: FC<FileAnnotationViewProps> = ({ file_uris, onFileUrisChange, hideFilePreviewGrid, onNextStep, onPreviousStep }) => {
  const [groupData, setGroupData] = useState({
    title: "",
    description: "",
    tags: [],
  });

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
      {hideFilePreviewGrid && (
        <ScrollView style={groupViewStyles.scollViewContainer}>
          <FilePreviewGrid files_uris={file_uris} onFileUrisChange={onFileUrisChange} />
        </ScrollView>
      )}
    </View>
  );
};

const FileIndividualAnnotationView: FC<FileAnnotationViewProps> = ({ file_uris, onFileUrisChange, onNextStep, onPreviousStep }) => {
  const [steps, setSteps] = useState(Array.from({ length: file_uris.length }, (_, i) => i));
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNextStep();
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onPreviousStep();
    }
  };

  return (
    <View style={individualViewStyles.annotateIndividualContainer}>
      <Text>
        {currentStep + 1} of {steps.length}
      </Text>
      <MultiStepChinView onContinue={handleNextStep} onCancel={null} onBack={handleBackStep} />
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
    padding: 20,
  },

  individualDetailsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export { FileGroupAnnotationView, FileIndividualAnnotationView };
