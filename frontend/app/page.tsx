"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { LeftNavbar, Conversation, MessagesTab } from "@/components/chat";
import { MobileTabs } from "@/components/chat/types";
import { miau } from "@shared/api";

import { useDispatch } from "react-redux";
import { setActiveUsers } from "@/lib/activeUsersSlice";
import { addMessageToChat } from "@/lib/chatsSlice";

import { RootState, store } from "@/lib/store";
import { useSelector } from "react-redux";

// @ts-ignore
import NotificationSound from "@/components/chat/notification_sound.mp3";

export default function Home() {
  const [currentTabMobile, setCurrentTabMobile] =
    useState<MobileTabs>("messages");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const audioPlayer = useRef<HTMLAudioElement>(null);

  const { user } = useAuth();
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const u = user;

    if (!u) {
      router.replace("/login");
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
      const activeChatID = store.getState().chats.activeChatID;
      
      if (message.chatId !== activeChatID) {
        audioPlayer.current?.play();
      }

      dispatch(addMessageToChat(message));
    });

    return () => {
      miau.get().disconnect();
    };
  }, []);

  const handleTabChange = (tab: MobileTabs) => setCurrentTabMobile(tab);
  const handleShowModal = () => setShowCreateGroupModal((state) => !state);

  return (
    <>
      {user && (
        <div className="font-league bg-secondary text-foreground w-[100vw] h-[100vh] flex justify-center items-center">
          <div className="md:rounded-[50px] h-[100vh] w-[100vw] bg-white md:w-[80%] md:h-[80%] relative flex">
            <div className="hidden md:flex h-full w-full">
              <LeftNavbar />
              <MessagesTab
                handleTabChange={handleTabChange}
                handleShowGroupModal={handleShowModal}
              />
              <Conversation handleTabChange={handleTabChange} />
            </div>
            {/* Mobile view */}
            {/* <div className=" md:hidden h-full flex justify-center ">
              {currentTabMobile === "messages" ? (
                <MessagesTab
                  handleTabChange={handleTabChange}
                  handleShowGroupModal={handleShowModal}
                />
              ) : (
                <Conversation handleTabChange={handleTabChange} />
              )}
            </div> */}
            {/* Group creation modal */}
            {/* {showCreateGroupModal && (
              <GroupModal handleShowModal={handleShowModal} />
            )} */}
          </div>
          <audio id="notification" ref={audioPlayer} src={NotificationSound} />
        </div>
      )}
      ;
    </>
  );
}
