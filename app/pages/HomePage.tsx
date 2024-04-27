import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { HomePageProps, PageParams } from "../App";
import CardButton from "../components/CardButton";
import { Feather } from "@expo/vector-icons";
import TranscribeTextArea from "../components/inputs/TranscribeTextArea";

const HomePage: FC<HomePageProps> = ({ navigation }) => {
  const navigateToPage = (page: keyof PageParams) => {
    navigation.navigate(page);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <CardButton icon={<Feather name='file' size={24} color='black' />} title='File System' onClick={() => navigateToPage("file_system")} />
      <CardButton icon={<Feather name='plus-circle' size={24} color='black' />} title='Add Files' onClick={() => navigateToPage("add_files")} />
      <TranscribeTextArea />
    </View>
  );
};

export default HomePage;
