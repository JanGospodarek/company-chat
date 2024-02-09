import { View, Text, ScrollView } from "react-native";
import Chat from "./Chat";
import { useTheme } from "react-native-paper";

const ChatList = () => {
  const theme = useTheme();
  return (
    <ScrollView>
      <Text
        style={{
          color: theme.colors.primary,
          fontFamily: "League-Spartan-SemiBold",
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        All messages
      </Text>
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
    </ScrollView>
  );
};
export default ChatList;
