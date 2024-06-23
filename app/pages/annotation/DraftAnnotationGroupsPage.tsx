import { FC } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import DraftAnnotationGroupsList from "../../views/annotation/DraftAnnotationGroupsList";
import { DraftAnnotationGroupsPageProps } from "../../App";

const DraftAnnotationGroupsPage: FC<DraftAnnotationGroupsPageProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draft Annotation Groups</Text>
      <DraftAnnotationGroupsList onClick={(groupId) => navigation.navigate("create_annotation_group")} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("create_annotation_group")}>
        <Text style={styles.buttonText}>Create New Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default DraftAnnotationGroupsPage;
