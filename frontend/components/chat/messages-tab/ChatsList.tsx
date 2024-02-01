import Chat from "./Chat";

const ChatsList = () => {
  return (
    <div className="w-full flex flex-col mt-2 overflow-y-scroll h-full hide-scrollbar">
      <div className="text-start text-sm font-semibold">All Messages</div>
      <Chat />
      <Chat />
      <Chat />
      <Chat />
    </div>
  );
};
export default ChatsList;
