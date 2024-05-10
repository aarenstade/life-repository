import React, { FC, ReactNode } from "react";
import { Modal as RNModal, StyleSheet, View, Dimensions, TouchableWithoutFeedback } from "react-native";

type VerticalPosition = "top" | "center" | "bottom";

interface ModalProps {
  visible: boolean;
  children: ReactNode;
  onRequestClose: () => void;
  verticalPosition?: VerticalPosition;
}

const Modal: FC<ModalProps> = ({ visible, children, onRequestClose, verticalPosition = "center" }) => {
  return (
    <RNModal transparent={true} animationType='fade' visible={visible} onRequestClose={onRequestClose} statusBarTranslucent={true}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={[styles.modalOverlay, verticalPositionStyles[verticalPosition]]}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width - 40, // Adjusted width to include padding
    marginHorizontal: 20,
    marginVertical: 80, // Adjusted for top navigation bar clearance
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const verticalPositionStyles = StyleSheet.create({
  top: {
    justifyContent: "flex-start",
  },
  center: {
    justifyContent: "center",
  },
  bottom: {
    justifyContent: "flex-end",
  },
});

export default Modal;
