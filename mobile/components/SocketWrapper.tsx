import { useAuth } from "@/contexts/AuthContext";
import { getChat, miau } from "@/shared/api";
import { setActiveUsers } from "@/store/activeUsersSlice";
import { addChat, addMessageToChat, updateMessage } from "@/store/chatsSlice";
import { store } from "@/store/store";
import { Slot, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Audio } from "expo-av";
import { LogBox, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SocketWrapper = (props: any) => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const soundObject = new Audio.Sound();
  const [isLoaded, setIsLoaded] = React.useState(false);
  // React.useEffect(() => {
  //   loadSound();
  //   return () => {
  //     unloadSound();
  //   };
  // }, []);
  LogBox.ignoreLogs([
    "new NativeEventEmitter",
    "Maximum update depth exceeded",
  ]);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token as string)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
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
      console.log("Received message:", message);
      dispatch(addMessageToChat(message));

      const activeChatID = store.getState().chats.activeChatID;

      if (message.chatId !== activeChatID) {
        try {
          console.log("Playing sound");
          const playSound = async () =>
            await schedulePushNotification(expoPushToken);

          playSound();
        } catch (error) {
          console.log("Error playing sound:", error);
        }
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

async function schedulePushNotification() {
  console.log("Scheduling notification");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = await Notifications.getExpoPushTokenAsync({
        projectId: "1148529b-4e1b-4efb-917a-6f9a3b10bc2f",
      });
    } catch (error) {
      alert("Failed to get push token for push notification! + " + error);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
