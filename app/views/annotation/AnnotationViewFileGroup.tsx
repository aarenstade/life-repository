import { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import FilePreviewGrid from "../../components/media/FilePreviewGrid";
import _ from "lodash";
import TagAnnotationInput from "../../components/inputs/transcribe-inputs/TagAnnotationInput";

export interface AnnotationViewProps {
  file_uris: string[];
  hideFilePreviewGrid?: boolean;
  initialData?: any;
  onDataChange: (data: any) => void;
  onFileUrisChange: (file_uris: string[]) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onDone?: () => void;
  onCancel?: () => void;
}

const AnnotationViewFileGroup: FC<AnnotationViewProps> = ({
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
        placeholder='Enter description'
        multiline
        noFullScreen
      />
      <TagAnnotationInput tags={groupData.tags} onTagsChange={(newTags) => setGroupData((prev) => ({ ...prev, tags: newTags }))} />
      {!hideFilePreviewGrid && (
        <ScrollView style={groupViewStyles.scollViewContainer}>
          <FilePreviewGrid files_uris={file_uris} onFileUrisChange={onFileUrisChange} />
        </ScrollView>
      )}
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

export default AnnotationViewFileGroup;
