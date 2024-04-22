import React, { FC, useState, useEffect } from "react";
import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { Paragraph } from "../base-elements/text";
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

  return (
    <View>
      <TouchableOpacity onPress={pickMultipleImages} className='flex flex-row justify-center items-center p-2 bg-blue-500 rounded-lg shadow-lg'>
        <Feather name='image' size={24} color='white' />
        <Paragraph className='text-white pl-2'>Select Images</Paragraph>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto} className='flex flex-row justify-center items-center p-2 bg-green-500 rounded-lg shadow-lg mt-4'>
        <Feather name='camera' size={24} color='white' />
        <Paragraph className='text-white pl-2'>Take Photo</Paragraph>
      </TouchableOpacity>
      {showImages && <FileGrid files_uris={images} />}
    </View>
  );
};

export default ImageCameraPicker;
