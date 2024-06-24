import { FC } from "react";
import { AnnotationGroup } from "../../types/annotation";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { formatTimestampDistanceToNow } from "../../utilities/general";
import { AntDesign } from "@expo/vector-icons";
import FileDisplay from "../media/FileDisplay";

interface AnnotationGroupRowProps {
  group: AnnotationGroup;
  onDelete: (groupId: string) => void;
  onClick: (groupId: string) => void;
}

const AnnotationGroupRow: FC<AnnotationGroupRowProps> = ({ group, onDelete, onClick }) => (
  <TouchableOpacity style={styles.annotationGroupRow} onPress={() => onClick(group.group_id)}>
    {group.files.length > 0 && (
      <FileDisplay file_id={group.cover_image_file_id || group.files?.[0].file_id || ""} show_thumbnail style={styles.annotationGroupImage} />
    )}
    <View style={styles.annotationGroupTextContainer}>
      <Text style={styles.annotationGroupTitle}>
        {group.title ? (group.title.length > 60 ? `${group.title.substring(0, 60)}...` : group.title) : "No Title"}
      </Text>
      {group.description && (
        <Text style={styles.annotationGroupDescription}>
          {group.description.length > 60 ? `${group.description.substring(0, 60)}...` : group.description}
        </Text>
      )}
      {group.created_at && <Text style={styles.annotationGroupDate}>Created: {formatTimestampDistanceToNow(group.created_at)}</Text>}
      {group.updated_at && <Text style={styles.annotationGroupDate}>Updated: {formatTimestampDistanceToNow(group.updated_at)}</Text>}
    </View>
    <TouchableOpacity
      style={styles.annotationGroupDeleteButton}
      onPress={(e) => {
        e.stopPropagation();
        onDelete(group.group_id);
      }}
    >
      <AntDesign name='delete' size={18} />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  annotationGroupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    position: "relative",
    height: "auto",
  },
  annotationGroupTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  annotationGroupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  annotationGroupDescription: {
    fontSize: 14,
    color: "#666",
  },
  annotationGroupImage: {
    width: 100,
    height: "100%",
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  annotationGroupDate: {
    fontSize: 12,
    color: "#999",
  },
  annotationGroupDeleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default AnnotationGroupRow;
