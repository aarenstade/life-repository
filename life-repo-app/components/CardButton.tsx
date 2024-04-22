import { FC, useCallback } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Heading, Paragraph } from "./base-elements/text";

interface CardButtonProps {
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  onClick: () => void;
}

const CardButton: FC<CardButtonProps> = ({ icon, title, subtitle, onClick }) => {
  const handlePress = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <View className='flex flex-row justify-center items-center space-x-2 border mx-4 my-2 p-8 rounded-lg'>
      <TouchableOpacity onPress={handlePress} className='w-full h-full flex flex-row justify-center items-center space-x-2'>
        <View>{icon}</View>
        <View>
          <Heading className='text-lg font-normal'>{title}</Heading>
          {subtitle && <Paragraph>{subtitle}</Paragraph>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardButton;
