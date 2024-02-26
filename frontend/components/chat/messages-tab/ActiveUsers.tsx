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

  const getInitials = (name: string) => {
    const n = name.trim();

    if (n.split(" ").length === 1) {
      return n.slice(0, 2).toUpperCase();
    }

    const split = n.split(" ");

    const initials = n[0] + split[split.length - 1][0];

    return initials.toUpperCase();
  };

  return (
    <div className="flex flex-col w-full mt-6">
      <div className="flex justify-between mb-2">
        <h2
          className={`${computeFont(
            "text-lg",
            fontSizeState
          )} font-semibold text-primary`}
        >
          Aktywni użytkownicy
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-scroll hide-scrollbar">
        {activeUsers.users.map((user: User) => (
          <div className="flex flex-col items-center" key={user.id}>
            <Badge
              content=""
              color="success"
              shape="circle"
              className="mt-1"
              key={user.username}
            >
              <Avatar
                radius="full"
                name={user.username}
                showFallback
                getInitials={getInitials}
                size="lg"
              />
            </Badge>
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ActiveUsers;
