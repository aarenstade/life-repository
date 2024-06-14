import React, { FC } from "react";
import { View, Alert } from "react-native";
import FilePreviewIcon from "./FileAnnotationPreviewIcon";
import { FileAnnotation } from "../../types/annotation";

interface FileAnnotationPreviewGridProps {
  files: FileAnnotation[];
  onFileClick?: (uri: string) => void;
  onFileRemove?: (uri: string) => void;
}

const FileAnnotationPreviewGrid: FC<FileAnnotationPreviewGridProps> = ({ files, onFileClick, onFileRemove }) => {
  const handleDelete = (uri: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this file?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            if (onFileRemove) {
              onFileRemove(uri);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
      {files.map((file, index) => (
        <FilePreviewIcon
          key={index}
          file={file}
          onClick={() => onFileClick(file.uri)}
          onDelete={onFileRemove ? () => handleDelete(file.uri) : undefined}
        />
      ))}
    </View>
  );
};

export default FileAnnotationPreviewGrid;
