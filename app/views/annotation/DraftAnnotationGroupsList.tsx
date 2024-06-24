import React, { FC } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useAnnotationDrafts } from "../../state/annotations";
import AnnotationGroupRow from "../../components/annotation/AnnotationGroupRow";

interface DraftAnnotationGroupsListProps {
  onClick: (groupId: string) => void;
}

const DraftAnnotationGroupsList: FC<DraftAnnotationGroupsListProps> = ({ onClick }) => {
  const [drafts, setDrafts] = useAnnotationDrafts((store) => [store.draftGroups, store.setDraftGroups]);

  if (!drafts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  if (drafts.length === 0) {
    return (
      <View style={styles.noDraftsContainer}>
        <Text style={styles.noDraftsText}>No Draft Annotation Groups</Text>
      </View>
    );
  }

  const sortedDrafts = drafts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleDeleteDraft = (groupId: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this draft?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => setDrafts(drafts.filter((draft) => draft.group_id !== groupId)) },
    ]);
  };

  return (
    <ScrollView style={styles.scrollView}>
      {sortedDrafts.map((draft) => (
        <AnnotationGroupRow key={draft.group_id} group={draft} onDelete={handleDeleteDraft} onClick={onClick} />
      ))}
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
  noDraftsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDraftsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DraftAnnotationGroupsList;
