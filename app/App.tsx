import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";

import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import useConfig from "./hooks/useConfig";
import LoadingIndicator from "./components/LoadingIndicator";

import HomePage from "./pages/HomePage";
import ConfigPage from "./pages/ConfigPage";
import FileSystemPage from "./pages/FileSystemPage";

import CreateAnnotationGroupPage from "./pages/annotation/CreateAnnotationGroupPage";
import SavedAnnotationGroupsPage from "./pages/annotation/SavedAnnotationGroupsPage";
import DraftAnnotationGroupsPage from "./pages/annotation/DraftAnnotationGroupsPage";

const Stack = createNativeStackNavigator();

export type PageParams = {
  home: undefined;
  settings: undefined;
  file_system: undefined;
  create_annotation_group: { group_id?: string };
  saved_annotation_groups: undefined;
  draft_annotation_groups: undefined;
};

export type HomePageProps = NativeStackScreenProps<PageParams, "home">;
export type SettingsPageProps = NativeStackScreenProps<PageParams, "settings">;
export type FileSystemPageProps = NativeStackScreenProps<PageParams, "file_system">;
export type CreateAnnotationGroupPageProps = NativeStackScreenProps<PageParams, "create_annotation_group">;
export type SavedAnnotationGroupsPageProps = NativeStackScreenProps<PageParams, "saved_annotation_groups">;
export type DraftAnnotationGroupsPageProps = NativeStackScreenProps<PageParams, "draft_annotation_groups">;

export default function App() {
  const config = useConfig();

  const styles = StyleSheet.create({
    headerRightContainer: {
      flexDirection: "row",
      marginRight: 10,
      gap: 10,
    },
    loadingIndicator: {
      marginRight: 10,
    },
  });

  const globalScreenOptions = ({ route, navigation }) => ({
    title: route.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    headerRight: () => (
      <View style={styles.headerRightContainer}>
        {config.loading ? (
          <LoadingIndicator style={styles.loadingIndicator} />
        ) : config.connected ? (
          <Feather name='check' size={24} color='green' />
        ) : (
          <Feather name='alert-circle' size={24} color='red' />
        )}
        <TouchableOpacity onPress={() => navigation.navigate("settings")}>
          <Feather name='settings' size={24} color='black' />
        </TouchableOpacity>
      </View>
    ),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='home' component={HomePage} />
        <Stack.Screen name='settings' component={ConfigPage} />
        <Stack.Screen name='file_system' component={FileSystemPage} />
        <Stack.Screen name='create_annotation_group' component={CreateAnnotationGroupPage} options={{ headerBackVisible: false }} />
        <Stack.Screen name='saved_annotation_groups' component={SavedAnnotationGroupsPage} />
        <Stack.Screen name='draft_annotation_groups' component={DraftAnnotationGroupsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
