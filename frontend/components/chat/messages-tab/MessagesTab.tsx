"use client";
import {
  MagnifyingGlass,
  UserPlus,
  XCircle,
  FolderPlus,
} from "@phosphor-icons/react";
import ActiveUsers from "./ActiveUsers";
import ChatsList from "./ChatsList";
import { useEffect, useState } from "react";
import { type handleMobileTabChange } from "../types";
import UserActionsDropdown from "../navbar/UserActionsDropdown";
import { Avatar, Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import computeFont from "@/components/utils/getComputedFontSize";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { User } from "@shared/types";
import { newPrivateChatList, newPrivateChat, getChat } from "@shared/api";

import { useDispatch } from "react-redux";
import { addChat } from "@/lib/chatsSlice";
import { useAppDispatch } from "@/lib/hooks";

type Props = {
  handleTabChange: handleMobileTabChange;
  handleShowGroupModal: () => void;
};

const MessagesTab = (props: Props) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const [newUsers, setNewUsers] = useState([] as User[]);

  const dispatch = useAppDispatch();

  const fontSizeState = useSelector((state: RootState) => state.font);

  const { handleTabChange } = props;
  // const [showSearchTab, setShowSearchTab] = useState(false);
  const handleChatSelect = () => {
    if (window.innerWidth < 768) {
      // Open chat tab and fetch chat info
      handleTabChange("conversation");
    } else {
      // fetch chat info directly
    }
  };

  useEffect(() => {
    if (showNewChat) {
      newPrivateChatList().then((users) => {
        setNewUsers(users);
      });
    }
  }, [showNewChat]);

  const handleNewChat = async (user: User) => {
    const chatID = await newPrivateChat(user.username);
    const chat = await getChat(chatID);

    dispatch(addChat(chat));
    setShowNewChat(false);
  };

  return (
    <div className="my-4 px-8 max-w-[425px] w-full md:w-[300px] lg:w-[300px] flex flex-col justify-start md:border-r-2 border-secondary ">
      <div className=" flex justify-between relative">
        <p
          className={`${computeFont("text-3xl", fontSizeState)} font-semibold`}
        >
          Messages
        </p>
        <div className="flex gap-3 items-center">
          <div className="md:hidden">
            <UserActionsDropdown
              triggerElement={
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  size="sm"
                  className="z-10"
                />
              }
            />
          </div>

          <button onClick={() => setShowNewChat(true)}>
            <UserPlus size={24} />
          </button>
          <button onClick={() => setShowGroupModal(true)}>
            <FolderPlus size={24} />
          </button>
          {/* <button
            onClick={() => {
              setShowSearchTab((state) => !state);
            }}
          >
            {showSearchTab ? (
              <XCircle size={24} />
            ) : (
              <MagnifyingGlass size={24} />
            )}
          </button> */}
        </div>
      </div>
      <div className="flex flex-col relative flex-1">
        <ActiveUsers />
        <ChatsList handleChatSelect={handleChatSelect} />
      </div>

      <Modal isOpen={showNewChat} onClose={() => setShowNewChat(false)}>
        <ModalContent>
          <ModalHeader className="text-black">New Chat</ModalHeader>
          <ModalBody>
            {newUsers.map((user) => (
              <Button onClick={() => handleNewChat(user)} key={user.id}>
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  size="sm"
                />
                {user.username}
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)}>
        <ModalContent>
          <ModalHeader className="text-black">Create Group</ModalHeader>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default MessagesTab;
