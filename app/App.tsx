import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";

import HomePage from "./pages/HomePage";
import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ConfigPage from "./pages/ConfigPage";
import useConfig from "./hooks/useConfig";
import LoadingIndicator from "./components/LoadingIndicator";

import FileSystemPage from "./pages/FileSystemPage";
import AddFilesPage from "./pages/AddFilesPage";

const Stack = createNativeStackNavigator();

export type PageParams = {
  home: undefined;
  settings: undefined;
  file_system: undefined;
  add_files: undefined;
};

export type HomePageProps = NativeStackScreenProps<PageParams, "home">;
export type SettingsPageProps = NativeStackScreenProps<PageParams, "settings">;
export type FileSystemPageProps = NativeStackScreenProps<PageParams, "file_system">;
export type AddFilesPageProps = NativeStackScreenProps<PageParams, "add_files">;

export default function App() {
  const config = useConfig();

  const globalScreenOptions = ({ route, navigation }) => ({
    title: route.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    headerRight: () => (
      <View className='flex flex-row space-x-4'>
        {config.loading ? (
          <LoadingIndicator style={{ marginRight: 10 }} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
