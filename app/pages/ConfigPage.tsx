import React, { useState, FC } from "react";
import { Button, TextInput, Text, View, StyleSheet } from "react-native";
import useConfig from "../hooks/useConfig";
import LoadingIndicator from "../components/LoadingIndicator";

interface ConfigPageProps {}

const ConfigPage: FC<ConfigPageProps> = () => {
  const config = useConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [newApiUrl, setNewApiUrl] = useState(config.api_url);

  const testConnection = async () => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (urlRegex.test(newApiUrl)) {
      config.setApiUrl(newApiUrl);
      setIsEditing(false);
    } else {
      alert("Please enter a valid URL.");
    }
  };

  if (config.loading) {
    return <LoadingIndicator text='Loading...' />;
  }

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 4,
    },
    errorText: {
      color: "#ef4444", // red-500
      textAlign: "center",
    },
    successText: {
      color: "#22c55e", // green-500
      textAlign: "center",
      fontSize: 12,
    },
    inputContainer: {
      width: "80%",
      alignItems: "center",
    },
    input: {
      backgroundColor: "white",
      borderColor: "#6b7280", // gray-500
      borderWidth: 1,
      flexGrow: 1,
      marginTop: 4,
      marginBottom: 2,
      width: "100%",
    },
    apiUrlText: {
      marginVertical: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Url</Text>
      {config.error && <Text style={styles.errorText}>{config.error}</Text>}
      {config.connected && config.data && <Text style={styles.successText}>Successfully Connected</Text>}
      <View style={styles.inputContainer}>
        {!config.api_url ? (
          <>
            <TextInput placeholder='Set API URL' value={newApiUrl} onChangeText={setNewApiUrl} autoCapitalize='none' style={styles.input} />
            <Button onPress={() => testConnection()} title='Save' />
          </>
        ) : (
          <>
            {!isEditing ? (
              <>
                <Text style={styles.apiUrlText}>{config.api_url}</Text>
                <Button onPress={() => setIsEditing(true)} title='Edit' />
              </>
            ) : (
              <>
                <TextInput value={newApiUrl} onChangeText={setNewApiUrl} autoCapitalize='none' style={styles.input} />
                <Button onPress={() => testConnection()} title='Save' />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default ConfigPage;
