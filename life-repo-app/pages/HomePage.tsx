import React, { FC } from "react";
import { View } from "react-native";
import { HomePageProps } from "../App";

const HomePage: FC<HomePageProps> = ({ navigation }) => {
  return <View className='flex flex-col justify-center items-center m-4'></View>;
};

export default HomePage;
