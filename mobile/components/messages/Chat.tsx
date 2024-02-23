import { Link, useRouter } from "expo-router";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import { ScalableText } from "../ThemeProvider";

import { Avatar, Badge, useTheme } from "react-native-paper";
import { GroupChat, PrivateChat } from "../../../shared/types";
import React, { useState } from "react";
import { selectChat } from "@/store/chatsSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { miau } from "@/shared/api";
import { computeDate } from "../utils/computeDate";
import { RootState } from "@/store/store";
import { useAppTheme } from "../ThemeProvider";
type Props = {
  chat: GroupChat | PrivateChat;
};
const Chat = (props: Props) => {
  const router = useRouter();
  const { chat } = props;
  const { user } = useAuth();
  const theme = useAppTheme();
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
    <TouchableOpacity
      style={{
        ...styles.container,
        borderColor: theme.colors.optionalBorderColor,
      }}
      onPress={handleChatSelect}
    >
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
          <View style={{ width: 200 }}>
            <ScalableText
              style={{
                fontSize: 18,
                fontFamily: "League-Spartan-Bold",
                color: theme.colors.primaryFont,
              }}
            >
              {chat.type === "PRIVATE"
                ? (chat as PrivateChat).receipient.username
                : chat.name}
            </ScalableText>
          </View>

          {chat.messages.length > 0 && (
            <ScalableText
              style={{
                fontFamily: "League-Spartan",
                color: theme.colors.secondaryFont,
                fontSize: 14,
              }}
            >
              {date}
            </ScalableText>
          )}
        </View>
        {chat.messages.length > 0 && (
          <ScalableText
            style={{
              fontFamily: chat.messages[chat.messages.length - 1].readBy.some(
                (u) => u.id === user?.id
              )
                ? "League-Spartan"
                : "League-Spartan-Bold",
              textAlign: "left",
              flex: 1,
            }}
            // numberOfLines={1}
          >
            {chat.messages[chat.messages.length - 1].user.id === user?.id ? (
              <ScalableText
                style={{ color: theme.colors.secondaryFont, fontSize: 14 }}
              >
                Ja:
              </ScalableText>
            ) : (
              <ScalableText
                style={{ color: theme.colors.secondaryFont, fontSize: 14 }}
              >
                {chat.messages[chat.messages.length - 1].user.username}:
              </ScalableText>
            )}
            {chat.messages[chat.messages.length - 1].content ? (
              <ScalableText
                style={{
                  flex: 1,
                  color: theme.colors.secondaryFont,
                  fontSize: 14,
                }}
                // numberOfLines={1}
              >
                {chat.messages[chat.messages.length - 1].content}
              </ScalableText>
            ) : (
              <Text>📎</Text>
            )}
          </ScalableText>
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
    padding: 6,
    marginVertical: 3,
    justifyContent: "flex-start",
    borderWidth: 2,
    borderRadius: 10,
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
