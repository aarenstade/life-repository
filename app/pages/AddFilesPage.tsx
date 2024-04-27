import { FC, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import ImageCameraPicker from "../components/photos/ImageCameraPicker";
import { AddFilesPageProps } from "../App";
import FileGrid from "../components/photos/FileGrid";

const AddFilesPage: FC<AddFilesPageProps> = ({ navigation }) => {
  const [step, setStep] = useState("select-images");
  const [images, setImages] = useState<string[]>([]);

  const steps = ["select-images", "annotate-group", "annotate-images"];

  const [groupData, setGroupData] = useState({
    title: "",
    description: "",
    tags: [],
  });

  const handleNextStep = () => {
    const currentStepIndex = steps.indexOf(step);
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const currentStepIndex = steps.indexOf(step);
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => {
    if (images.length > 0) {
      Alert.alert(
        "Confirm",
        "Are you sure you want to cancel? All unsaved changes will be lost.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => navigation.navigate("home") },
        ],
        { cancelable: false }
      );
    } else {
      navigation.navigate("home");
    }
  };

  let view;
  const styles = StyleSheet.create({
    selectImagesContainer: {
      flex: 1,
      justifyContent: "space-between",
    },
    annotateGroupContainer: {
      padding: 20,
    },
    groupDetailsText: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 20,
    },
    inputMargin: {
      marginBottom: 20,
    },
  });

  if (step === "select-images") {
    view = (
      <View style={styles.selectImagesContainer}>
        <ImageCameraPicker defaultImages={images} onImagesChanged={setImages} />
      </View>
    );
  }

  if (step === "annotate-group") {
    view = (
      <View style={styles.annotateGroupContainer}>
        <Text style={styles.groupDetailsText}>Group Details</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setGroupData({ ...groupData, title: text })}
          value={groupData.title}
          placeholder='Enter title'
        />
        <TextInput
          style={[styles.input, styles.inputMargin]}
          onChangeText={(text) => setGroupData({ ...groupData, description: text })}
          value={groupData.description}
          placeholder='Enter description'
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setGroupData({ ...groupData, tags: text.split(",") })}
          value={groupData.tags.join(",")}
          placeholder='Enter tags, separated by commas'
        />
      </View>
    );
  }

  if (step == "annotate-images") {
    view = <View></View>;
  }
  const mainStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    buttonContainer: {
      flexGrow: 1,
      marginTop: 8,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
      borderRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 4,
    },
    continueButton: {
      backgroundColor: "#007bff",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
    },
    buttonText: {
      color: "#ffffff",
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <View style={mainStyles.container}>
      {view}
      <ScrollView>{images && <FileGrid files_uris={images} />}</ScrollView>
      <View style={mainStyles.buttonContainer}>
        {images.length > 0 && (
          <TouchableOpacity style={[mainStyles.button, mainStyles.continueButton]} onPress={handleNextStep}>
            <Text style={mainStyles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[mainStyles.button, mainStyles.cancelButton]}
          onPress={() => (step == "select-images" ? handleCancel() : handlePreviousStep())}
        >
          <Text style={mainStyles.buttonText}>{step == "select-images" ? "Cancel" : "Back"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddFilesPage;
