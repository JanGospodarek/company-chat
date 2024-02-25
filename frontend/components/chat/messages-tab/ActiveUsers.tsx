import { Badge, Avatar } from "@nextui-org/react";
import computeFont from "@/components/utils/getComputedFontSize";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import type { User } from "../../../../shared/types";

const ActiveUsers = () => {
  const fontSizeState = useSelector((state: RootState) => state.ui);
  const activeUsers = useSelector((state: RootState) => state.activeUsers);

  if (activeUsers.users.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full mt-6">
      <div className="flex justify-between mb-2">
        <h2
          className={`${computeFont(
            "text-lg",
            fontSizeState
          )} font-semibold text-primary`}
        >
          Active Users
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-scroll hide-scrollbar">
        {activeUsers.users.map((user: User) => (
          <Badge
            content=""
            color="success"
            shape="circle"
            className="mt-1"
            key={user.username}
          >
            <Avatar radius="full" name={user.username} />
          </Badge>
        ))}
      </div>
    </div>
  );
};
export default ActiveUsers;
