"use client";
import { Avatar, Button } from "@nextui-org/react";
import { Faders } from "@phosphor-icons/react";
import UserActionsDropdown from "./UserActionsDropdown";
import { Gear } from "@phosphor-icons/react";
const LeftNavbar = () => {
  return (
    <div className="h-full  rounded-l-[50px] flex justify-end items-center flex-col py-8 px-3 bg-slate-800">
      <UserActionsDropdown
        triggerElement={
          <button>
            <Gear size={40} className="fill-white" />
          </button>
        }
      />
    </div>
  );
};
export default LeftNavbar;
