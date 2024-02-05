import { Avatar, Checkbox, CheckboxGroup, Input } from "@nextui-org/react";

type Props = {
  handleStepChange: (step: number) => void;
};

const StepMembers = (props: Props) => {
  const { handleStepChange } = props;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-semibold">Select members</p>
      <div className="flex flex-col">
        <Input label="Search users" className="mb-2 w-48 " size="sm" />
      </div>
      <div className="h-48 w-full overflow-y-scroll p-3 hide-scrollbar">
        {/* Start typing to search for users */}
        <CheckboxGroup>
          <Checkbox value="jan@kowalski.com">
            <div className="flex items-center gap-3">
              <Avatar
                radius="full"
                size="sm"
                src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              />
              <p>Jan Kowalski</p>
            </div>
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div className="flex gap-2 ">
        <button
          className="bg-primary text-white p-2 rounded-lg w-full"
          onClick={() => handleStepChange(1)}
        >
          Back
        </button>
        <button className="bg-primary text-white p-2 rounded-lg w-full">
          Create
        </button>
      </div>
    </div>
  );
};
export default StepMembers;
