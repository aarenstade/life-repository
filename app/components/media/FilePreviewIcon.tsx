import { FC } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const FilePreviewIcon: FC<{ uri: string; onDelete?: () => void; onClick?: () => void }> = ({ uri, onDelete, onClick }) => {
  const fileType = uri.split(".").pop()?.toLowerCase();

  const renderDeleteButton = () => (
    <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 5, zIndex: 1 }} onPress={onDelete}>
      <View style={{ backgroundColor: "white", borderRadius: 50, padding: 2 }}>
        <Feather name='x' size={18} color='black' />
      </View>
    </TouchableOpacity>
  );

  const handlePress = () => {
    if (onClick) {
      onClick();
    }
  };

  switch (fileType) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return (
        <TouchableOpacity onPress={handlePress}>
          <View>
            {onDelete && renderDeleteButton()}
            <Image source={{ uri }} style={{ width: 100, height: 100, margin: 10 }} />
          </View>
        </TouchableOpacity>
      );
    case "mp4":
    case "mov":
      return (
        <TouchableOpacity onPress={handlePress}>
          <View style={{ width: 100, height: 100, margin: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
            {onDelete && renderDeleteButton()}
            <Text style={{ color: "#fff" }}>Video</Text>
          </View>
        </TouchableOpacity>
      );
    case "pdf":
      return (
        <TouchableOpacity onPress={handlePress}>
          <View style={{ width: 100, height: 100, margin: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#e74c3c" }}>
            {onDelete && renderDeleteButton()}
            <Text style={{ color: "#fff" }}>PDF</Text>
          </View>
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity onPress={handlePress}>
          <View style={{ width: 100, height: 100, margin: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#95a5a6" }}>
            {onDelete && renderDeleteButton()}
            <Text style={{ color: "#fff" }}>File</Text>
          </View>
        </TouchableOpacity>
      );
  }
};

export default FilePreviewIcon;
