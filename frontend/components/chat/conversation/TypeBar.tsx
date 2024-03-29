"use client";

import { PaperPlaneTilt, PushPin, ArrowDown, X } from "@phosphor-icons/react";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import { miau, sendMessageWithAttachment } from "@shared/api";

import { Button, ButtonGroup } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/lib/hooks";
import computeFont from "@/components/utils/getComputedFontSize";
import Text from "@/components/reuseable/Text";
type Props = {
  chatId: number;
  buttonVisible: boolean;
  handleButtonClick: () => void;
};

const TypeBar = (props: Props) => {
  const { chatId, buttonVisible, handleButtonClick } = props;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([] as File[]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontSizeState = useAppSelector((state) => state.ui);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getValue = () => {
    return input;
  };

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const i = getValue();
    console.log(i);
    const message = i;
    console.log(selectedFiles);
    if (selectedFiles.length > 0) {
      console.log(selectedFiles);
      sendMessageWithAttachment(chatId, message, selectedFiles);
      setSelectedFiles([]);
      setInput("");
      inputRef.current?.focus();
      return;
    }

    if (!message) return;

    miau.sendMessage(message);

    setInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => {
        return prev ? [...prev, ...files] : files;
      });

      e.target.value = "";
    }
  };

  const removeFile = (file: File) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((f) => f !== file);

      return newFiles;
    });
  };

  return (
    <form onSubmit={handleSend} className="relative flex justify-center">
      <AnimatePresence>
        {buttonVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 w-10 h-10 bg-backgroundSecondary rounded-full -top-14 flex justify-center items-center cursor-pointer"
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
            <div className="w-[80%] h-[80%] border-medium border-primary rounded-full flex justify-center items-center bg-backgroundSecondary">
              <ArrowDown size={24} className="fill-primary" strokeWidth={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            transition={{ delay: 0.1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-[80%] h-[8rem] bg-backgroundSecondary left-0  rounded-2xl px-3"
          >
            {selectedFiles && (
              <div className="flex items-center h-full gap-4 overflow-x-scroll overflow-y-visible scrollbar-hide bg-backgroundSecondary">
                {Array.from(selectedFiles).map((file) => (
                  <div
                    key={file.name + String(Math.round(Math.random() * 1000))}
                    className="flex flex-col items-center gap-1 relative"
                  >
                    <div className="bg-default-300 h-[5rem] w-[5rem] rounded-lg">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center">
                          <Text className="text-2xl text-primary">📎</Text>
                        </div>
                      )}
                    </div>
                    <Text className="w-[5rem] overflow-hidden text-xs text-ellipsis whitespace-nowrap text-text">
                      {file.name}
                    </Text>
                    <button
                      className="absolute bg-red-500 p-1 rounded-full -right-2 -top-2 z-10"
                      onClick={() => removeFile(file)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Input
        style={{
          fontSize: fontSizeState.fontSize === "normal" ? "1rem" : "1.3rem",
          lineHeight: "1rem",
        }}
        className={`${
          selectedFiles.length > 0 ? "pt-[9rem]" : ""
        } transition-all color-white`}
        classNames={{
          input: ["text-text"],
        }}
        variant={fontSizeState.theme === "normal" ? "flat" : "bordered"}
        color="primary"
        size="md"
        value={input}
        onValueChange={setInput}
        radius="full"
        ref={inputRef}
        endContent={
          <ButtonGroup>
            <Button
              isIconOnly
              className="cursor-pointer bg-backgroundSecondary"
            >
              <label
                htmlFor="file-input"
                className="cursor-pointer w-full h-full flex justify-center items-center"
              >
                <PushPin size={20} className="fill-primary cursor-pointer" />
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                multiple
              />
            </Button>
            <Button type="submit" isIconOnly className="bg-backgroundSecondary">
              <PaperPlaneTilt size={20} className="fill-primary" />
            </Button>
          </ButtonGroup>
        }
      />
    </form>
  );
};
export default TypeBar;
