"use client";

import LeftNavbar from "@/components/chat/LeftNavbar";
import Conversation from "@/components/chat/conversation/Conversation";
import MessagesTab from "@/components/chat/messages-tab/MessagesTab";
import { MobileTabs } from "@/components/chat/types";
import { useState } from "react";

const ChatPage = () => {
  const [currentTabMobile, setCurrentTabMobile] =
    useState<MobileTabs>("messages");
  const handleTabChange = (tab: MobileTabs) => setCurrentTabMobile(tab);

  return (
    <div className="font-league bg-secondary text-foreground w-[100vw] h-[100vh] flex justify-center items-center">
      {/* Desktop view */}
      <div className="rounded-[50px]  bg-white w-[80%] h-[80%] hidden md:flex ">
        <LeftNavbar />
        <MessagesTab handleTabChange={handleTabChange} />
        <Conversation handleTabChange={handleTabChange} />
      </div>
      {/* Mobile view */}
      <div className=" h-[100vh] w-[100vw]  flex justify-center  bg-white md:hidden  ">
        {currentTabMobile === "messages" ? (
          <MessagesTab handleTabChange={handleTabChange} />
        ) : (
          <Conversation handleTabChange={handleTabChange} />
        )}
      </div>
    </div>
  );
};
export default ChatPage;
