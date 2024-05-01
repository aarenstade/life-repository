import { FC } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface MultiStepChinViewProps {
  onContinue: () => void;
  onCancel: () => void;
  onBack?: () => void;
}

const MultiStepChinView: FC<MultiStepChinViewProps> = ({ onContinue, onCancel, onBack }) => {
  return (
    <View style={chinViewStyles.chinViewContainer}>
      <TouchableOpacity onPress={onCancel} style={[chinViewStyles.chinViewButton, chinViewStyles.cancelButton]}>
        <Text style={chinViewStyles.chinViewButtonText}>Cancel</Text>
      </TouchableOpacity>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={[chinViewStyles.chinViewButton, chinViewStyles.normalButton]}>
          <Text style={chinViewStyles.chinViewButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onContinue} style={[chinViewStyles.chinViewButton, chinViewStyles.normalButton]}>
        <Text style={chinViewStyles.chinViewButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const chinViewStyles = StyleSheet.create({
  chinViewContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  chinViewButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: "#A4A4A4", // Gray
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF", // Blue outline
  },
  normalButton: {
    backgroundColor: "#007AFF", // Blue
  },
  chinViewButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default MultiStepChinView;
