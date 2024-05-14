import React, { FC } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AnnotationGroup } from "../../types/annotation";
import { format } from "date-fns";
import { formatDatetime, formatTimestampDistanceToNow } from "../../utilities/general";

interface AnnotationDraftsListProps {
  drafts: AnnotationGroup[];
  onDelete: (groupId: string) => void;
  onClick: (groupId: string) => void;
}

const AnnotationDraftsList: FC<AnnotationDraftsListProps> = ({ drafts, onDelete, onClick }) => {
  const sortedDrafts = drafts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const renderItem = ({ item }: { item: AnnotationGroup }) => (
    <TouchableOpacity style={styles.draftItem} onPress={() => onClick(item.group_id)}>
      {item.files.length > 0 && <Image source={{ uri: item.files[0].uri }} style={styles.draftImage} />}
      <View style={styles.textContainer}>
        <Text style={styles.draftTitle}>{item.title || "No Title"}</Text>
        {item.description && (
          <Text style={styles.draftDescription}>{item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}</Text>
        )}
        {item.created_at && <Text style={styles.draftDate}>Created: {formatTimestampDistanceToNow(item.created_at)}</Text>}
        {item.updated_at && <Text style={styles.draftDate}>Updated: {formatTimestampDistanceToNow(item.updated_at)}</Text>}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          onDelete(item.group_id);
        }}
      >
        <AntDesign name='delete' size={18} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return <FlatList data={sortedDrafts} renderItem={renderItem} keyExtractor={(item) => item.group_id} />;
};

const styles = StyleSheet.create({
  draftItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    position: "relative",
    height: 100,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  draftTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  draftDescription: {
    fontSize: 14,
    color: "#666",
  },
  draftImage: {
    width: 100,
    height: "100%",
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  draftDate: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default AnnotationDraftsList;
