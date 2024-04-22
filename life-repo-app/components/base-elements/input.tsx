import { TextInput, TextInputProps } from "react-native";
import { styled } from "nativewind";
import { twMerge } from "tailwind-merge";

const _Input = ({ className, ...props }: TextInputProps) => <TextInput className={twMerge("border p-2 rounded", className)} {...props} />;
const _TextArea = ({ className, ...props }: TextInputProps) => (
  <TextInput multiline={true} className={twMerge("border p-2 rounded h-24", className)} {...props} />
);

export const Input = styled(_Input);
export const TextArea = styled(_TextArea);
