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
  Switch,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setFontSize, setTheme } from "@/lib/uiSlice";
import Text from "@/components/reuseable/Text";
type Props = {
  triggerElement: React.ReactNode;
};

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "@phosphor-icons/react";

const UserActionsDropdown = (props: Props) => {
  const { logOut } = useAuth();
  const router = useRouter();

  const { triggerElement } = props;
  const dispatch = useDispatch();
  const fontSizeState = useSelector((state: RootState) => state.ui.fontSize);
  const theme = useSelector((state: RootState) => state.ui.theme);

  const handleLogout = async () => {
    await logOut();
    console.log("Logged out");
    router.push("/login");
  };

  return (
    <Dropdown
      closeOnSelect={false}
      className={`${theme} bg-backgroundSecondary`}
    >
      <DropdownTrigger>{triggerElement}</DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={() => {}}>
        <DropdownItem key="adjust" className="text-primary flex">
          <RadioGroup
            label="Wybierz rozmiar czcionki"
            orientation="horizontal"
            onChange={(e) => dispatch(setFontSize(e.target.value))}
            value={fontSizeState}
            classNames={{
              label: "text-text",
            }}
          >
            <Radio value="normal">
              <p className="text-md text-text">normalny</p>
            </Radio>
            <Radio value="large">
              <p className="text-xl text-text">duży</p>
            </Radio>
          </RadioGroup>
        </DropdownItem>
        <DropdownItem key="adjust-contrast" className="text-primary flex">
          <Switch
            onValueChange={(isSelected) => dispatch(setTheme(isSelected))}
            isSelected={theme === "high-contrast"}
            size="md"
            color="primary"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <Moon className={className} />
              ) : (
                <Sun className={className} />
              )
            }
          >
            <Text className="text-sm text-text">Motyw</Text>
          </Switch>
        </DropdownItem>

        <DropdownItem key="logout" className="text-danger ">
          <Button
            className="w-full "
            color="danger"
            variant="flat"
            onClick={handleLogout}
          >
            Wyloguj się
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default UserActionsDropdown;
