"use client";
import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setFontSize } from "@/lib/fontSlice";
type Props = {
  triggerElement: React.ReactNode;
};

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const UserActionsDropdown = (props: Props) => {
  const { logOut } = useAuth();
  const router = useRouter();

  const { triggerElement } = props;
  const dispatch = useDispatch();
  const fontSizeState = useSelector((state: RootState) => state.font.fontSize);

  const handleLogout = async () => {
    await logOut();
    console.log("Logged out");
    router.push("/login");
  };

  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>{triggerElement}</DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={() => {}}>
        <DropdownItem key="adjust" className="text-primary flex" >
          <RadioGroup
            label="Select font size"
            orientation="horizontal"
            onChange={(e) => dispatch(setFontSize(e.target.value))}
            value={fontSizeState}
          >
            <Radio value="normal">normal</Radio>
            <Radio value="large">large</Radio>
          </RadioGroup>
        </DropdownItem>
        <DropdownItem key="logout" className="text-danger ">
          <Button
            className="w-full "
            color="danger"
            variant="flat"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default UserActionsDropdown;
