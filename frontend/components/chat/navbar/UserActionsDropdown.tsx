"use client";
import React, { useEffect } from "react";
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
const UserActionsDropdown = (props: Props) => {
  const { triggerElement } = props;
  const dispatch = useDispatch();
  const fontSizeState = useSelector((state: RootState) => state.font.fontSize);

  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>{triggerElement}</DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={() => {}}>
        <DropdownItem key="adjust" className="text-primary flex">
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
          <Button className="w-full " color="danger" variant="flat">
            Logout
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default UserActionsDropdown;
