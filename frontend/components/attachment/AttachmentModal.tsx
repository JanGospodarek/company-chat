"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { PushPin } from "@phosphor-icons/react";

const AttachmentModal = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button isIconOnly>
          <PushPin size={20} className="fill-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col items-center">
        <h2>Select file(s)</h2>
        <input type="file" />
      </PopoverContent>
    </Popover>
  );
};

export default AttachmentModal;
