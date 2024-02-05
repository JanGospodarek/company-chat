import { Input } from "@nextui-org/react";
import { useRef } from "react";

type Props = {
  handleStepChange: (step: number) => void;
  handleGroupNameChange: (name: string) => void;
};
const StepName = (props: Props) => {
  const { handleStepChange, handleGroupNameChange } = props;
  const groupNameRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-semibold">Create Group</p>
      <Input
        label="Group name"
        ref={groupNameRef}
        className="mb-2 w-48"
        size="sm"
      />
      <button
        className="bg-primary text-white p-2 rounded-lg w-full"
        onClick={() => {
          if (groupNameRef.current?.value) {
            handleGroupNameChange(groupNameRef.current?.value);
            handleStepChange(2);
          }
        }}
      >
        Select Members
      </button>
    </div>
  );
};
export default StepName;
