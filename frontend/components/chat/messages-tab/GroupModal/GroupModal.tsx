import { useState } from "react";
import StepName from "./StepName";
import StepMembers from "./StepMembers";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { addUsersToChat, newGroupChat } from "@shared/api";
import Text from "@/components/reuseable/Text";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const GroupModal = (props: Props) => {
  const { isOpen, onClose } = props;

  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([] as string[]);

  const handleSubmit = async () => {
    // create group
    const groupId = await newGroupChat(groupName);
    const members = groupMembers.map((member) => parseInt(member));

    // add members to group
    await addUsersToChat(groupId, members);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalContent>
        <ModalHeader className="text-black justify-center">
          <Text className="text-xl">Nowa Grupa</Text>
        </ModalHeader>
        <ModalBody>
          {step === 1 && (
            <StepName
              groupName={groupName}
              setGroupName={setGroupName}
              setStep={setStep}
            />
          )}
          {step === 2 && (
            <StepMembers
              groupMembers={groupMembers}
              setGroupMembers={setGroupMembers}
              setStep={setStep}
              submit={handleSubmit}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>

    // <div className="absolute top-0 left-0 w-full h-full  flex justify-center items-center z-10">
    //   <div
    //     className="absolute top-0 left-0 bg-black bg-opacity-50 z-10 w-full h-full md:rounded-[50px]"
    //     onClick={handleShowModal}
    //   ></div>
    //   <div className="bg-white p-4 rounded-xl z-20 relative">
    //     {step === 1 && (
    //       <StepName
    //         handleStepChange={handleStepChange}
    //         handleGroupNameChange={handleGroupNameChange}
    //       />
    //     )}
    //     {step === 2 && <StepMembers handleStepChange={handleStepChange} />}
    //   </div>
    // </div>
  );
};
export default GroupModal;
