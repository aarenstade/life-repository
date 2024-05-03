import { FC } from "react";
import { View, StyleSheet } from "react-native";
import ImageCameraPicker from "../../components/media/ImageCameraPicker";

interface SelectImagesViewProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const SelectImagesView: FC<SelectImagesViewProps> = ({ images, setImages }) => {
  return (
    <View style={styles.selectImagesContainer}>
      <ImageCameraPicker images={images} onImagesChanged={setImages} />
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
