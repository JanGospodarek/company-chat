"use client";
import { MagnifyingGlass, UserPlus } from "@phosphor-icons/react";
import ActiveUsers from "./ActiveUsers";
import ChatsList from "./ChatsList";
import { useState } from "react";

const MessagesTab = () => {
  const [showSearchTab, setShowSearchTab] = useState(false);
  return (
    <div className="my-4 px-8 w-[350px] flex flex-col justify-start border-r-2 border-secondary ">
      <div className=" flex justify-between relative">
        <p className=" text-3xl font-semibold">Messages</p>
        <div className="flex gap-3">
          <button>
            <UserPlus size={24} />
          </button>
          <button
            onClick={() => {
              setShowSearchTab((state) => !state);
            }}
          >
            <MagnifyingGlass size={24} />
          </button>
        </div>
        <div
          className={`absolute bg-slate-200 w-0 h-8 top-0 right-[28px] rounded-xl flex justify-center items-center ${
            showSearchTab && "animate-open-search"
          }`}
        >
          <input
            type="text"
            placeholder="Search user"
            className="bg-slate-200 w-full text-sm mx-2"
          />
        </div>
      </div>
      <div className="flex flex-col relative flex-1">
        <div
          className={`w-full  rounded-[30px] bg-slate-100 absolute top-0 left-0 z-20 shadow-xl ${
            showSearchTab && "animate-open-search-results"
          }`}
        ></div>
        <ActiveUsers />
        <ChatsList />
      </div>
    </div>
  );
};
export default MessagesTab;
