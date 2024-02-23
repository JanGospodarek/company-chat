import Chat from "./Chat";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import computeFont from "@/components/utils/getComputedFontSize";
type Props = {
  handleChatSelect: () => void;
};

import { getChats } from "@shared/api";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { setChats } from "@/lib/chatsSlice";

const ChatsList = (props: Props) => {
  const dispatch = useDispatch();
  const { handleChatSelect } = props;
  const chats = useSelector((state: RootState) => state.chats.chats);
  const fontSizeState = useSelector((state: RootState) => state.font);

  useEffect(() => {
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
    <div className="w-full flex flex-col mt-2 overflow-y-scroll h-full hide-scrollbar ">
      <h2
        className={`${computeFont(
          "text-lg",
          fontSizeState
        )} font-semibold text-primary`}
      >
        All Messages
      </h2>
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
          <Chat
            chat={chat}
            key={chat.chatId}
            handleTabChange={handleChatSelect}
          />
        ))}
    </div>
  );
};
export default ChatsList;
