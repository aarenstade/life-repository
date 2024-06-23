import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { HomePageProps, PageParams } from "../App";
import CardButton from "../components/CardButton";
import { Feather } from "@expo/vector-icons";

const HomePage: FC<HomePageProps> = ({ navigation }) => {
  const navigateToPage = (page: keyof PageParams) => {
    navigation.navigate(page);
  };

  return (
    <View style={styles.container}>
      <CardButton icon={<Feather name='file' size={24} color='black' />} title='File System' onClick={() => navigateToPage("file_system")} />
      <Text style={styles.title}>Annotation Groups</Text>
      <CardButton
        icon={<Feather name='edit' size={24} color='black' />}
        title='Create Annotation Group'
        onClick={() => navigateToPage("create_annotation_group")}
      />
      <CardButton
        icon={<Feather name='save' size={24} color='black' />}
        title='Saved Annotation Groups'
        onClick={() => navigateToPage("saved_annotation_groups")}
      />
      <CardButton
        icon={<Feather name='file-text' size={24} color='black' />}
        title='Draft Annotation Groups'
        onClick={() => navigateToPage("draft_annotation_groups")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "left",
  },
});

export default HomePage;
