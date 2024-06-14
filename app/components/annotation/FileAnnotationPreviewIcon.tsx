import { FC } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FileAnnotation } from "../../types/annotation";

const FileAnnotationPreviewIcon: FC<{ file: FileAnnotation; onDelete?: () => void; onClick?: () => void }> = ({ file, onDelete, onClick }) => {
  const fileType = file.uri.split(".").pop()?.toLowerCase();

  const renderDeleteButton = () => (
    <TouchableOpacity style={{ position: "absolute", top: -10, right: -10, padding: 5, zIndex: 1 }} onPress={onDelete}>
      <View style={{ backgroundColor: "white", borderRadius: 50, padding: 2 }}>
        <Feather name='x' size={18} color='black' />
      </View>
    </TouchableOpacity>
  );

  const renderStatusIcon = () => {
    switch (file.status) {
      case "uploading":
        return (
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3E0" }}>
            <Feather name='upload' size={18} color='orange' />
            <Text style={{ marginLeft: 5, color: "orange" }}>Uploading</Text>
          </View>
        );
      case "uploaded":
        return (
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#E8F5E9" }}>
            <Feather name='check' size={18} color='green' />
            <Text style={{ marginLeft: 5, color: "green" }}>Uploaded</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const handlePress = () => {
    if (onClick) {
      onClick();
    }
  };

  const renderFilePreview = () => {
    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image source={{ uri: file.uri }} style={{ width: 100, height: 100, margin: 10 }} />;
      case "mp4":
      case "mov":
        return <Text style={{ color: "#fff" }}>Video</Text>;
      case "pdf":
        return <Text style={{ color: "#fff" }}>PDF</Text>;
      default:
        return <Text style={{ color: "#fff" }}>File</Text>;
    }
  };

  const renderFileDetails = () => {
    const truncateDescription = (desc: string) => {
      return desc.length > 20 ? `${desc.substring(0, 50)}...` : desc;
    };

    return (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 10, color: file.description ? "black" : "gray" }}>
          {file.description ? truncateDescription(file.description) : "No description"}{" "}
        </Text>
        <Text style={{ fontSize: 10, color: file.tags.length > 0 ? "black" : "gray" }}>
          {file.tags.length > 0 ? `${file.tags.length} tags` : "No tags"}{" "}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={{ position: "relative", width: 100, height: 140, margin: 10 }}>
        {onDelete && renderDeleteButton()}
        <View
          style={{
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: fileType === "mp4" || fileType === "mov" ? "#000" : fileType === "pdf" ? "#e74c3c" : "#95a5a6",
          }}
        >
          {renderFilePreview()}
        </View>
        <View style={{ position: "absolute", top: -10, left: 0, padding: 5 }}>{renderStatusIcon()}</View>
        {renderFileDetails()}
      </View>
    </TouchableOpacity>
  );
};

export default FileAnnotationPreviewIcon;
