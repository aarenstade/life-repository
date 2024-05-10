import { FC, useState } from "react";
import { Button, View, Text } from "react-native";
import TagAnnotationInput from "../components/inputs/transcribe-inputs/TagAnnotationInput";
import Modal from "../components/Modal";

interface TestingPageProps {}

const TestingPage: FC<TestingPageProps> = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "blue" }}>
      <View style={{ width: "100%", height: 200, backgroundColor: "red" }}>
        <Button title='Show Modal' onPress={toggleModal} />
      </View>
      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <Text>Test Modal Content</Text>
        <Button title='Close' onPress={toggleModal} />
      </Modal>
      <TagAnnotationInput
        tags={[]}
        onTagsChange={(tags: string[]): void => {
          throw new Error("Function not implemented.");
        }}
      />
    </View>
  );
};

export default TestingPage;
