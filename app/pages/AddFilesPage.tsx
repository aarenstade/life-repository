import { FC, useEffect, useState } from "react";
import { Alert, ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AddFilesPageProps } from "../App";
import * as FileSystem from "expo-file-system";
import FilePreviewGrid from "../components/annotation/FileAnnotationPreviewGrid";
import MultiStepChinView from "../components/control/MultiStepChinView";
import SelectImagesView from "../views/selection/SelectImagesView";
import AnnotationViewFileGroup from "../views/annotation/AnnotationViewFileGroup";
import AnnotationViewIndividualFile from "../views/annotation/AnnotationViewIndividualFile";
import DismissKeyboardView from "../components/containers/DismissKeyboardView";
import CardButton from "../components/CardButton";
import { useActiveAnnotation, useAnnotationDrafts } from "../state/annotations";
import { AnnotationGroup, FileAnnotation } from "../types/annotation";
import { utcNow } from "../utilities/general";
import AnnotationDraftsList from "../components/annotation/AnnotationDraftsList";
import fetchAPI from "../lib/api";
import useConfig from "../hooks/useConfig";
import shortid from "shortid";

const useGroupUploader = () => {
  const { group, updateFile } = useActiveAnnotation((store) => ({ group: store.group, updateFile: store.updateFile }));
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { api_url } = useConfig();

  const uploadFile = async (file: FileAnnotation, apiUrl: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const fileUri = file.uri;
      const fileName = fileUri.split("/").pop();
      const fileType = fileName.split(".").pop();

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileSize = fileInfo.size || 0;
      if (fileSize > 10000000) {
        throw new Error("File size exceeds limit of 10MB");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);

      const endpoint = `${apiUrl.trim()}/paths/upload-file/`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || "File upload failed");
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const writeFileData = async (file: FileAnnotation) => {
    // Empty function to write file data
  };

  const handleFile = async (file: FileAnnotation) => {
    updateFile({ ...file, status: "uploading" });
    const result = await uploadFile(file, api_url);
    if (result.success) {
      await writeFileData(file);
      updateFile({ ...file, status: "uploaded" });
    } else {
      updateFile({ ...file, status: "error" });
      console.error(result.error);
    }
  };

  const uploadGroup = async () => {
    setIsUploading(true);

    const batchSize = 10;
    const { files } = group;

    console.log(JSON.stringify(group, null, 2));

    try {
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const uploadPromises = batch.map((file) => handleFile(file));
        await Promise.all(uploadPromises);
      }
      console.log("All files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, progress, uploadGroup };
};

const AddFilesPage: FC<AddFilesPageProps> = ({ navigation }) => {
  const { isUploading, progress, uploadGroup } = useGroupUploader();
  const steps = ["add-type", "select-files", "annotate-group", "annotate-individual", "review"];

  const [activeFileUri, setActiveFileUri] = useState<string | null>(null);
  const [drafts, setDrafts] = useAnnotationDrafts((store) => [store.draftGroups, store.setDraftGroups]);
  const [flowType, setFlowType] = useActiveAnnotation((store) => [store.group ? store.group.flow_type : "individual-then-group", store.setFlowType]);
  const [step, setStep] = useActiveAnnotation((store) => [store.step, store.setStep]);
  const [group, setGroup, setFiles, updateFile, removeFile] = useActiveAnnotation((store) => [
    store.group,
    store.setGroup,
    store.setFiles,
    store.updateFile,
    store.removeFile,
  ]);

  useEffect(() => {
    if (!group) {
      setStep("add-type");
      resetActiveAnnotation();
    }
  }, [group]);

  const resetActiveAnnotation = () => {
    setGroup({
      group_id: shortid.generate(),
      title: "",
      description: "",
      files: [],
      tags: [],
      created_at: utcNow(),
      updated_at: utcNow(),
      flow_type: flowType,
    });
    setFiles([]);
    setStep("add-type");
    setActiveFileUri(null);
  };

  const groupHasDraft = drafts && drafts.find((draft) => draft.group_id === group.group_id);

  const updateGroupDraft = (updatedGroup: AnnotationGroup) => {
    if (groupHasDraft) {
      const groupData = { ...updatedGroup, updated_at: utcNow() };
      setDrafts(drafts.map((draft) => (draft.group_id === group.group_id ? groupData : draft)));
    }
  };

  const handleNextStep = () => {
    const currentStepIndex = steps.indexOf(step);

    if (flowType == "individual-then-group") {
      if (steps[currentStepIndex] == "select-files") return setStep("annotate-group");
      if (steps[currentStepIndex] == "annotate-group") return setStep("review");
    }

    if (step === "review") {
      Alert.alert("Confirm Upload", "Are you sure you want to start the upload of the group?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            console.log("STARTING UPLOAD OF GROUP");
            uploadGroup();
          },
        },
      ]);
    }

    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const currentStepIndex = steps.indexOf(step);

    if (steps[currentStepIndex] == "select-files") {
      updateGroupDraft(group);
      if (group.files.length > 0) {
        promptSaveAsDraft();
      } else {
        resetState();
        navigation.navigate("home");
      }
    }

    if (flowType == "individual-then-group") {
      if (steps[currentStepIndex] == "annotate-group") return setStep("select-files");
      if (steps[currentStepIndex] == "review") return setStep("annotate-group");
    }

    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => {
    console.log("CANCELLING");

    if (flowType == "individual-then-group" && step == "annotate-individual") {
      setStep("select-files");
      return;
    }

    if (group.files.length > 0) {
      promptSaveAsDraft();
    } else {
      resetState();
      navigation.navigate("home");
    }
  };

  const insertDraft = () => {
    const draftsCopy = [...drafts];
    const draftIndex = draftsCopy.findIndex((draft) => draft.group_id === group.group_id);
    if (draftIndex !== -1) {
      draftsCopy[draftIndex] = group;
      setDrafts(draftsCopy);
    } else {
      setDrafts([...draftsCopy, group]);
    }
  };

  const promptSaveAsDraft = () => {
    Alert.alert(
      "Save as Draft",
      "Do you want to save your changes as a draft?",
      [
        {
          text: "Yes",
          onPress: () => {
            insertDraft();
            resetState();
            navigation.navigate("home");
          },
        },
        {
          text: "No",
          onPress: () => {
            resetState();
            navigation.navigate("home");
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const resetState = () => {
    setFlowType(null);
    setFiles([]);
    setStep("add-type");
    setActiveFileUri(null);
  };

  const handleFileClick = (uri: string) => {
    setStep("annotate-individual");
    setActiveFileUri(group.files.find((file) => file.uri === uri)?.uri || null);
  };

  const handleFileRemove = async (uri: string) => {
    try {
      removeFile(uri);
      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.error("Failed to delete the image:", error);
    }
  };

  const handleFilesChange = (updatedFiles: FileAnnotation[]) => setFiles(updatedFiles);
  const handleSingleFileChange = (updatedFile: FileAnnotation) => updateFile(updatedFile);

  const handleSelectMultipleFileUris = (newFileUris: string[]) => {
    const file_uris = group.files.map((file) => file.uri);
    const newUris = newFileUris.filter((uri) => !file_uris.includes(uri));
    const newFiles: FileAnnotation[] = newUris.map((uri) => ({
      file_id: shortid.generate(),
      uri,
      description: "",
      tags: [],
      annotated_at: null,
      added_at: utcNow(),
      uploaded: false,
    }));
    const updatedFiles = [...group.files, ...newFiles].reduce((acc, file) => {
      acc[file.uri] = acc[file.uri] ? (new Date(acc[file.uri].added_at) > new Date(file.added_at) ? acc[file.uri] : file) : file;
      return acc;
    }, {} as { [uri: string]: FileAnnotation });
    setFiles(Object.values(updatedFiles).sort((a, b) => new Date(a.added_at).getTime() - new Date(b.added_at).getTime()));
  };

  const handleSelectSingleFileUri = (newFileUri: string) => {
    const newFile = {
      file_id: shortid.generate(),
      uri: newFileUri,
      description: "",
      tags: [],
      annotated_at: null,
      added_at: utcNow(),
      uploaded: false,
    };

    const file_uris = group.files.map((file) => file.uri);

    if (!file_uris.includes(newFileUri)) {
      setFiles([...group.files, newFile]);
    }

    if (flowType == "individual-then-group") {
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

  const handleEnterDraft = (groupId: string) => {
    const draft = drafts.find((draft) => draft.group_id === groupId);
    if (draft) {
      resetState();
      setGroup(draft);
      setStep("select-files");
    }
  };

  const handleDeleteDraft = (groupId: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this draft?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => setDrafts(drafts.filter((draft) => draft.group_id !== groupId)) },
    ]);
  };

  let view;

  if (step === "add-type") {
    const handleSetAddType = (type: "individual-then-group" | "group-then-individual") => {
      resetActiveAnnotation();
      setFlowType(type);
      setStep("select-files");
    };

    return (
      <View style={mainStyles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>Create a new group</Text>
        <View style={mainStyles.buttonContainer}>
          <CardButton
            title='Individual then Group'
            subtitle='Annotate each file immediately after selecting.'
            onClick={() => handleSetAddType("individual-then-group")}
            size='small'
            icon={undefined}
          />
          <CardButton
            title='Group then Individual'
            subtitle='Annotate each file after selecting the whole group.'
            onClick={() => handleSetAddType("group-then-individual")}
            size='small'
            icon={undefined}
          />
        </View>
        <View style={{ height: 1, backgroundColor: "#e0e0e0", marginVertical: 20 }}></View>
        {drafts && drafts.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Draft Groups</Text>
            <AnnotationDraftsList drafts={drafts} onDelete={handleDeleteDraft} onClick={handleEnterDraft} />
          </View>
        )}
        <TouchableOpacity
          onPress={handleCancel}
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: 30,
            marginBottom: 20,
            backgroundColor: "#A4A4A4", // Gray
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === "select-files") {
    view = (
      <SelectImagesView
        images={group.files.map((file) => file.uri) || []}
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
        files={activeFileUri ? group.files.filter((file) => file.uri === activeFileUri) : group.files}
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
        {group.files && (
          <FilePreviewGrid files={group.files || []} onFileClick={handleFileClick} onFileRemove={step != "review" ? handleFileRemove : undefined} />
        )}
      </ScrollView>
      <MultiStepChinView
        continueText={step == "review" ? "Upload" : "Continue"}
        onContinue={handleNextStep}
        onCancel={handleCancel}
        onBack={steps.indexOf(step) > 0 ? handlePreviousStep : undefined}
      />
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
  reviewContainer: {},
});

export default AddFilesPage;
