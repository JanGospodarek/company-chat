import { Avatar, Badge } from "@nextui-org/react";

import { GroupChat, PrivateChat } from "../../../../shared/types";

import { useAppDispatch } from "@/lib/hooks";
import { miau } from "@shared/api";
import { selectChat } from "@/lib/chatsSlice";
import { useEffect, useState } from "react";

import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import { computeDate } from "@/components/utils/computeDate";
import { useAuth } from "@/contexts/AuthContext";
import Text from "@/components/reuseable/Text";

type Props = {
  chat: GroupChat | PrivateChat;
  handleTabChange: () => void;
};

const Chat = (props: Props) => {
  const { chat, handleTabChange } = props;
  const { user } = useAuth();

  const [isChatActive, setIsChatActive] = useState(false);
  const [date, setDate] = useState("");

  const activeUsers = useAppSelector((state: RootState) => state.activeUsers);

  const dispatch = useAppDispatch();

  const chatName =
    chat.type === "PRIVATE"
      ? `${(chat as PrivateChat).receipient.name} ${
          (chat as PrivateChat).receipient.surname
        }`
      : chat.name;

  const getInitials = (name: string) => {
    const n = name.trim();

    if (n.split(" ").length === 1) {
      return n.slice(0, 2).toUpperCase();
    }

    const initials = n.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  const handleChatSelect = () => {
    const id = chat.chatId;

    miau.enterChat(id);

    dispatch(selectChat(id));
    handleTabChange();
  };

  useEffect(() => {
    if (chat.type === "PRIVATE") {
      const privateChat = chat as PrivateChat;

      const receipient = privateChat.receipient;

      const user = activeUsers.users.find((u) => u.id === receipient.id);

      setIsChatActive(!!user);
    } else {
      const groupChat = chat as GroupChat;

      const users = groupChat.users;

      const activeUsersIDs = activeUsers.users.map((u) => u.id);

      const isActive = users.some((u) => activeUsersIDs.includes(u.id));

      setIsChatActive(isActive);
    }
  }, [activeUsers, chat]);

  useEffect(() => {
    if (chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];

      const date = new Date(lastMessage.createdAt);

      setDate(computeDate(date));
    }
  }, [chat]);

  return (
    <button
      className="flex mt-2 border-b-2 border-optionalBorderColor"
      onClick={handleChatSelect}
    >
      <div>
        <Badge
          content=""
          color="success"
          shape="circle"
          className="mt-1"
          isInvisible={!isChatActive}
        >
          <Avatar
            radius="full"
            size="lg"
            name={chatName}
            getInitials={getInitials}
            showFallback
          />
        </Badge>
      </div>
      <div className="flex flex-col ml-2 justify-center w-px[234]">
        <div className="flex justify-between w-[170px]">
          <Text className="text-md font-semibold text-text text-left  text-nowrap relative after:absolute after:h-full after:w-[140px] after:top-0 after:left-0 after:bg-gradient-to-l after:from-background after:to-transparent after:from-0% after:to-20% w-[140px] overflow-hidden">
            {chatName}
          </Text>
          {chat.messages.length > 0 && (
            <Text className="font-light text-xs flex items-center text-primary">
              {date}
            </Text>
          )}
        </div>
        {chat.messages.length > 0 && (
          <Text
            className={`text-left text-xs  text-nowrap relative after:absolute after:h-full after:w-[170px] after:top-0 after:left-0 after:bg-gradient-to-l after:from-background after:to-transparent after:from-0% after:to-20% text-textSecondary ${
              chat.messages[chat.messages.length - 1].readBy.some(
                (u) => u.id === user?.id
              )
                ? "font-light"
                : "font-bold"
            }`}
          >
            <span className="mr-1">
              {chat.messages[chat.messages.length - 1].user.id === user?.id ? (
                <>Ja:</>
              ) : (
                <>{chat.messages[chat.messages.length - 1].user.username}:</>
              )}
            </span>

            {chat.messages[chat.messages.length - 1].content ? (
              <>{chat.messages[chat.messages.length - 1].content}</>
            ) : (
              <>📎</>
            )}
          </Text>
        )}
      </div>
    </button>
  );
};
export default Chat;
