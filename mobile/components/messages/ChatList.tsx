import { View, Text } from "react-native";
import Chat from "./Chat";
import { useTheme } from "react-native-paper";

const ChatList = () => {
  const theme = useTheme();
  return (
    <View>
      <Text
        style={{
          color: theme.colors.primary,
          fontFamily: "League-Spartan-Bold",
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        All messages
      </Text>
      <Chat />
      <Chat />
      <Chat />
    </View>
  );
};
export default ChatList;
