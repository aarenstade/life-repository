import React, { FC, useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
// import { WebView } from 'react-native-webview';
// import Video from 'react-native-video';
import * as FileSystem from "expo-file-system";

interface FileDisplayProps {
  file_uri: string;
}

// TODO complete implementation for other file types

const FileDisplay: FC<FileDisplayProps> = ({ file_uri }) => {
  const [fileContent, setFileContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const fileExtension = file_uri.split(".").pop()?.toLowerCase();
    switch (fileExtension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        setFileContent(<Image source={{ uri: file_uri }} style={{ width: "100%", height: "100%" }} resizeMode='contain' />);
        break;
      //   case 'mp4':
      //   case 'mov':
      //     setFileContent(<Video source={{ uri: file_uri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />);
      //     break;
      //   case 'pdf':
      //     setFileContent(<WebView source={{ uri: file_uri }} style={{ flex: 1 }} />);
      //     break;
      case "txt":
        (async () => {
          try {
            const content = await FileSystem.readAsStringAsync(file_uri);
            setFileContent(<Text>{content}</Text>);
          } catch (error) {
            console.error("Error reading text file", error);
            setFileContent(<Text>Error loading file</Text>);
          }
        })();
        break;
      default:
        setFileContent(<Text>Unsupported file type</Text>);
    }
  }, [file_uri]);

  return fileContent;
};

export default FileDisplay;
