import React, { FC, useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import FileGrid from "./FileGrid";

interface ImageCameraPickerProps {
  defaultImages: string[];
  onImagesChanged: (images: string[]) => void;
  showImages?: boolean;
}

const ImageCameraPicker: FC<ImageCameraPickerProps> = ({ defaultImages, onImagesChanged, showImages = false }) => {
  const [images, setImages] = useState<string[]>(defaultImages);

  useEffect(() => {
    onImagesChanged(images);
  }, [images]);

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
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((img) => img.uri);
      const allImages = Array.from(new Set([...images, ...newImages]));
      setImages(allImages);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImages([...images, ...result.assets.map((img) => img.uri)]);
    }
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
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
      {showImages && <FileGrid files_uris={images} />}
    </View>
  );
};

export default ImageCameraPicker;
