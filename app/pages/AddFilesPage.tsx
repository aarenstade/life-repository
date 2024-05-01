import { FC, useEffect, useState } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { AddFilesPageProps } from "../App";
import FilePreviewGrid from "../components/media/FilePreviewGrid";
import { FileGroupAnnotationView, FileIndividualAnnotationView } from "../views/annotation/FileAnnotationView";
import MultiStepChinView from "../components/control/MultiStepChinView";
import SelectImagesView from "../views/selection/SelectImagesView";
import { GroupFileAnnotation, IndividualFileAnnotation } from "../types/annotation";

const AddFilesPage: FC<AddFilesPageProps> = ({ navigation }) => {
  const steps = ["select-files", "annotate-group", "annotate-individual"];

  const [step, setStep] = useState("select-files");
  const [file_uris, setFileUris] = useState<string[]>([]);

  const [individualData, setIndividualData] = useState<IndividualFileAnnotation[]>([]);
  const [groupData, setGroupData] = useState<GroupFileAnnotation>({
    title: "",
    description: "",
    tags: [],
    file_uris: [],
  });

  useEffect(() => {
    setGroupData((prev) => ({ ...prev, file_uris }));
  }, [file_uris]);

  const handleNextStep = () => {
    const currentStepIndex = steps.indexOf(step);
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const currentStepIndex = steps.indexOf(step);
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => {
    if (file_uris.length > 0) {
      Alert.alert(
        "Confirm",
        "Are you sure you want to cancel? All unsaved changes will be lost.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => navigation.navigate("home") },
        ],
        { cancelable: false }
      );
    } else {
      navigation.navigate("home");
    }
  };

  let view;

  if (step === "select-files") {
    view = <SelectImagesView images={file_uris} setImages={setFileUris} />;
  }

  if (step == "annotate-group") {
    view = (
      <FileGroupAnnotationView
        file_uris={file_uris}
        onFileUrisChange={setFileUris}
        onDataChange={setGroupData}
        onPreviousStep={handlePreviousStep}
        onNextStep={handleNextStep}
        hideFilePreviewGrid
      />
    );
  }

  if (step == "annotate-individual") {
    return (
      <FileIndividualAnnotationView
        file_uris={file_uris}
        onFileUrisChange={setFileUris}
        onDataChange={setIndividualData}
        onPreviousStep={handlePreviousStep}
        onNextStep={handleNextStep}
      />
    );
  }

  return (
    <View style={mainStyles.container}>
      <ScrollView>
        {view}
        {file_uris && <FilePreviewGrid files_uris={file_uris} onFileUrisChange={setFileUris} />}
      </ScrollView>
      <MultiStepChinView onContinue={handleNextStep} onCancel={handleCancel} onBack={steps.indexOf(step) > 0 ? handlePreviousStep : undefined} />
    </View>
  );
};

const mainStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  buttonContainer: {
    flexGrow: 1,
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
  continueButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddFilesPage;
