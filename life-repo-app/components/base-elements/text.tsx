import { styled } from "nativewind";
import { Text, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

const _Heading = ({ className, ...props }: TextProps) => <Text className={twMerge("text-2xl font-bold", className)} {...props} />;
const _SubHeading = ({ className, ...props }: TextProps) => <Text className={twMerge("text-xl font-semibold", className)} {...props} />;
const _Paragraph = ({ className, ...props }: TextProps) => <Text className={twMerge("text-base", className)} {...props} />;
const _Span = ({ className, ...props }: TextProps) => <Text className={twMerge("text-sm", className)} {...props} />;

export const Heading = styled(_Heading);
export const SubHeading = styled(_SubHeading);
export const Paragraph = styled(_Paragraph);
export const Span = styled(_Span);
