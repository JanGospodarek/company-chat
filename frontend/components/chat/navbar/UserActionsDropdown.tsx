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
type Props = {
  triggerElement: React.ReactNode;
};
const UserActionsDropdown = (props: Props) => {
  const { triggerElement } = props;
  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>{triggerElement}</DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={() => {}}>
        <DropdownItem key="adjust" className="text-primary flex">
          <RadioGroup label="Select font size" orientation="horizontal">
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
