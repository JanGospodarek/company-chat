"use client";
import { MagnifyingGlass, UserPlus, XCircle } from "@phosphor-icons/react";
import ActiveUsers from "./ActiveUsers";
import ChatsList from "./ChatsList";
import { useState } from "react";
import { type handleMobileTabChange } from "../types";
import UserActionsDropdown from "../navbar/UserActionsDropdown";
import { Avatar } from "@nextui-org/react";
type Props = {
  handleTabChange: handleMobileTabChange;
  handleShowGroupModal: () => void;
};

const MessagesTab = (props: Props) => {
  const { handleTabChange, handleShowGroupModal } = props;
  const [showSearchTab, setShowSearchTab] = useState(false);
  const handleChatSelect = () => {
    if (window.innerWidth < 768) {
      // Open chat tab and fetch chat info
      handleTabChange("conversation");
    } else {
      // fetch chat info directly
    }
  };
  return (
    <div className="my-4 px-8 max-w-[425px] w-full md:w-[300px] lg:w-[350px] flex flex-col justify-start md:border-r-2 border-secondary ">
      <div className=" flex justify-between relative">
        <p className=" text-3xl font-semibold">Messages</p>
        <div className="flex gap-3 items-center">
          <div className="md:hidden">
            <UserActionsDropdown
              triggerElement={
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  size="sm"
                />
              }
            />
          </div>

          <button onClick={handleShowGroupModal}>
            <UserPlus size={24} />
          </button>
          <button
            onClick={() => {
              setShowSearchTab((state) => !state);
            }}
          >
            {showSearchTab ? (
              <XCircle size={24} />
            ) : (
              <MagnifyingGlass size={24} />
            )}
          </button>
        </div>
        <div
          className={`absolute bg-secondary w-0 h-8 top-0 right-[28px] rounded-xl flex justify-center items-center ${
            showSearchTab && "animate-open-search"
          }`}
        >
          <input
            type="text"
            placeholder="Search user"
            className="bg-secondary w-full text-sm mx-2"
          />
        </div>
      </div>
      <div className="flex flex-col relative flex-1">
        <div
          className={`w-full  rounded-[30px] bg-secondary absolute top-0 left-0 z-20 shadow-xl ${
            showSearchTab && "animate-open-search-results"
          }`}
        ></div>
        <ActiveUsers />
        <ChatsList handleChatSelect={handleChatSelect} />
      </div>
    </div>
  );
};
export default MessagesTab;
