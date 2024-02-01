import LeftNavbar from "@/components/chat/LeftNavbar";
import Conversation from "@/components/chat/conversation/Conversation";
import ChatsList from "@/components/chat/messages-tab/MessagesTab";

const ChatPage = () => {
  return (
    <div className="font-league bg-secondary text-foreground w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="rounded-[50px]  bg-white w-[80%] h-[80%] flex">
        <LeftNavbar />
        <ChatsList />
        <Conversation />
      </div>
    </div>
  );
};
export default ChatPage;
