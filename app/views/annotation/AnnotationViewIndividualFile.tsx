import { FC, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import TranscribeTextInput from "../../components/inputs/transcribe-inputs/TranscribeTextInput";
import MultiStepChinView from "../../components/control/MultiStepChinView";
import FileDisplay from "../../components/media/FileDisplay";
import { FileAnnotation, Tag } from "../../types/annotation";
import _ from "lodash";
import TagAnnotationInput from "../../components/inputs/transcribe-inputs/TagAnnotationInput";

interface IndividualFileAnnotationProps {
  file: FileAnnotation;
  onUpdate: (file: FileAnnotation) => void;
}

const IndividualFileAnnotation: FC<IndividualFileAnnotationProps> = ({ file, onUpdate }) => {
  const { height } = Dimensions.get("window");

  const updateFileTags = (tags: Tag[]) => {
    onUpdate({ ...file, tags });
  };

  const updateFileDescription = (text: string) => {
    onUpdate({ ...file, description: text });
  };

  return (
    <ScrollView
      style={{ flex: 1, flexDirection: "column", paddingHorizontal: 10 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", height: height * 1.5, gap: 10 }}
    >
      <FileDisplay file_uri={file.uri} />
      <TranscribeTextInput multiline value={file.description} onChangeText={updateFileDescription} insetBottom={height * 0.12} />
      <TagAnnotationInput tags={file.tags} onTagsChange={updateFileTags} />
    </ScrollView>
  );
};

interface AnnotationViewIndividualFileProps {
  files: FileAnnotation[];
  annotateMultiple?: boolean;
  onChange: (files: FileAnnotation | FileAnnotation[]) => void;
  onDone?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
}

const AnnotationViewIndividualFile: FC<AnnotationViewIndividualFileProps> = ({ files, annotateMultiple, onChange, onDone, onBack, onCancel }) => {
  const [currentFileId, setCurrentFileId] = useState<string | undefined>(files[0]?.uri);

  const findFileIndex = (fileId: string) => files.findIndex((file) => file.uri === fileId);

  const navigateToNextFile = () => {
    const currentIndex = findFileIndex(currentFileId!);
    if (currentIndex < files.length - 1) {
      setCurrentFileId(files[currentIndex + 1].uri);
    } else {
      onDone && onDone();
    }
  };

  const navigateToPreviousFile = () => {
    const currentIndex = findFileIndex(currentFileId!);
    if (currentIndex > 0) {
      setCurrentFileId(files[currentIndex - 1].uri);
    } else {
      onBack && onBack();
    }
  };

  const updateFileDescription = (updatedFile: FileAnnotation) => {
    const updatedFiles = files.map((file) => (file.uri === currentFileId ? updatedFile : file));
    onChange(annotateMultiple ? updatedFiles : updatedFile);
  };

  const currentFile = files.find((file) => file.uri === currentFileId);

  return (
    <View style={individualViewStyles.annotateIndividualContainer}>
      {annotateMultiple && (
        <Text style={{ textAlign: "right", fontSize: 10, paddingRight: 5, paddingTop: 5, paddingBottom: 5 }}>
          {findFileIndex(currentFileId!) + 1} of {files.length}
        </Text>
      )}
      {currentFile && <IndividualFileAnnotation file={currentFile} onUpdate={updateFileDescription} />}
      {annotateMultiple ? (
        <View style={{ width: "100%", height: "10%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
          <MultiStepChinView onContinue={navigateToNextFile} onBack={navigateToPreviousFile} onCancel={onCancel} />
        </View>
      ) : (
        <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
          <TouchableOpacity
            onPress={onDone}
            style={{
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginHorizontal: 10,
              marginBottom: 20,
              backgroundColor: "#007AFF",
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const individualViewStyles = StyleSheet.create({
  annotateIndividualContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  mainContentContainer: {
    flex: 1,
  },

  individualDetailsText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  fileDisplayContainer: {
    width: "100%",
  },
});

export default AnnotationViewIndividualFile;
