import Heading from "@/components/conversation/Heading";
import TypeBar from "@/components/conversation/TypeBar";

import globalStyles from "@/app/globalStyles";
import { StyleSheet, View, ScrollView } from "react-native";
import { ScalableText } from "../../../components/ThemeProvider";

import Message from "@/components/conversation/Message";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Message as IMessage, PrivateChat } from "../../../shared/types";
import {
  computeLongDate,
  minuteDifference,
} from "@/components/utils/computeDate";
import { loadMoreMessages } from "../../../shared/api";
import { loadOlderMessages, selectChat } from "@/store/chatsSlice";
import { IOScrollView } from "react-native-intersection-observer";
import { useAppTheme } from "@/components/ThemeProvider";
type MessageGroup = {
  messages: IMessage[];
};

type DateGroup = {
  date: string;
  messages: MessageGroup[];
};
const Conversation = () => {
  const theme = useAppTheme();
  const { user } = useAuth();
  const scrollRef = React.useRef<ScrollView | null>(null);
  const [messageGroups, setMessageGroups] = React.useState<DateGroup[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [latestMessageInView, setLatestMessageInView] = React.useState(true);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();

  const activeUsers = useAppSelector((state) => state.activeUsers);

  // const { handleTabChange } = props;
  const conversation = useAppSelector(
    (state) => state.chats.chats[state.chats.activeChatID]
  );

  const [isUserActive, setIsUserActive] = React.useState(false);

  // const [scope, animate] = useAnimate();

  // React.useEffect(() => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }

  //   if (latestMessageInView) {
  //     setScroll(true);
  //   } else {
  //     timeoutRef.current = setTimeout(() => {
  //       setScroll(false);
  //     }, 100);
  //   }
  // }, [latestMessageInView]);

  React.useEffect(() => {
    if (!conversation) return;
    if (conversation.type === "PRIVATE") {
      const privateChat = conversation as PrivateChat;

      const receipient = privateChat.receipient;

      const user = activeUsers.users.find((u) => u.id === receipient.id);

      setIsUserActive(!!user);
    }
  }, [activeUsers, conversation]);

  const [runOnce, setRunOnce] = React.useState(true);
  React.useEffect(() => {
    if (scrollRef.current && runOnce) {
      console.log("scrolling to end");

      scrollRef.current.scrollToEnd({ animated: false });
      setRunOnce(false);
    }
    setTimeout(() => {
      setRunOnce(true);
    }, 1);
  }, [conversation?.messages.length]);

  React.useEffect(() => {
    if (!conversation) return;
    // @ts-ignore
    // animate(scrollRef.current, { opacity: 0 }, { duration: 0 });
    setMessageGroups([]);

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: false });
      }
    }, 100);

    setTimeout(() => {
      // setAnimateScroll(true);
      setLoading(false);
      // @ts-ignore
      // animate(scrollRef.current, { opacity: 1 }, { duration: 0.2 });
    }, 250);
  }, [conversation?.chatId]);

  React.useEffect(() => {
    if (!conversation) return;

    if (conversation.messages.length === 0) return;
    setMessageGroups([]);

    const groups: { date: string; messages: IMessage[] }[] = [];

    groups.push({
      date: conversation.messages[0].createdAt as string,
      messages: [conversation.messages[0]],
    });

    for (let i = 1; i < conversation.messages.length; i++) {
      const message = conversation.messages[i];
      const lastGroup = groups[groups.length - 1];

      const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];

      const messageDate = new Date(message.createdAt);
      const lastMessageDate = new Date(lastMessage.createdAt);

      const diff = minuteDifference(messageDate, lastMessageDate);

      if (diff < 5) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          date: message.createdAt as string,
          messages: [message],
        });
      }
    }

    const dateGroups: DateGroup[] = [];

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      const mGroups: MessageGroup[] = [];

      mGroups.push({
        messages: [group.messages[0]],
      });

      for (let j = 1; j < group.messages.length; j++) {
        const message = group.messages[j];

        const sender = message.user.id;

        const lastGroup = mGroups[mGroups.length - 1];
        const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
        const lastSender = lastMessage.user.id;

        if (sender === lastSender) {
          if (
            lastGroup.messages.findIndex(
              (el) => el.messageId === message.messageId
            ) === -1
          )
            lastGroup.messages.push(message);
        } else {
          mGroups.push({
            messages: [message],
          });
        }
      }

      dateGroups.push({
        date: group.date,
        messages: mGroups,
      });
    }

    setMessageGroups(dateGroups);
  }, [conversation?.messages]);

  const loadMore = (messageId: number) => {
    if (!conversation) return;
    if (loading) return;

    setLoading(true);
    loadMoreMessages(conversation.chatId, messageId).then((messages) => {
      if (messages.length === 0) return;

      const newMessages = messages.reverse();

      dispatch(loadOlderMessages(newMessages));

      // setTimeout(() => {
      //   const ref = document.getElementById(messageId.toString());

      //   if (ref) {
      //     const top = ref.offsetTop + ref.clientHeight;
      //     scrollRef.current?.scrollTo(0, top);
      //   }
      // }, 1);

      setTimeout(() => {
        setLoading(false);
      }, 50);
    });
  };

  // const handleScrollButton = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // };

  const handleBackButton = () => {
    dispatch(selectChat(-1));
  };
  const chatName =
    conversation?.type === "PRIVATE"
      ? `${(conversation as unknown as PrivateChat)?.receipient.name} ${
          (conversation as unknown as PrivateChat)?.receipient.surname
        }`
      : conversation?.name;

  const username =
    conversation?.type === "PRIVATE"
      ? (conversation as PrivateChat)?.receipient.username
      : "";
  return (
    <View
      style={{
        ...globalStyles.container,
        padding: 10,
        alignItems: "center",
        width: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <Heading
        handleGoBack={handleBackButton}
        title={chatName}
        isActive={isUserActive}
        subtitle={conversation?.type === "PRIVATE" ? username : ""}
      />
      <View
        style={{
          ...styles.messagesContainer,

          width: "100%",
        }}
      >
        <IOScrollView ref={scrollRef}>
          {messageGroups.map((group, index) => (
            <View
              key={group.date}
              style={{
                display: "flex",
                width: "100%",
                gap: 10,
              }}
            >
              <ScalableText
                style={{
                  fontFamily: "League-Spartan-Bold",
                  textAlign: "center",
                  color: theme.colors.primary,
                  paddingVertical: 3,
                  fontSize: 15,
                }}
              >
                {computeLongDate(new Date(group.date))}
              </ScalableText>
              {group.messages.map((mGroup, i) => (
                <View
                  key={i}
                  style={{
                    display: "flex",
                    gap: 1,
                    width: "100%",

                    alignItems:
                      mGroup.messages[0].user.id === user?.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  {mGroup.messages.map((m, j) => (
                    <Message
                      message={m}
                      key={m.messageId}
                      loadMore={
                        j === 0 && i === 0 && index === 0 ? loadMore : undefined
                      }
                      setInView={
                        j === mGroup.messages.length - 1 &&
                        i === group.messages.length - 1 &&
                        index === messageGroups.length - 1
                          ? setLatestMessageInView
                          : undefined
                      }
                    />
                  ))}
                  {mGroup.messages[0].user.id !== user?.id && (
                    <ScalableText
                      style={{
                        fontFamily: "League-Spartan-SemiBold",
                        color: theme.colors.secondaryFont,
                        fontSize: 13,
                      }}
                    >
                      {mGroup.messages[0].user.username}
                    </ScalableText>
                  )}
                </View>
              ))}
            </View>
          ))}
        </IOScrollView>
      </View>

      <TypeBar chatId={conversation.chatId} />
    </View>
  );
};
const styles = StyleSheet.create({
  messagesContainer: {
    padding: 20,
    gap: 10,
    flex: 1,
  },
});
export default Conversation;
