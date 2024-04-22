import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";

import HomePage from "./pages/HomePage";
import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ConfigPage from "./pages/ConfigPage";
import useConfig from "./hooks/useConfig";
import LoadingIndicator from "./components/LoadingIndicator";

const Stack = createNativeStackNavigator();

export type PageParams = {
  Home: undefined;
  Settings: undefined;
};

export type HomePageProps = NativeStackScreenProps<PageParams, "Home">;

export default function App() {
  const config = useConfig();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomePage}
          options={({ navigation }) => ({
            headerRight: () => (
              <View className='flex flex-row space-x-4'>
                {config.loading ? (
                  <LoadingIndicator style={{ marginRight: 10 }} />
                ) : config.connected ? (
                  <Feather name='check' size={24} color='green' />
                ) : (
                  <Feather name='alert-circle' size={24} color='red' />
                )}
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                  <Feather name='settings' size={24} color='black' />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name='Settings' component={ConfigPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
