import React, { FC } from "react";
import { View, Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import FileGrid from "../annotation/FileAnnotationPreviewGrid";

interface ImageCameraPickerProps {
  images: string[];
  onImagesChanged?: (images: string[]) => void;
  onImageSelect?: (image: string) => void;
  selectMultiple?: boolean;
}

const ImageCameraPicker: FC<ImageCameraPickerProps> = ({ images, onImagesChanged, onImageSelect, selectMultiple }) => {
  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Sorry, we need camera permissions to make this work!");
      return false;
    }
    return true;
  };

  const requestCameraRollPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Sorry, we need camera roll permissions to make this work!");
      return false;
    }
    return true;
  };

  const pickMultipleImages = async () => {
    const hasPermission = await requestCameraRollPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: selectMultiple,
      quality: 1,
    });

    await handleImageResult(result);
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    await handleImageResult(result);
  };

  const handleImageResult = async (result) => {
    if (!result.canceled && result.assets) {
      const imageUris = await Promise.all(
        result.assets.map(async (img) => {
          const permanentUri = await saveImagePermanently(img.uri);
          return permanentUri;
        })
      );

      if (selectMultiple && onImagesChanged) {
        const allImages = Array.from(new Set([...images, ...imageUris]));
        onImagesChanged(allImages);
      } else if (!selectMultiple && onImageSelect && imageUris.length > 0) {
        onImageSelect(imageUris[0]);
      }
    }
  };

  const saveImagePermanently = async (tempUri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(tempUri);
    console.log(fileInfo);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    const fileName = tempUri.split("/").pop();
    const permanentUri = FileSystem.documentDirectory + fileName;

    await FileSystem.copyAsync({
      from: tempUri,
      to: permanentUri,
    });

    console.log("tempUri", tempUri);
    console.log("permanentUri", permanentUri);

    return permanentUri;
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 8,
      elevation: 5,
    },
    selectButton: {
      backgroundColor: "#007bff", // Blue
    },
    photoButton: {
      backgroundColor: "#28a745", // Green
      marginTop: 16,
    },
    buttonText: {
      color: "white",
      paddingLeft: 8,
    },
    icon: {
      color: "white",
    },
  });

  return (
    <View>
      <TouchableOpacity onPress={pickMultipleImages} style={[styles.button, styles.selectButton]}>
        <Feather name='image' size={24} style={styles.icon} />
        <Text style={styles.buttonText}>Select Images</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto} style={[styles.button, styles.photoButton]}>
        <Feather name='camera' size={24} style={styles.icon} />
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageCameraPicker;
