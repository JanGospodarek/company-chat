import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@shared/types";

type Props = {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
};
const Message = (props: Props) => {
  const { message, isFirst, isLast } = props;
  const { user } = useAuth();

  const isMine = message.user.id === user?.id;

  return (
    <div className="flex flex-col">
      <div
        className={`max-w-[200px] rounded-md   ${
          isMine ? "bg-primary rounded-l-2xl" : "bg-secondary rounded-r-2xl"
        }  font-semibold p-3 text-[14px]
        ${isFirst ? "rounded-t-2xl" : ""}
        ${isLast ? "rounded-b-2xl" : ""}`}
      >
        {message.content}
      </div>
    </div>
  );
};
export default Message;
