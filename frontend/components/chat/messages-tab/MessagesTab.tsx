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

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";

import { Listbox, ListboxItem } from "@nextui-org/listbox";

import { User } from "@shared/types";
import { newPrivateChatList, newPrivateChat, getChat } from "@shared/api";

import { useDispatch } from "react-redux";
import { addChat } from "@/lib/chatsSlice";
import { useAppDispatch } from "@/lib/hooks";
import GroupModal from "./GroupModal/GroupModal";

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
    await newPrivateChat(user.username);

    setShowNewChat(false);
  };

  return (
    <div className="my-4 px-8 max-w-[425px] w-full md:w-[300px] lg:w-[300px] flex flex-col justify-start md:border-r-2 border-secondary  flex-shrink-0">
      <div className=" flex justify-between relativ">
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

      <Modal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        backdrop="blur"
        size="xs"
        className=""
        classNames={{
          body: "margin-0",
          wrapper: "margin-0",
          base: "w-full md:w-[300px] max-w-full m-0 rounded-b-none md:rounded-b-large max-h-[80vh]",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-black justify-center">
            Nowy chat
          </ModalHeader>
          <ModalBody className="overflow-scroll scrollbar-hide">
            <Listbox>
              {newUsers.map((user) => (
                <ListboxItem key={user.id} onClick={() => handleNewChat(user)}>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold">Dawid Komęza</div>
                      <div className="font-light">@{user.username}</div>
                    </div>
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </ModalBody>
        </ModalContent>
      </Modal>

      <GroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />
    </div>
  );
};
export default MessagesTab;
