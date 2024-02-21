import { useAuth } from "@/contexts/AuthContext";
import { getChat, miau } from "@/shared/api";
import { setActiveUsers } from "@/store/activeUsersSlice";
import { addChat, addMessageToChat, updateMessage } from "@/store/chatsSlice";
import { store } from "@/store/store";
import { Slot, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";

const SocketWrapper = (props: any) => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const u = user;

    if (!u) {
      router.replace("/auth/login");
      return;
    }

    miau.connect();

    miau.onActivity((data) => {
      dispatch(setActiveUsers(data));
    });

    miau.connect_error((error) => {
      console.error(error);
    });

    miau.onMessage((message) => {
      dispatch(addMessageToChat(message));

      const activeChatID = store.getState().chats.activeChatID;

      // if (message.chatId !== activeChatID) {
      //   try {
      //     audioPlayer.current?.play();
      //   } catch (error) {}
      // }
    });

    miau.onReadMessage((message) => {
      dispatch(updateMessage(message));
    });

    miau.onNewChat(async (chatId) => {
      const chat = await getChat(chatId);

      dispatch(addChat(chat));
    });

    return () => {
      miau.get().disconnect();
    };
  }, []);
  return <View>{props.children}</View>;
};
export default SocketWrapper;
