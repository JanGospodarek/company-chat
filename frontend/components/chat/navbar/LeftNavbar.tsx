"use client";
import { Avatar, Button } from "@nextui-org/react";
import { Faders } from "@phosphor-icons/react";
import UserActionsDropdown from "./UserActionsDropdown";

const LeftNavbar = () => {
  return (
    <div className="h-full bg-text rounded-l-[50px] flex justify-end items-center flex-col py-8 px-3 bg-slate-800">
      <UserActionsDropdown
        triggerElement={
          <button>
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              size="md"
            />
          </button>
        }
      />
    </div>
  );
};
export default LeftNavbar;
