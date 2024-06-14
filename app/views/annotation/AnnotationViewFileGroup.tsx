import { FC, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import FilePreviewGrid from "../../components/annotation/FileAnnotationPreviewGrid";
import TagAnnotationInput from "../../components/inputs/transcribe-inputs/TagAnnotationInput";
import { useActiveAnnotation } from "../../state/annotations";
import _ from "lodash";

interface AnnotationViewFileGroupProps {
  hideFilePreviewGrid?: boolean;
  onFileClick?: (file_uri: string) => void;
  onFileRemove?: (file_uri: string) => void;
}

const AnnotationViewFileGroup: FC<AnnotationViewFileGroupProps> = ({ hideFilePreviewGrid, onFileClick, onFileRemove }) => {
  const [groupTags, setGroupTags] = useActiveAnnotation((store) => [store.group.tags, store.setGroupTags]);
  const [group, setGroup] = useActiveAnnotation((store) => [store.group, store.setGroup]);

  return (
    <View style={groupViewStyles.annotateGroupContainer}>
      <Text style={groupViewStyles.groupDetailsText}>Group Details</Text>
      <TranscribeTextInput value={group.title} onChangeText={(text) => setGroup({ ...group, title: text })} placeholder='Enter title' />
      <TranscribeTextInput
        value={group.description}
        onChangeText={(text) => setGroup({ ...group, description: text })}
        placeholder='Enter description'
        multiline
        d
        noFullScreen
      />
      <TagAnnotationInput tags={groupTags} onTagsChange={setGroupTags} />
      {!hideFilePreviewGrid && (
        <ScrollView style={groupViewStyles.scollViewContainer}>
          <FilePreviewGrid files={group.files} onFileRemove={onFileRemove} onFileClick={onFileClick} />
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
