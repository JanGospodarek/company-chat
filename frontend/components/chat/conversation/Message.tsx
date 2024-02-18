import { computeLongDate } from "@/components/utils/computeDate";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip } from "@nextui-org/react";
import { miau } from "@shared/api";
import { Message } from "@shared/types";
import { useInView } from "framer-motion";
import { RefObject, useEffect, useRef } from "react";

type Props = {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  loadMore: ((messageId: number) => void) | undefined;
  setInView: ((inView: boolean) => void) | undefined;
};
const Message = (props: Props) => {
  const { message, isFirst, isLast, loadMore, setInView } = props;
  const { user } = useAuth();
  const messageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(messageRef, {
    once: !loadMore && !setInView,
    amount: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      if (message.readBy.every((u) => u.id !== user?.id)) {
        miau.markMessageAsRead(message.messageId);
      }
    }

    if (isInView && loadMore) {
      loadMore(message.messageId);
    }

    setInView?.(isInView);
  }, [isInView]);

  const isMine = message.user.id === user?.id;

  return (
    <div
      className="flex flex-col"
      ref={messageRef}
      id={message.messageId.toString()}
    >
      <Tooltip
        content={computeLongDate(new Date(message.createdAt))}
        placement={isMine ? "left-start" : "right-start"}
        delay={500}
        size="sm"
      >
        <div
          className={`max-w-[200px] rounded-md   ${
            isMine ? "bg-primary rounded-l-2xl" : "bg-secondary rounded-r-2xl"
          }  font-semibold py-1 px-3 text-[14px]
        ${isFirst ? "rounded-t-2xl" : ""}
        ${isLast ? "rounded-b-2xl" : ""}`}
        >
          {message.content}
        </div>
      </Tooltip>
    </div>
  );
};
export default Message;
