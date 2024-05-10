import { FC, useEffect, useState } from "react";
import { Alert, ScrollView, View, Text, StyleSheet } from "react-native";
import { AddFilesPageProps } from "../App";
import FilePreviewGrid from "../components/media/FilePreviewGrid";
import MultiStepChinView from "../components/control/MultiStepChinView";
import SelectImagesView from "../views/selection/SelectImagesView";
import AnnotationViewFileGroup from "../views/annotation/AnnotationViewFileGroup";
import AnnotationViewIndividualFile from "../views/annotation/AnnotationViewIndividualFile";
import { GroupFileAnnotation, IndividualFileAnnotation } from "../types/annotation";
import DismissKeyboardView from "../components/containers/DismissKeyboardView";

const AddFilesPage: FC<AddFilesPageProps> = ({ navigation }) => {
  const steps = ["select-files", "annotate-group", "annotate-individual", "review"];

  const [step, setStep] = useState("select-files");
  const [file_uris, setFileUris] = useState<string[]>([]);

  const [individualData, setIndividualData] = useState<Record<string, IndividualFileAnnotation>>({});
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
      <AnnotationViewFileGroup
        file_uris={file_uris}
        onFileUrisChange={setFileUris}
        initialData={groupData}
        onDataChange={setGroupData}
        onPreviousStep={handlePreviousStep}
        onNextStep={handleNextStep}
        hideFilePreviewGrid
      />
    );
  }

  if (step == "annotate-individual") {
    return (
      <AnnotationViewIndividualFile
        file_uris={file_uris}
        onFileUrisChange={setFileUris}
        initialData={individualData}
        onDataChange={setIndividualData}
        onPreviousStep={handlePreviousStep}
        onNextStep={handleNextStep}
      />
    );
  }

  if (step === "review") {
    view = <View style={reviewStyles.reviewContainer}></View>;
  }

  return (
    <View style={mainStyles.container}>
      <DismissKeyboardView>{view}</DismissKeyboardView>
      <ScrollView>{file_uris && <FilePreviewGrid files_uris={file_uris} onFileUrisChange={setFileUris} />}</ScrollView>
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

const reviewStyles = StyleSheet.create({
  reviewContainer: {
    flex: 1,
    padding: 16,
  },
});

export default AddFilesPage;
