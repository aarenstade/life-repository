import { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import FilePreviewGrid from "../../components/media/FilePreviewGrid";
import MultiStepChinView from "../../components/control/MultiStepChinView";
import FileDisplay from "../../components/media/FileDisplay";
import { IndividualFileAnnotation } from "../../types/annotation";
import _, { initial } from "lodash";

interface FileAnnotationViewProps {
  file_uris: string[];
  hideFilePreviewGrid?: boolean;
  initialData?: any;
  onDataChange: (data: any) => void;
  onFileUrisChange: (file_uris: string[]) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

const FileGroupAnnotationView: FC<FileAnnotationViewProps> = ({
  file_uris,
  onFileUrisChange,
  hideFilePreviewGrid,
  initialData,
  onDataChange,
  onNextStep,
  onPreviousStep,
}) => {
  const [groupData, setGroupData] = useState(
    initialData
      ? initialData
      : {
          title: "",
          description: "",
          tags: [],
        }
  );

  useEffect(() => {
    onDataChange(groupData);
  }, [groupData]);

  return (
    <View style={groupViewStyles.annotateGroupContainer}>
      <Text style={groupViewStyles.groupDetailsText}>Group Details</Text>
      <TranscribeTextInput
        value={groupData.title}
        onChangeText={(text) => setGroupData((prev) => ({ ...prev, title: text }))}
        placeholder='Enter title'
      />
      <TranscribeTextInput
        value={groupData.description}
        onChangeText={(text) => setGroupData((prev) => ({ ...prev, description: text }))}
        multiline
        placeholder='Enter description'
      />
      <TranscribeTextInput
        value={groupData.tags.join(",")}
        onChangeText={(text) => setGroupData((prev) => ({ ...prev, tags: text.split(",") }))}
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

const FileIndividualAnnotationView: FC<FileAnnotationViewProps> = ({
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
      <Text style={{ textAlign: "center", fontSize: 12, padding: 10 }}>
        {file_uris.indexOf(currentFileUri) + 1} of {file_uris.length}
      </Text>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <View style={{ marginBottom: 20, minHeight: 150 }}>
          <FileDisplay file_uri={currentFileUri} />
        </View>
        <TranscribeTextInput multiline value={data[currentFileUri]?.description || ""} onChangeText={updateFileDescription} />
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
