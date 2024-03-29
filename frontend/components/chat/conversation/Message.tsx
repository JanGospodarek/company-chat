import { computeLongDate } from "@/components/utils/computeDate";
import { useAuth } from "@/contexts/AuthContext";
import { Image, Tooltip } from "@nextui-org/react";
import { File } from "@phosphor-icons/react";
import { loadAttachments, miau } from "@shared/api";
import { Attachment, Message } from "@shared/types";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Text from "@/components/reuseable/Text";
import { useAppSelector } from "@/lib/hooks";
import computeFont from "@/components/utils/getComputedFontSize";
type Props = {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  loadMore: ((messageId: number) => void) | undefined;
  setInView: ((inView: boolean) => void) | undefined;
};
const Message = (props: Props) => {
  const { message, isFirst, isLast, loadMore, setInView } = props;
  const fontSizeState = useAppSelector((state) => state.ui);
  const { user } = useAuth();
  const messageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(messageRef, {
    once: !loadMore && !setInView,
    amount: 0.1,
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

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

  useEffect(() => {
    if (message.attachment) {
      loadAttachments(message.attachment, message.messageId).then((media) => {
        setAttachments(media);
      });
    }
  }, []);

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
        className={`${computeFont("text-sm", fontSizeState)} `}
      >
        <div
          className={`max-w-[400px] rounded-md   ${
            isMine ? "bg-primary rounded-l-2xl" : "bg-secondary rounded-r-2xl"
          }  font-semibold py-1 px-3 flex flex-wrap gap-2
        ${isFirst ? "rounded-t-2xl" : ""}
        ${isLast ? "rounded-b-2xl" : ""}`}
        >
          {message.attachment && (
            <div className="flex gap-2 flex-wrap  justify-between p-2 bg-secondary-200 bg-opacity-30 rounded-2xl mt-2 mb-2">
              {attachments.map((attachment) => (
                <div key={String(Math.round(Math.random() * 1000))}>
                  {attachment.type.startsWith("image/") ? (
                    <div
                      key={attachment.path}
                      className={`${attachments.length > 1 ? "w-[48%]" : ""}`}
                    >
                      <Image src={`/api/media/${attachment.path}`} />
                    </div>
                  ) : (
                    <a
                      key={attachment.path}
                      href={`/api/media/${attachment.path}`}
                      download
                      className={`${
                        attachments.length > 1 ? "w-[48%]" : "w-[200px]"
                      } bg-black bg-opacity-0 rounded-xl text-background hover:bg-opacity-10 transition-all`}
                    >
                      <div className="flex flex-col h-full items-center">
                        <div className="bg-slate-300 w-full h-full rounded-xl flex items-center justify-center">
                          <File size={attachments.length > 1 ? 130 : 260} />
                        </div>
                        <Text className="text-md">{attachment.name}</Text>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          <Text className="text-md">{message.content}</Text>
        </div>
      </Tooltip>
    </div>
  );
};
export default Message;
