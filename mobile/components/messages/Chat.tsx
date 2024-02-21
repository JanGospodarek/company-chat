import { Link, useRouter } from "expo-router";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Avatar, Badge, useTheme } from "react-native-paper";
import { GroupChat, PrivateChat } from "../../../shared/types";
import React, { useState } from "react";
import { selectChat } from "@/store/chatsSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { miau } from "@/shared/api";
import { computeDate } from "../utils/computeDate";
import { RootState } from "@/store/store";
type Props = {
  chat: GroupChat | PrivateChat;
};
const Chat = (props: Props) => {
  const router = useRouter();
  const { chat } = props;
  const { user } = useAuth();

  const [isChatActive, setIsChatActive] = useState(false);
  const [date, setDate] = useState("");

  const activeUsers = useAppSelector((state: RootState) => state.activeUsers);

  const dispatch = useAppDispatch();

  const handleChatSelect = () => {
    const id = chat.chatId;

    miau.enterChat(id);

    dispatch(selectChat(id));
    router.push("/chat/conversation/");
  };

  React.useEffect(() => {
    if (chat.type === "PRIVATE") {
      const privateChat = chat as PrivateChat;

      const receipient = privateChat.receipient;

      const user = activeUsers.users.find((u: any) => u.id === receipient.id);

      setIsChatActive(!!user);
    } else {
      const groupChat = chat as GroupChat;

      const users = groupChat.users;

      const activeUsersIDs = activeUsers.users.map((u: any) => u.id);

      const isActive = users.some((u) => activeUsersIDs.includes(u.id));

      setIsChatActive(isActive);
    }
  }, [activeUsers, chat]);

  React.useEffect(() => {
    if (chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];

      const date = new Date(lastMessage.createdAt);

      setDate(computeDate(date));
    }
  }, [chat]);
  return (
    <TouchableOpacity style={styles.container} onPress={handleChatSelect}>
      <View>
        <Avatar.Image
          size={56}
          source={require("../../assets/images/avatar.jpeg")}
        />
        {isChatActive && <Badge style={styles.badge} size={15}></Badge>}
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <View style={styles.heading}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "League-Spartan-Bold",
            }}
          >
            {chat.type === "PRIVATE"
              ? (chat as PrivateChat).receipient.username
              : chat.name}
          </Text>
          {chat.messages.length > 0 && (
            <Text
              style={{
                color: "#737373",
                fontFamily: "League-Spartan",
              }}
            >
              {date}
            </Text>
          )}
        </View>
        {chat.messages.length > 0 && (
          <Text
            style={{
              fontWeight: "400",
              color: "#737373",
              fontFamily: chat.messages[chat.messages.length - 1].readBy.some(
                (u) => u.id === user?.id
              )
                ? "League-Spartan"
                : "League-Spartan-Bold",
              textAlign: "left",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {chat.messages[chat.messages.length - 1].user.id === user?.id ? (
              <Text>Ja:</Text>
            ) : (
              <Text>
                {chat.messages[chat.messages.length - 1].user.username}:
              </Text>
            )}
            {chat.messages[chat.messages.length - 1].content ? (
              <Text style={{ flex: 1 }} numberOfLines={1}>
                {chat.messages[chat.messages.length - 1].content}
              </Text>
            ) : (
              <Text>📎</Text>
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginVertical: 6,
    justifyContent: "flex-start",
  },

  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

    flex: 1,
  },
  badge: {
    backgroundColor: "#17C964",
    position: "absolute",
    top: 0,
    right: -4,
  },
});
export default Chat;
