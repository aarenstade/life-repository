import { FC, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import * as FileSystem from "expo-file-system";
import FilePreviewGrid from "../../components/annotation/FileAnnotationPreviewGrid";
import MultiStepChinView from "../../components/control/MultiStepChinView";
import SelectImagesView from "../../views/selection/SelectImagesView";
import AnnotationViewFileGroup from "../../views/annotation/AnnotationViewFileGroup";
import AnnotationViewIndividualFile from "../../views/annotation/AnnotationViewIndividualFile";
import DismissKeyboardView from "../../components/containers/DismissKeyboardView";
import CardButton from "../../components/CardButton";
import { useActiveAnnotation, useAnnotationDrafts } from "../../state/annotations";
import { AnnotationGroup, FileAnnotation } from "../../types/annotation";
import { generate_id, utcNow } from "../../utilities/general";
import useAnnotationsGroupUploader from "../../hooks/useAnnotationsGroupUploader";
import { CreateAnnotationGroupPageProps } from "../../App";
import fetchAPI from "../../lib/api";
import useConfigStore from "../../state/config";
import { createDefaultGroup } from "../../config/annotations";
import { Feather } from "@expo/vector-icons";

const CreateAnnotationGroupPage: FC<CreateAnnotationGroupPageProps> = ({ navigation, route }) => {
  const api_url = useConfigStore((state) => state.api_url);

  const { isUploading, isSuccess, uploadStats, uploadGroup, uploadAndWriteFile } = useAnnotationsGroupUploader();
  const steps = ["add-type", "select-files", "annotate-group", "annotate-individual", "review"];

  const group_id = route.params?.group_id || null;
  const initialLoad = useRef(true);

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
    if (!initialLoad.current) {
      return;
    }

    if (!group && !group_id) {
      setStep("add-type");
      resetActiveAnnotation();
      initialLoad.current = true;
      return;
    }

    if (group_id) {
      const group = drafts.find((draft) => draft.group_id === group_id);
      if (group) {
        setGroup(group);
        setStep("select-files");
      }
    }

    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
  }, [group, group_id, initialLoad]);

  const resetActiveAnnotation = () => {
    setGroup(createDefaultGroup(flowType));
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
            uploadGroup(group, { filter_uploaded_files: true });
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
      await deleteFileRemote(uri);
    } catch (error) {
      console.error("Failed to delete the image:", error);
    }
  };

  const deleteFileRemote = async (file_id: string) => {
    const response = await fetchAPI(api_url, "/annotations/delete/file", { file_id }, "POST");
    console.log(response);
  };

  const handleReuploadGroup = async () => {
    await uploadGroup(group, { filter_uploaded_files: true });
  };

  const handleSaveLocally = () => {
    insertDraft();
  };

  const handleFilesChange = (updatedFiles: FileAnnotation[]) => setFiles(updatedFiles);
  const handleSingleFileChange = (updatedFile: FileAnnotation) => updateFile(updatedFile);

  const handleSelectMultipleFileUris = async (data: { uri: string; metadata: any }[]) => {
    const file_uris = group.files?.map((file) => file.uri) || [];
    const newUris = data.filter((file) => !file_uris.includes(file.uri));
    const newFiles: FileAnnotation[] = newUris.map((file) => ({
      file_id: generate_id(),
      uri: file.uri,
      description: "",
      tags: [],
      annotated_at: null,
      added_at: utcNow(),
      metadata: data.find((f) => file.uri === f.uri)?.metadata,
    }));
    const updatedFiles = [...group.files, ...newFiles].reduce((acc, file) => {
      acc[file.uri] = acc[file.uri] ? (new Date(acc[file.uri].added_at) > new Date(file.added_at) ? acc[file.uri] : file) : file;
      return acc;
    }, {} as { [uri: string]: FileAnnotation });
    setFiles(Object.values(updatedFiles).sort((a, b) => new Date(a.added_at).getTime() - new Date(b.added_at).getTime()));
    await handleUploadFiles(newFiles);
  };

  const handleSelectSingleFileUri = async (data: { uri: string; metadata: any }) => {
    const newFile: FileAnnotation = {
      file_id: generate_id(),
      uri: data.uri,
      description: "",
      tags: [],
      annotated_at: null,
      added_at: utcNow(),
      metadata: data.metadata,
    };

    const file_uris = group.files?.map((file) => file.uri) || [];

    if (!file_uris.includes(newFile.uri)) {
      setFiles([...group.files, newFile]);
      await handleUploadFiles([newFile]);
    }

    // if (flowType == "individual-then-group") {
    //   setActiveFileUri(newFile.uri);
    //   setStep("annotate-individual");
    // }
  };

  const handleUploadFiles = async (filesToUpload: FileAnnotation[]) => {
    filesToUpload.forEach((file) => updateFile({ ...file, status: "uploading" }));
    const promises = filesToUpload.map((file) => uploadAndWriteFile(file));
    const results = await Promise.all(promises);
    results.forEach((result) => updateFile(result.file));
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
        images={group.files?.map((file) => ({ uri: file.uri, metadata: file.metadata })) || []}
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
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={{ width: "33.33%" }}>
          <View
            style={{
              flexDirection: "column",
              gap: 10,
              backgroundColor: "#f8f9fa",
              borderBottomLeftRadius: 8,
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 10, fontWeight: "bold" }}>total files: {uploadStats.totalFiles}</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold" }}>uploaded: {uploadStats.uploadedFiles}</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold" }}>pending: {uploadStats.pendingFiles}</Text>
            </View>
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 4,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isUploading ? "#ffc107" : isSuccess ? "#28a745" : "#007bff",
              }}
              onPress={handleReuploadGroup}
            >
              <Feather name={isUploading ? "upload-cloud" : isSuccess ? "check-circle" : "refresh-cw"} size={18} color='#ffffff' />
              <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 14, marginLeft: 4 }}>
                {isUploading ? `${uploadStats.uploadedFiles}/${uploadStats.totalFiles}` : isSuccess ? "Success" : "Retry"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 4,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#6c757d",
              }}
              onPress={handleSaveLocally}
            >
              <Feather name='save' size={18} color='#ffffff' />
              <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 14, marginLeft: 4 }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: "66.67%" }}>
          <DismissKeyboardView style={{}}>{view}</DismissKeyboardView>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={(ref) => {
            if (ref) ref.scrollToEnd({ animated: true });
          }}
        >
          {group.files && (
            <FilePreviewGrid files={group.files || []} onFileClick={handleFileClick} onFileRemove={step != "review" ? handleFileRemove : undefined} />
          )}
        </ScrollView>
      </View>
      <>
        {step == "review" && (
          <TouchableOpacity
            style={{
              padding: 12,
              borderRadius: 4,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#007bff",
              justifyContent: "center",
              marginVertical: 10,
            }}
            onPress={handleNextStep}
          >
            <Feather name='upload-cloud' size={18} color='#ffffff' />
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 14, marginLeft: 4 }}>Upload</Text>
          </TouchableOpacity>
        )}
        <MultiStepChinView
          continueText='Continue'
          onContinue={handleNextStep}
          onCancel={handleCancel}
          onBack={steps.indexOf(step) > 0 ? handlePreviousStep : undefined}
        />
      </>
      {step == "review" && isSuccess && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#ffffff", backgroundColor: "#28a745", padding: 8, borderRadius: 4 }}>
            Uploaded!
          </Text>
          <TouchableOpacity
            style={{ marginTop: 16, padding: 12, backgroundColor: "#007bff", borderRadius: 4 }}
            onPress={() => {
              insertDraft();
              resetActiveAnnotation();
              resetState();
              navigation.navigate("home");
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 18 }}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
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

export default CreateAnnotationGroupPage;
