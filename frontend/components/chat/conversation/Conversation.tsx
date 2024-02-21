import { Avatar, Badge, ScrollShadow } from "@nextui-org/react";
import Message from "./Message";
import TypeBar from "./TypeBar";
import { type handleMobileTabChange } from "../types";
import { ArrowCircleLeft } from "@phosphor-icons/react";
type Props = {
  handleTabChange: handleMobileTabChange;
};

import { RefObject, use, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Message as IMessage, PrivateChat } from "@shared/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  computeDate,
  computeLongDate,
  minuteDifference,
} from "@/components/utils/computeDate";
import { loadMoreMessages } from "@shared/api";

import { loadOlderMessages, selectChat } from "@/lib/chatsSlice";
import { useAnimate } from "framer-motion";

type MessageGroup = {
  messages: IMessage[];
};

type DateGroup = {
  date: string;
  messages: MessageGroup[];
};

const Conversation = (props: Props) => {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [animateScroll, setAnimateScroll] = useState(false);
  const [messageGroups, setMessageGroups] = useState<DateGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [latestMessageInView, setLatestMessageInView] = useState(true);

  const [scroll, setScroll] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();

  const activeUsers = useAppSelector((state: RootState) => state.activeUsers);

  const { handleTabChange } = props;
  const conversation = useSelector(
    (state: RootState) => state.chats.chats[state.chats.activeChatID]
  );

  const [isUserActive, setIsUserActive] = useState(false);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (latestMessageInView) {
      setScroll(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setScroll(false);
      }, 100);
    }
  }, [latestMessageInView]);

  useEffect(() => {
    if (!conversation) return;
    if (conversation.type === "PRIVATE") {
      const privateChat = conversation as PrivateChat;

      const receipient = privateChat.receipient;

      const user = activeUsers.users.find((u) => u.id === receipient.id);

      setIsUserActive(!!user);
    }
  }, [activeUsers, conversation]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current && scroll) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 1);
  }, [conversation?.messages.length]);

  useEffect(() => {
    if (!conversation) return;
    // @ts-ignore
    animate(scrollRef.current, { opacity: 0 }, { duration: 0 });
    setMessageGroups([]);
    setAnimateScroll(false);

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);

    setTimeout(() => {
      setAnimateScroll(true);
      setLoading(false);
      // @ts-ignore
      animate(scrollRef.current, { opacity: 1 }, { duration: 0.2 });
    }, 250);
  }, [conversation?.chatId]);

  useEffect(() => {
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

      setAnimateScroll(false);

      setTimeout(() => {
        const ref = document.getElementById(messageId.toString());

        if (ref) {
          const top = ref.offsetTop + ref.clientHeight;
          scrollRef.current?.scrollTo(0, top);
        }
      }, 1);

      setTimeout(() => {
        setAnimateScroll(true);
        setLoading(false);
      }, 50);
    });
  };

  const handleScrollButton = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleBackButton = () => {
    dispatch(selectChat(-1));
  };

  return (
    <div className="flex flex-col m-4 w-full gap-2">
      {conversation?.chatId && (
        <>
          <div className="flex items-center gap-4 transition-all">
            <button onClick={handleBackButton}>
              <ArrowCircleLeft size={48} className="md:hidden fill-primary" />
            </button>
            <Badge
              content=""
              color="success"
              shape="circle"
              className="mt-1"
              isInvisible={!isUserActive}
            >
              <Avatar
                radius="full"
                size="lg"
                src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              />
            </Badge>

            <div className="flex flex-col ml-2 justify-center w-full">
              <div className="text-xl font-semibold">
                {conversation.type === "GROUP"
                  ? conversation.name
                  : (conversation as PrivateChat).receipient.username}
              </div>
              <button
                className="font-light text-sm text-primary underline text-left"
                onClick={() => {
                  navigator.clipboard.writeText("mateusz@kowalski.co.pl");
                }}
              >
                mateusz@kowalski.co.pl
              </button>
            </div>
          </div>
          <ScrollShadow
            offset={2}
            hideScrollBar
            ref={scrollRef}
            className={`flex-grow flex flex-col mb-2 ${
              animateScroll ? "scroll-smooth" : ""
            }`}
          >
            <div className="h-full"></div>
            {messageGroups.map((group, index) => (
              <div key={group.date} className="flex flex-col gap-2">
                <div className="text-center text-xs text-primary font-semibold">
                  {computeLongDate(new Date(group.date))}
                </div>
                {group.messages.map((mGroup, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-px ${
                      mGroup.messages[0].user.id === user?.id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    {mGroup.messages.map((m, j) => (
                      <Message
                        message={m}
                        key={m.messageId}
                        isFirst={j === 0}
                        isLast={j === mGroup.messages.length - 1}
                        loadMore={
                          j === 0 && i === 0 && index === 0
                            ? loadMore
                            : undefined
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
                      <p className="font-light">
                        {mGroup.messages[0].user.username}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </ScrollShadow>
          <TypeBar
            chatId={conversation.chatId}
            buttonVisible={!scroll}
            handleButtonClick={handleScrollButton}
          />
        </>
      )}
    </div>
  );
};
export default Conversation;
