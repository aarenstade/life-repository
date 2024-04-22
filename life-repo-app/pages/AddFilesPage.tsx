import { FC, useState } from "react";
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import ImageCameraPicker from "../components/photos/ImageCameraPicker";
import { Heading, Paragraph } from "../components/base-elements/text";
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

  if (step == "select-images") {
    view = (
      <View className='flex flex-col justify-between'>
        <ImageCameraPicker defaultImages={images} onImagesChanged={setImages} />
      </View>
    );
  }

  if (step == "annotate-group") {
    view = (
      <View style={{ padding: 20 }}>
        <Heading className='text-xl font-bold mb-4'>Group Details</Heading>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 20 }}
          onChangeText={(text) => setGroupData({ ...groupData, title: text })}
          value={groupData.title}
          placeholder='Enter title'
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 20 }}
          onChangeText={(text) => setGroupData({ ...groupData, description: text })}
          value={groupData.description}
          placeholder='Enter description'
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
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

  return (
    <View className='py-4 mx-4 flex flex-col justify-between h-full'>
      {view}
      <ScrollView>{images && <FileGrid files_uris={images} />}</ScrollView>
      <View className='space-y-4'>
        {images.length > 0 && (
          <TouchableOpacity className='flex flex-row justify-center items-center p-2 bg-blue-500 rounded-lg shadow-lg' onPress={handleNextStep}>
            <Paragraph style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Continue</Paragraph>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className='flex flex-row justify-center items-center p-2 bg-gray-500 rounded-lg shadow-lg'
          onPress={() => (step == "select-images" ? handleCancel() : handlePreviousStep())}
        >
          <Paragraph style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>{step == "select-images" ? "Cancel" : "Back"}</Paragraph>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddFilesPage;
