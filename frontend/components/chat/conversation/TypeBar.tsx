"use client";

import { PaperPlaneTilt, PushPin, ArrowDown } from "@phosphor-icons/react";
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

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  chatId: number;
  buttonVisible: boolean;
  handleButtonClick: () => void;
};

const TypeBar = (props: Props) => {
  const { chatId, buttonVisible, handleButtonClick } = props;

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
    <form onSubmit={handleSend} className="relative flex justify-center">
      <AnimatePresence>
        {buttonVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 w-10 h-10 bg-slate-100 rounded-full -top-14 flex justify-center items-center cursor-pointer"
            style={{
              filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.3))",
            }}
            whileHover={{
              // scale: 1.05,
              filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.6))",
              transition: { duration: 0.2 },
            }}
            role="button"
            onClick={handleButtonClick}
          >
            <div className="w-[80%] h-[80%] border-medium border-primary rounded-full flex justify-center items-center">
              <ArrowDown size={24} className="fill-primary" strokeWidth={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
