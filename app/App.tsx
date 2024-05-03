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
import AddFilesPage from "./pages/AddFilesPage";
import TestingPage from "./pages/TestingPage";

const Stack = createNativeStackNavigator();

export type PageParams = {
  home: undefined;
  settings: undefined;
  file_system: undefined;
  add_files: undefined;
  testing: undefined;
};

export type HomePageProps = NativeStackScreenProps<PageParams, "home">;
export type SettingsPageProps = NativeStackScreenProps<PageParams, "settings">;
export type FileSystemPageProps = NativeStackScreenProps<PageParams, "file_system">;
export type AddFilesPageProps = NativeStackScreenProps<PageParams, "add_files">;
export type TestingPageProps = NativeStackScreenProps<PageParams, "testing">;

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
        <Stack.Screen name='add_files' component={AddFilesPage} options={{ headerBackVisible: false }} />
        <Stack.Screen name='testing' component={TestingPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
