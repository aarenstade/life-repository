import { FC, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
    <View className='grow flex flex-row justify-center items-center space-x-2 border mx-4 my-2 p-8 rounded-lg'>
      <TouchableOpacity onPress={handlePress} className='w-full h-full flex flex-row justify-center items-center space-x-2'>
        <View>{icon}</View>
        <View>
          <Text className='text-lg font-normal'>{title}</Text>
          {subtitle && <Text>{subtitle}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardButton;
