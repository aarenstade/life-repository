import React, { useState, FC } from "react";
import { Button, TextInput, Text, View } from "react-native";
import useConfig from "../hooks/useConfig";
import LoadingIndicator from "../components/LoadingIndicator";
import { Paragraph } from "../components/base-elements/text";
import { Input } from "../components/inputs/input";

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

  return (
    <View className='flex flex-col justify-center items-center m-4'>
      <Text className='text-xl font-bold mb-4'>API Url</Text>
      {config.error && <Paragraph className='text-red-500 text-center'>{config.error}</Paragraph>}
      {config.connected && config.data && <Paragraph className='text-green-500 text-center text-xs'>Successfully Connected</Paragraph>}
      <View style={{ width: "80%", alignItems: "center" }}>
        {!config.api_url ? (
          <>
            <Input placeholder='Set API URL' value={newApiUrl} onChangeText={setNewApiUrl} autoCapitalize='none' className='mt-4 mb-2 w-full' />
            <Button onPress={() => testConnection()} title='Save' />
          </>
        ) : (
          <>
            {!isEditing ? (
              <>
                <Paragraph style={{ marginVertical: 8 }}>{config.api_url}</Paragraph>
                <Button onPress={() => setIsEditing(true)} title='Edit' />
              </>
            ) : (
              <>
                <Input value={newApiUrl} onChangeText={setNewApiUrl} autoCapitalize='none' className='mt-4 mb-2 w-full' />
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
