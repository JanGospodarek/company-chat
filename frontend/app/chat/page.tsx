"use client";

import LeftNavbar from "@/components/chat/navbar/LeftNavbar";
import Conversation from "@/components/chat/conversation/Conversation";
import GroupModal from "@/components/chat/messages-tab/GroupModal/GroupModal";
import MessagesTab from "@/components/chat/messages-tab/MessagesTab";
import { MobileTabs } from "@/components/chat/types";
import { useState } from "react";

const ChatPage = () => {
  const [currentTabMobile, setCurrentTabMobile] =
    useState<MobileTabs>("messages");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const handleTabChange = (tab: MobileTabs) => setCurrentTabMobile(tab);
  const handleShowModal = () => setShowCreateGroupModal((state) => !state);

  return (
    <div className="font-league bg-secondary text-foreground w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="md:rounded-[50px] h-[100vh] w-[100vw] bg-white md:w-[80%] md:h-[80%] relative">
        <div className=" hidden md:flex h-full ">
          <LeftNavbar />
          <MessagesTab
            handleTabChange={handleTabChange}
            handleShowGroupModal={handleShowModal}
          />
          <Conversation handleTabChange={handleTabChange} />
        </div>
        {/* Mobile view */}
        <div className=" md:hidden h-full flex justify-center ">
          {currentTabMobile === "messages" ? (
            <MessagesTab
              handleTabChange={handleTabChange}
              handleShowGroupModal={handleShowModal}
            />
          ) : (
            <Conversation handleTabChange={handleTabChange} />
          )}
        </div>
        {/* Group creation modal */}
        {showCreateGroupModal && (
          <GroupModal handleShowModal={handleShowModal} />
        )}
      </div>
      {/* Desktop view */}
    </div>
  );
};
export default ChatPage;
