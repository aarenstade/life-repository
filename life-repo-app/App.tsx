import { View, Text, Button } from "react-native";
import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Hello World");
    setCount(count + 1);
  };

  return (
    <View className='flex-1 items-center justify-center'>
      <Text>Awesome</Text>
      <Button title='Click me' onPress={handleClick} />
      <Text>Click Count: {count}</Text>
    </View>
  );
}
