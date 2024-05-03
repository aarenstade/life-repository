import { FC } from "react";
import { View } from "react-native";
import TagAnnotationInput from "../components/inputs/transcribe-inputs/TagAnnotationInput";

interface TestingPageProps {}

const TestingPage: FC<TestingPageProps> = () => {
  return (
    <View>
      <TagAnnotationInput
        tags={[]}
        onTagsChange={function (tags: string[]): void {
          throw new Error("Function not implemented.");
        }}
      />
    </View>
  );
};

export default TestingPage;
