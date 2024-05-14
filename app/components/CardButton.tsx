import { FC, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

type ButtonSize = "small" | "default" | "large";

interface CardButtonProps {
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  onClick: () => void;
  size?: ButtonSize;
}

const CardButton: FC<CardButtonProps> = ({ icon, title, subtitle, onClick, size = "default" }) => {
  const handlePress = useCallback(() => {
    onClick();
  }, [onClick]);

  const styles = useMemo(() => {
    const baseStyles = StyleSheet.create({
      container: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: size === "small" ? 10 : size === "large" ? 30 : 20,
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
        fontSize: size === "small" ? 16 : size === "large" ? 22 : 18,
        fontWeight: "normal",
      },
      subtitle: {
        fontSize: size === "small" ? 12 : size === "large" ? 20 : 16,
      },
    });
    return baseStyles;
  }, [size]);

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
