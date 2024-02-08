import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";

const Conversation = () => {
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log(id);
  }, [id]);
  return (
    <View>
      <Text>ccc</Text>
    </View>
  );
};
export default Conversation;
