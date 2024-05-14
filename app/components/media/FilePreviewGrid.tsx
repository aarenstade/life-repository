import React, { FC } from "react";
import { View, Alert } from "react-native";
import FilePreviewIcon from "./FilePreviewIcon";

interface FilePreviewGridProps {
  files_uris: string[];
  onFileClick?: (uri: string) => void;
  onFileRemove?: (uri: string) => void;
}

const FilePreviewGrid: FC<FilePreviewGridProps> = ({ files_uris, onFileClick, onFileRemove }) => {
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
      {files_uris.map((uri, index) => (
        <FilePreviewIcon key={index} uri={uri} onClick={() => onFileClick(uri)} onDelete={onFileRemove ? () => handleDelete(uri) : undefined} />
      ))}
    </View>
  );
};

export default FilePreviewGrid;
