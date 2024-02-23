import { useAuth } from "@/contexts/AuthContext";
import { getChat, miau } from "@/shared/api";
import { setActiveUsers } from "@/store/activeUsersSlice";
import { addChat, addMessageToChat, updateMessage } from "@/store/chatsSlice";
import { store } from "@/store/store";
import { Slot, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Audio } from "expo-av";
import { LogBox } from "react-native";

const SocketWrapper = (props: any) => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const soundObject = new Audio.Sound();
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    loadSound();
    return () => {
      unloadSound();
    };
  }, []);
  LogBox.ignoreLogs([
    "new NativeEventEmitter",
    "Maximum update depth exceeded",
  ]);
  const loadSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true, // pozwól na odtwarzanie dźwięku w tle
      });
      await soundObject.loadAsync(require("../assets/notification_sound.mp3"));
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const unloadSound = async () => {
    try {
      await soundObject.unloadAsync();
      setIsLoaded(false);
    } catch (error) {
      console.error("Error unloading sound:", error);
    }
  };

  const playSound = async () => {
    if (isLoaded) {
      try {
        await soundObject.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };
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

      if (message.chatId !== activeChatID) {
        try {
          playSound();
        } catch (error) {}
      }
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