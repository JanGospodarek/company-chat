import { Badge, Avatar } from "@nextui-org/react";
import computeFont from "@/components/utils/getComputedFontSize";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
const ActiveUsers = () => {
  const fontSizeState = useSelector((state: RootState) => state.font);

  return (
    <div className="flex flex-col w-full mt-6">
      <div className="flex justify-between mb-2">
        <p
          className={`${computeFont(
            "text-lg",
            fontSizeState
          )} font-semibold text-primary`}
        >
          Active Users
        </p>
        {/* <button className="text-sm font-semibold "> See All</button> */}
      </div>
      <div className="flex gap-3 overflow-x-scroll hide-scrollbar">
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <Badge content="" color="success" shape="circle" className="mt-1">
          <Avatar
            radius="full"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
      </div>
    </div>
  );
};
export default ActiveUsers;
