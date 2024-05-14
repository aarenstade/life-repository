import { FC, useEffect, useState } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { AddFilesPageProps } from "../App";
import FilePreviewGrid from "../components/media/FilePreviewGrid";
import MultiStepChinView from "../components/control/MultiStepChinView";
import SelectImagesView from "../views/selection/SelectImagesView";
import AnnotationViewFileGroup from "../views/annotation/AnnotationViewFileGroup";
import AnnotationViewIndividualFile from "../views/annotation/AnnotationViewIndividualFile";
import { GroupFileAnnotation, IndividualFileAnnotation } from "../types/annotation";
import DismissKeyboardView from "../components/containers/DismissKeyboardView";
import CardButton from "../components/CardButton";

const AddFilesPage: FC<AddFilesPageProps> = ({ navigation }) => {
  const steps = ["add-type", "select-files", "annotate-group", "annotate-individual", "review"];

  const [step, setStep] = useState("add-type");
  const [file_uris, setFileUris] = useState<string[]>([]);
  const [new_file_uri, setNewFileUri] = useState<string>();

  const [addType, setAddType] = useState<"individual-then-group" | "group-then-individual">(null);

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

  const handleSetFileUris = (newFileUris: string[]) => {
    console.log(newFileUris);
    const newFiles = newFileUris.filter((uri) => !file_uris.includes(uri));
    setFileUris(newFileUris);
    if (newFiles.length > 0 && addType == "individual-then-group") {
      setNewFileUri(newFiles[0]);
      setStep("annotate-individual");
    }
  };

  const handleAnnotateIndividualDone = () => {
    setNewFileUri(null);
    setStep("select-files");
  };

  const handleAnnotateIndividualCancel = () => {
    setFileUris(file_uris.filter((uri) => uri !== new_file_uri));
    setNewFileUri(null);
    setStep("select-files");
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

  if (step === "add-type") {
    const handleSetAddType = (type: "individual-then-group" | "group-then-individual") => {
      setAddType(type);
      setStep("select-files");
    };

    view = (
      <View>
        <View style={mainStyles.buttonContainer}>
          <CardButton title='Individual then Group' onClick={() => handleSetAddType("individual-then-group")} icon={undefined} />
          <CardButton title='Group then Individual' onClick={() => handleSetAddType("group-then-individual")} icon={undefined} />
        </View>
      </View>
    );
  }

  if (step === "select-files") {
    view = <SelectImagesView images={file_uris} setImages={handleSetFileUris} selectMultiple={addType == "group-then-individual"} />;
  }

  if (step == "annotate-group") {
    view = (
      <AnnotationViewFileGroup
        file_uris={addType == "group-then-individual" ? file_uris : new_file_uri ? [new_file_uri] : file_uris}
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
        onDone={handleAnnotateIndividualDone}
        onCancel={handleAnnotateIndividualCancel}
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
