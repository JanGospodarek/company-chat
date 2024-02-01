import { Avatar, Badge } from "@nextui-org/react";

const Chat = () => {
  return (
    <div className="w-full flex mt-2">
      <div>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            size="lg"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
      </div>
      <div className="flex flex-col ml-2 justify-center w-full">
        <div className="flex justify-between w-full">
          <div className="text-[15px] font-semibold">Mateusz Kowalski</div>
          <div className="font-light text-xs">10:11 01.01.2024</div>
        </div>
        <p className="font-light text-xs">Lorem ipsum dolor sit amet...</p>
      </div>
    </div>
  );
};
export default Chat;
