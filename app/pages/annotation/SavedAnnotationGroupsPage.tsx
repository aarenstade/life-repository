import { FC } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import SavedAnnotationGroupsList from "../../views/annotation/SavedAnnotationGroupsList";
import { SavedAnnotationGroupsPageProps } from "../../App";
import FileDisplay from "../../components/media/FileDisplay";

const SavedAnnotationGroupsPage: FC<SavedAnnotationGroupsPageProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Annotation Groups</Text>
      <SavedAnnotationGroupsList />
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

export default SavedAnnotationGroupsPage;
