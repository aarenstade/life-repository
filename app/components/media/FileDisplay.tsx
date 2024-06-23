import React, { FC, useEffect, useState } from "react";
import { Image, Text, View, StyleSheet, ActivityIndicator, StyleProp, ImageStyle, ViewStyle, TextStyle } from "react-native";
import * as FileSystem from "expo-file-system";
import useConfig from "../../hooks/useConfig";
import fetchAPI from "../../lib/api";

interface FileDisplayProps {
  uri: string;
  style?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
  merge?: boolean;
}

const FileDisplay: FC<FileDisplayProps> = ({ uri: fileUri, style, merge = false }) => {
  const [localUri, setLocalUri] = useState<string>("");
  const [fileContent, setFileContent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { api_url } = useConfig();

  const getFileExtension = (uri: string) => uri.split(".").pop()?.toLowerCase();
  const isExternalFile = (uri: string) => !uri.startsWith("file://");

  const loadFile = async (uri: string): Promise<string> => {
    setLoading(true);
    try {
      const response = await fetchAPI(api_url, "/paths/get-file/", { path: uri }, "GET", "blob");
      if (response.success) {
        const localUri = `${FileSystem.cacheDirectory}${uri.split("/").pop()}`;
        const blob = response.data;
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = async () => {
            const base64data = reader.result as string;
            await FileSystem.writeAsStringAsync(localUri, base64data.split(",")[1], { encoding: FileSystem.EncodingType.Base64 });
            resolve(localUri);
          };
          reader.readAsDataURL(blob);
        });
      } else {
        setFileContent(<Text>Error loading file</Text>);
        return "";
      }
    } catch (error) {
      setFileContent(<Text>Error loading file</Text>);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const displayFile = async (uri: string) => {
    const fileExtension = getFileExtension(uri);
    switch (fileExtension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        Image.getSize(uri, () => {
          const imageStyle: StyleProp<ImageStyle> = merge
            ? [{ height: "100%", minHeight: 200, maxHeight: 400, flexGrow: 1 }, style as ImageStyle]
            : [{ height: "100%", minHeight: 200, maxHeight: 400, flexGrow: 1 }, style as ImageStyle];
          setFileContent(<Image source={{ uri }} style={imageStyle} resizeMode='contain' />);
        });
        break;
      case "txt":
        try {
          const content = await FileSystem.readAsStringAsync(uri);
          const textStyle: StyleProp<TextStyle> = merge ? [style] : (style as TextStyle);
          setFileContent(<Text style={textStyle}>{content}</Text>);
        } catch (error) {
          setFileContent(<Text>Error loading file</Text>);
        }
        break;
      default:
        setFileContent(<Text>Unsupported file type</Text>);
    }
  };

  useEffect(() => {
    const fetchAndDisplayFile = async () => {
      if (isExternalFile(fileUri)) {
        const localUri = await loadFile(fileUri);
        if (localUri) {
          setLocalUri(localUri);
          displayFile(localUri);
        }
      } else {
        displayFile(fileUri);
      }
    };

    fetchAndDisplayFile();
  }, [fileUri, style, merge]);

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='small' color='#0000ff' />
    </View>
  ) : (
    fileContent
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FileDisplay;
