import { View, ScrollView } from "react-native";
import Chat from "./Chat";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import React from "react";
import { getChats } from "@/shared/api";
import { setChats } from "@/store/chatsSlice";
import { ScalableText } from "../ThemeProvider";
const ChatList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chats.chats);

  React.useEffect(() => {
    async function fetchChats() {
      const chats = await getChats();

      const chatMap = chats.reduce(
        (acc, chat) => ({ ...acc, [chat.chatId]: chat }),
        {}
      );
      dispatch(setChats(chatMap));
    }

    fetchChats();
  }, []);
  return (
    <ScrollView>
      <ScalableText
        style={{
          color: theme.colors.primary,
          fontFamily: "League-Spartan-SemiBold",
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Wszystkie wiadomości
      </ScalableText>
      {Object.values(chats)
        .sort((a, b) => {
          if (a.messages.length === 0) {
            return 1;
          }

          if (b.messages.length === 0) {
            return -1;
          }

          const lastMessageA = a.messages[a.messages.length - 1];
          const lastMessageB = b.messages[b.messages.length - 1];

          const dateA = new Date(lastMessageA.createdAt).valueOf();
          const dateB = new Date(lastMessageB.createdAt).valueOf();

          return dateB - dateA;
        })
        .map((chat) => (
          <Chat chat={chat} key={chat.chatId} />
        ))}
    </ScrollView>
  );
};
export default ChatList;
