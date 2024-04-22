import React, { FC } from "react";
import { View, Image, Text } from "react-native";

interface FileGridProps {
  files_uris: string[];
}

const FileIcon: FC<{ uri: string }> = ({ uri }) => {
  const fileType = uri.split(".").pop()?.toLowerCase();

  switch (fileType) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <Image source={{ uri }} style={{ width: 100, height: 100, margin: 10 }} />;
    case "mp4":
    case "mov":
      return (
        <View style={{ width: 100, height: 100, margin: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
          <Text style={{ color: "#fff" }}>Video</Text>
        </View>
      );
    case "pdf":
      return (
        <View style={{ width: 100, height: 100, margin: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#e74c3c" }}>
          <Text style={{ color: "#fff" }}>PDF</Text>
        </View>
      );
    default:
      return (
        <View style={{ width: 100, height: 100, margin: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#95a5a6" }}>
          <Text style={{ color: "#fff" }}>File</Text>
        </View>
      );
  }
};

const FileGrid: FC<FileGridProps> = ({ files_uris }) => {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
      {files_uris.map((uri, index) => (
        <FileIcon key={index} uri={uri} />
      ))}
    </View>
  );
};

export default FileGrid;
