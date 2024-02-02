import { Avatar, Badge } from "@nextui-org/react";
import Message from "./Message";
import TypeBar from "./TypeBar";
import { type handleMobileTabChange } from "../types";
import { ArrowCircleLeft } from "@phosphor-icons/react";
type Props = {
  handleTabChange: handleMobileTabChange;
};

const Conversation = (props: Props) => {
  const { handleTabChange } = props;
  return (
    <div className="flex flex-col  m-4 flex-1">
      <div className="flex items-center gap-4">
        <button onClick={() => handleTabChange("messages")}>
          <ArrowCircleLeft size={48} className="md:hidden fill-primary" />
        </button>

        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            size="lg"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <div className="flex flex-col ml-2 justify-center w-full">
          <div className="text-xl font-semibold">Mateusz Kowalski</div>
          <p className="font-light text-sm text-primary ">
            mateusz@kowalski.co.pl
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-6 w-full h-full">
        <Message isMine={false} />
        <Message isMine />
      </div>
      <TypeBar />
    </div>
  );
};
export default Conversation;
