"use client";
import { MagnifyingGlass, UserPlus } from "@phosphor-icons/react";
import ActiveUsers from "./ActiveUsers";
import ChatsList from "./ChatsList";

const MessagesTab = () => {
  return (
    <div className="my-4 px-8 w-[350px] flex flex-col justify-start border-r-2 border-secondary ">
      <div className=" flex justify-between">
        <p className=" text-3xl font-semibold">Messages</p>
        <div className="flex gap-3">
          <button>
            <UserPlus size={24} />
          </button>
          <button>
            <MagnifyingGlass size={24} />
          </button>
        </div>
      </div>
      <ActiveUsers />
      <ChatsList />
    </div>
  );
};
export default MessagesTab;
