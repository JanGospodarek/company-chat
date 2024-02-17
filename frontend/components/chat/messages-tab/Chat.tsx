import { Avatar, Badge, user } from "@nextui-org/react";

import { GroupChat, PrivateChat } from "../../../../shared/types";

import { useAppDispatch } from "@/lib/hooks";
import { miau } from "@shared/api";
import { selectChat } from "@/lib/chatsSlice";
import { useEffect, useState } from "react";

import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import { computeDate } from "@/components/utils/computeDate";

type Props = {
  chat: GroupChat | PrivateChat;
};

const Chat = (props: Props) => {
  const { chat } = props;

  const [isChatActive, setIsChatActive] = useState(false);
  const [date, setDate] = useState("");

  const activeUsers = useAppSelector((state: RootState) => state.activeUsers);

  const dispatch = useAppDispatch();

  const handleChatSelect = () => {
    const id = chat.chatId;

    miau.enterChat(id);

    dispatch(selectChat(id));
  };

  useEffect(() => {
    if (chat.type === "PRIVATE") {
      const privateChat = chat as PrivateChat;

      const receipient = privateChat.receipient;

      const user = activeUsers.users.find((u) => u.id === receipient.id);

      setIsChatActive(!!user);
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
    <button className="flex mt-2" onClick={handleChatSelect}>
      <div>
        {isChatActive && (
          <Badge content="" color="success" shape="circle" className="mt-1">
            <Avatar
              radius="full"
              size="lg"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
            />
          </Badge>
        )}
        {!isChatActive && (
          <Avatar
            radius="full"
            size="lg"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        )}
      </div>
      <div className="flex flex-col ml-2 justify-center">
        <div className="flex justify-between">
          <div className="text-md font-semibold">
            {chat.type === "PRIVATE"
              ? (chat as PrivateChat).receipient.username
              : chat.name}
          </div>
          {chat.messages.length > 0 && (
            <div className="font-light text-xs flex items-center">{date}</div>
          )}
        </div>
        {chat.messages.length > 0 && (
          <p className="font-light text-xs text-left text-nowrap">
            {chat.messages[chat.messages.length - 1].content}
          </p>
        )}
      </div>
    </button>
  );
};
export default Chat;
