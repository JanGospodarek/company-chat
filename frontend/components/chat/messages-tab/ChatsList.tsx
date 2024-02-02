import Chat from "./Chat";

type Props = {
  handleChatSelect: () => void;
};

const ChatsList = (props: Props) => {
  const { handleChatSelect } = props;
  return (
    <div className="w-full flex flex-col mt-2 overflow-y-scroll h-full hide-scrollbar">
      <div className="text-start text-sm font-semibold">All Messages</div>
      <Chat handleChatSelect={handleChatSelect} />
    </div>
  );
};
export default ChatsList;
