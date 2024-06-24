import React, { FC } from "react";
import { View, Alert } from "react-native";
import FilePreviewIcon from "./FileAnnotationPreviewIcon";
import { FileAnnotation } from "../../types/annotation";
import { useActiveAnnotation } from "../../state/annotations";

interface FileAnnotationPreviewGridProps {
  files: FileAnnotation[];
  onFileClick?: (uri: string) => void;
  onFileRemove?: (uri: string) => void;
}

const FileAnnotationPreviewGrid: FC<FileAnnotationPreviewGridProps> = ({ files, onFileClick, onFileRemove }) => {
  const cover_file_id = useActiveAnnotation((state) => state.group.cover_image_file_id);

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
          featured={file.file_id === cover_file_id}
          onClick={() => onFileClick(file.uri)}
          onDelete={onFileRemove ? () => handleDelete(file.uri) : undefined}
        />
      ))}
    </View>
  );
};

export default FileAnnotationPreviewGrid;
