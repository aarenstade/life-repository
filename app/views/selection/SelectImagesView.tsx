import { FC } from "react";
import { View, StyleSheet } from "react-native";
import ImageCameraPicker from "../../components/media/ImageCameraPicker";

interface SelectImagesViewProps {
  images: string[];
  onSelectMultipleImages: (images: string[]) => void;
  onSelectSingleImage: (image: string) => void;
  selectMultiple?: boolean;
}

const SelectImagesView: FC<SelectImagesViewProps> = ({ images, onSelectSingleImage, onSelectMultipleImages, selectMultiple }) => {
  return (
    <View style={styles.selectImagesContainer}>
      <ImageCameraPicker
        images={images}
        onImagesChanged={onSelectMultipleImages}
        onImageSelect={onSelectSingleImage}
        selectMultiple={selectMultiple}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectImagesContainer: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default SelectImagesView;
