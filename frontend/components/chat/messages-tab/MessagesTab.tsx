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
import Text from "@/components/reuseable/Text";

type Props = {
  handleTabChange: handleMobileTabChange;
  handleShowGroupModal: () => void;
};

const MessagesTab = (props: Props) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const [newUsers, setNewUsers] = useState([] as User[]);

  const dispatch = useAppDispatch();

  const fontSizeState = useSelector((state: RootState) => state.ui);

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

  const getInitials = (name: string) => {
    const n = name.trim();

    if (n.split(" ").length === 1) {
      return n.slice(0, 2).toUpperCase();
    }

    const split = n.split(" ");

    const initials = n[0] + split[split.length - 1][0];

    return initials.toUpperCase();
  };

  return (
    <div className="my-4 px-8  w-full md:w-[300px]  flex flex-col justify-start md:border-r-2 border-secondary  flex-shrink-0 ">
      <div className=" flex justify-between relativ">
        <Text className="text-3xl font-semibold text-text">Wiadomości</Text>
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

          <button
            onClick={() => setShowNewChat(true)}
            aria-label="Create new chat"
          >
            <UserPlus size={24} className="fill-primary" />
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            aria-label="Create group"
          >
            <FolderPlus size={24} className="fill-primary" />
          </button>
        </div>
      </div>
      <div className="flex flex-col overflow-y-scroll hide-scrollbar">
        <ActiveUsers />
        <ChatsList handleChatSelect={handleChatSelect} />
      </div>

      <Modal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        backdrop="blur"
        size="xs"
        className={`${fontSizeState.theme} bg-backgroundSecondary `}
        classNames={{
          body: "margin-0",
          wrapper: "margin-0",
          base: "w-full md:w-[300px] max-w-full m-0 rounded-b-none md:rounded-b-large max-h-[80vh]",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-text justify-center">
            <Text className="text-xl">Nowy chat</Text>
          </ModalHeader>
          <ModalBody className="overflow-scroll scrollbar-hide">
            <Listbox>
              {newUsers.map((user) => (
                <ListboxItem key={user.id} onClick={() => handleNewChat(user)}>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar
                      size="sm"
                      name={user.name + " " + user.surname}
                      getInitials={getInitials}
                    />
                    <div className="flex flex-col">
                      <Text className="font-semibold text-sm text-text">
                        {user.name} {user.surname}
                      </Text>
                      <Text className="font-light text-sm text-textSecondary">
                        @{user.username}
                      </Text>
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
