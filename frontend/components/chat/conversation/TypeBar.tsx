"use client";

import { PaperPlaneTilt, PushPin } from "@phosphor-icons/react";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import { miau } from "../../../../shared/api";

import { Button, ButtonGroup } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

type Props = {
  chatId: number;
};

const TypeBar = (props: Props) => {
  const { chatId } = props;

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getValue = () => {
    return input;
  };

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const i = getValue();

    const message = i;

    if (!message) return;

    miau.sendMessage(message);

    setInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  return (
    <form onSubmit={handleSend}>
      <Input
        style={{ fontSize: "1rem", lineHeight: "1rem" }}
        variant="flat"
        size="md"
        value={input}
        onValueChange={setInput}
        radius="full"
        ref={inputRef}
        endContent={
          <ButtonGroup>
            <Button isIconOnly>
              <PushPin size={20} className="fill-primary" />
            </Button>
            <Button type="submit" isIconOnly>
              <PaperPlaneTilt size={20} className="fill-primary" />
            </Button>
          </ButtonGroup>
        }
      />
    </form>
  );
};
export default TypeBar;
