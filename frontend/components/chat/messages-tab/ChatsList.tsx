import Chat from "./Chat";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import computeFont from "@/components/utils/getComputedFontSize";
type Props = {
  handleChatSelect: () => void;
};

const ChatsList = (props: Props) => {
  const fontSizeState = useSelector((state: RootState) => state.font);

  const { handleChatSelect } = props;
  return (
    <div className="w-full flex flex-col mt-2 overflow-y-scroll h-full hide-scrollbar">
      <div
        className={`${computeFont(
          "text-lg",
          fontSizeState
        )} text-start  font-semibold text-primary`}
      >
        All Messages
      </div>
      <Chat handleChatSelect={handleChatSelect} />
    </div>
  );
};
export default ChatsList;
