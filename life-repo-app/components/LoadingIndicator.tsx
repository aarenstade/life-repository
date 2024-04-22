import { FC } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

type LoadingIndicatorProps = { text?: string; style?: object };

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ text, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size='large' color='#0000ff' />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default LoadingIndicator;
