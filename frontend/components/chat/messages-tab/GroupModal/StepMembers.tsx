import { Avatar, Checkbox, CheckboxGroup, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getUsers } from "@shared/api";
import { User } from "@shared/types";
import Text from "@/components/reuseable/Text";
type Props = {
  groupMembers: string[];
  setGroupMembers: (members: string[]) => void;
  setStep: (step: number) => void;
  submit: () => void;
};

const StepMembers = (props: Props) => {
  const { groupMembers, setGroupMembers, submit, setStep } = props;

  const [allUsers, setAllUsers] = useState([] as User[]);

  useEffect(() => {
    // fetch all users
    getUsers().then((users) => {
      setAllUsers(users);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Text className="text-lg font-semibold justify-center flex">
        Dodaj użytkowników
      </Text>
      {/* <div className="flex flex-col">
        <Input label="Search users" className="mb-2 w-48 " size="sm" />
      </div> */}
      <div className="h-48 w-full overflow-y-scroll p-3 hide-scrollbar">
        {/* Start typing to search for users */}
        <CheckboxGroup value={groupMembers} onValueChange={setGroupMembers}>
          {allUsers.map((user) => (
            <Checkbox value={user.id.toString()} key={user.id}>
              <div className="flex items-center gap-3">
                <Avatar
                  radius="full"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                />
                <Text className="text-md">{user.username}</Text>
              </div>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div className="flex gap-2 ">
        <button
          className="bg-primary text-white p-2 rounded-lg w-full"
          onClick={() => setStep(1)}
        >
          <Text className="text-md">Back</Text>
        </button>
        <button
          className="bg-primary text-white p-2 rounded-lg w-full"
          onClick={submit}
        >
          <Text className="text-md">Create</Text>
        </button>
      </div>
    </div>
  );
};
export default StepMembers;
