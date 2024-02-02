import { useState } from "react";
import StepName from "./StepName";
import StepMembers from "./StepMembers";

type Props = {
  handleShowModal: () => void;
};

const GroupModal = (props: Props) => {
  const { handleShowModal } = props;
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState<string>("");
  const handleStepChange = (step: number) => setStep(step);
  const handleGroupNameChange = (name: string) => setGroupName(name);
  return (
    <div className="absolute top-0 left-0 w-full h-full  flex justify-center items-center z-10">
      <div
        className="absolute top-0 left-0 bg-black bg-opacity-50 z-10 w-full h-full md:rounded-[50px]"
        onClick={handleShowModal}
      ></div>
      <div className="bg-white p-4 rounded-xl z-20 relative">
        {step === 1 && (
          <StepName
            handleStepChange={handleStepChange}
            handleGroupNameChange={handleGroupNameChange}
          />
        )}
        {step === 2 && <StepMembers handleStepChange={handleStepChange} />}
      </div>
    </div>
  );
};
export default GroupModal;
