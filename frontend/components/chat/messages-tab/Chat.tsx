import { Avatar, Badge } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import computeFont from "@/components/utils/getComputedFontSize";
type Props = {
  handleChatSelect: () => void;
};

const Chat = (props: Props) => {
  const { handleChatSelect } = props;
  const fontSizeState = useSelector((state: RootState) => state.font.fontSize);

  return (
    <button className="w-full flex mt-2" onClick={handleChatSelect}>
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
          <div className="text-md font-semibold">Mateusz Kowalski</div>
          <div className="font-light text-xs">10:11 01.01.2024</div>
        </div>
        <p className="font-light text-xs text-left">
          Lorem ipsum dolor sit amet...
        </p>
      </div>
    </button>
  );
};
export default Chat;
