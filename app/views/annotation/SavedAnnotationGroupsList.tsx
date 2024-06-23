import { FC } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import useQuery from "../../hooks/useQuery";
import AnnotationGroupRow from "../../components/annotation/AnnotationGroupRow";

interface SavedAnnotationGroupListItemProps {
  groupId: string;
}

const SavedAnnotationGroupListItem: FC<SavedAnnotationGroupListItemProps> = ({ groupId }) => {
  const { data, isLoading, error } = useQuery(`/annotations/group/${groupId}`);

  if (isLoading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return <AnnotationGroupRow group={data} onDelete={() => {}} onClick={() => {}} />;
};
const SavedAnnotationGroupsList: FC = () => {
  const { data, isLoading, error } = useQuery("/annotations/groups/ids");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      {data && data.map((groupId: string) => <SavedAnnotationGroupListItem key={groupId} groupId={groupId} />)}
    </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupDescription: {
    fontSize: 14,
    color: "#666",
  },
  noGroupsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SavedAnnotationGroupsList;
