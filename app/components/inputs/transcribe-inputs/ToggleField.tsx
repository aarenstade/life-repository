import { FC, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

interface ToggleFieldProps {
  checked: boolean;
  onText: string;
  offText: string;
  onChange: (checked: boolean) => void;
}

const ToggleField: FC<ToggleFieldProps> = ({ checked, onText, offText, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <TouchableOpacity style={[styles.toggleContainer, isChecked && styles.checkedContainer]} onPress={handleToggle}>
      <Text style={styles.toggleText}>{isChecked ? onText : offText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  checkedContainer: {
    backgroundColor: "#87CEEB",
  },
  toggleText: {
    textAlign: "center",
    fontSize: 18,
  },
});

export default ToggleField;
