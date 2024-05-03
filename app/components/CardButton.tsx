import { FC, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface CardButtonProps {
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  onClick: () => void;
}

const CardButton: FC<CardButtonProps> = ({ icon, title, subtitle, onClick }) => {
  const handlePress = useCallback(() => {
    onClick();
  }, [onClick]);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 32,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
    },
    touchable: {
      width: "100%",
      height: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "normal",
    },
    subtitle: {
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <View style={{ marginRight: 8 }}>{icon}</View>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardButton;
