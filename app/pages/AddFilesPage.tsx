import { FC, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { AddFilesPageProps } from "../App";
import FilePreviewGrid from "../components/media/FilePreviewGrid";
import MultiStepChinView from "../components/control/MultiStepChinView";
import SelectImagesView from "../views/selection/SelectImagesView";
import AnnotationViewFileGroup from "../views/annotation/AnnotationViewFileGroup";
import AnnotationViewIndividualFile from "../views/annotation/AnnotationViewIndividualFile";
import DismissKeyboardView from "../components/containers/DismissKeyboardView";
import CardButton from "../components/CardButton";
import { useActiveAnnotation } from "../state/annotations";
import { FileAnnotation } from "../types/annotation";
import { utcNow } from "../utilities/general";

const AddFilesPage: FC<AddFilesPageProps> = ({ navigation }) => {
  const steps = ["add-type", "select-files", "annotate-group", "annotate-individual", "review"];

  const [flowType, setFlowType] = useActiveAnnotation((store) => [store.group.flow_type, store.setFlowType]);
  const [step, setStep] = useActiveAnnotation((store) => [store.step, store.setStep]);
  const [files, setFiles, updateFile, removeFile] = useActiveAnnotation((store) => [
    store.group.files,
    store.setFiles,
    store.updateFile,
    store.removeFile,
  ]);

  const [activeFileUri, setActiveFileUri] = useState<string | null>(null);

  const handleNextStep = () => {
    const currentStepIndex = steps.indexOf(step);

    if (flowType == "individual-then-group") {
      if (steps[currentStepIndex] == "select-files") return setStep("annotate-group");
      if (steps[currentStepIndex] == "annotate-group") return setStep("review");
    }

    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const currentStepIndex = steps.indexOf(step);

    if (flowType == "individual-then-group") {
      if (steps[currentStepIndex] == "annotate-group") return setStep("select-files");
      if (steps[currentStepIndex] == "review") return setStep("annotate-group");
    }

    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => {
    if (flowType == "individual-then-group" && step == "annotate-individual") {
      setStep("select-files");
      return;
    }

    if (files.length > 0) {
      Alert.alert(
        "Confirm",
        "Are you sure you want to cancel? All unsaved changes will be lost.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              resetState();
              navigation.navigate("home");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      resetState();
      navigation.navigate("home");
    }
  };

  const resetState = () => {
    setFlowType(null);
    setFiles([]);
    setStep("add-type");
    setActiveFileUri(null);
  };

  let view;

  if (step === "add-type") {
    const handleSetAddType = (type: "individual-then-group" | "group-then-individual") => {
      setFlowType(type);
      setStep("select-files");
    };

    view = (
      <View>
        <View style={mainStyles.buttonContainer}>
          <CardButton
            title='Individual then Group'
            subtitle='Annotate each file immediately after selecting.'
            onClick={() => handleSetAddType("individual-then-group")}
            icon={undefined}
          />
          <CardButton
            title='Group then Individual'
            subtitle='Annotate each file after selecting the whole group.'
            onClick={() => handleSetAddType("group-then-individual")}
            icon={undefined}
          />
        </View>
      </View>
    );
  }

  const handleFileClick = (uri: string) => {
    setStep("annotate-individual");
    setActiveFileUri(files.find((file) => file.uri === uri)?.uri || null);
  };

  const handleFileRemove = (uri: string) => removeFile(uri);
  const handleFilesChange = (updatedFiles: FileAnnotation[]) => setFiles(updatedFiles);
  const handleSingleFileChange = (updatedFile: FileAnnotation) => updateFile(updatedFile);

  const handleSelectMultipleFileUris = (newFileUris: string[]) => {
    const file_uris = files.map((file) => file.uri);
    const newUris = newFileUris.filter((uri) => !file_uris.includes(uri));
    const newFiles: FileAnnotation[] = newUris.map((uri) => ({ uri, description: "", tags: [], annotated_at: null, added_at: utcNow() }));
    const updatedFiles = [...files, ...newFiles].reduce((acc, file) => {
      acc[file.uri] = acc[file.uri] ? (new Date(acc[file.uri].added_at) > new Date(file.added_at) ? acc[file.uri] : file) : file;
      return acc;
    }, {} as { [uri: string]: FileAnnotation });
    setFiles(Object.values(updatedFiles).sort((a, b) => new Date(a.added_at).getTime() - new Date(b.added_at).getTime()));
  };

  const handleSelectSingleFileUri = (newFileUri: string) => {
    const newFile = { uri: newFileUri, description: "", tags: [], annotated_at: null, added_at: utcNow() };
    const file_uris = files.map((file) => file.uri);

    if (!file_uris.includes(newFileUri)) {
      setFiles([...files, newFile]);
    }

    if (flowType == "individual-then-group") {
      console.log("select single uri", newFile);
      setActiveFileUri(newFile.uri);
      setStep("annotate-individual");
    }
  };

  const handleAnnotateIndividualDone = () => {
    if (flowType == "individual-then-group") {
      setStep("select-files");
    } else {
      handleNextStep();
    }
  };

  if (step === "select-files") {
    view = (
      <SelectImagesView
        images={files.map((file) => file.uri) || []}
        onSelectSingleImage={handleSelectSingleFileUri}
        onSelectMultipleImages={handleSelectMultipleFileUris}
        selectMultiple={flowType == "group-then-individual"}
      />
    );
  }

  if (step == "annotate-group") {
    view = <AnnotationViewFileGroup hideFilePreviewGrid onFileClick={handleFileClick} onFileRemove={handleFileRemove} />;
  }

  if (step == "annotate-individual") {
    return (
      <AnnotationViewIndividualFile
        files={activeFileUri ? files.filter((file) => file.uri === activeFileUri) : files}
        annotateMultiple={flowType == "group-then-individual"}
        onChange={activeFileUri ? handleSingleFileChange : handleFilesChange}
        onDone={handleAnnotateIndividualDone}
        onBack={handlePreviousStep}
        onCancel={handleCancel}
      />
    );
  }

  if (step === "review") {
    view = <View style={reviewStyles.reviewContainer}></View>;
  }

  return (
    <View style={mainStyles.container}>
      <DismissKeyboardView>{view}</DismissKeyboardView>
      <ScrollView>
        {files && <FilePreviewGrid files_uris={files.map((file) => file.uri) || []} onFileClick={handleFileClick} onFileRemove={handleFileRemove} />}
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

const reviewStyles = StyleSheet.create({
  reviewContainer: {
    flex: 1,
    padding: 16,
  },
});

export default AddFilesPage;
