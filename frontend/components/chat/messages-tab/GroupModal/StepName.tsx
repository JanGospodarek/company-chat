import { useAppSelector } from "@/lib/hooks";
import { Input } from "@nextui-org/react";
import { useRef, useState } from "react";

type Props = {
  groupName: string;
  setStep: (step: number) => void;
  setGroupName: (groupName: string) => void;
};
const StepName = (props: Props) => {
  const { groupName, setStep, setGroupName } = props;
  const groupNameRef = useRef<HTMLInputElement>(null);
  const theme = useAppSelector((state) => state.ui.theme);
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Nazwa grupy"
        ref={groupNameRef}
        className="mb-2"
        size="sm"
        fullWidth
        isInvalid={!!error}
        errorMessage={error}
        value={props.groupName}
        onChange={(e) => setGroupName(e.target.value)}
        classNames={{
          input: ["text-text"],
          label: ["text-text"],
          description: ["text-text"],
        }}
        variant={theme === "normal" ? "flat" : "bordered"}
      />
      <button
        className={`bg-primary text-${
          theme === "normal" ? "white" : "black"
        } p-2 rounded-lg w-full`}
        onClick={() => {
          if (groupName.trim()) {
            setStep(2);
          } else {
            groupNameRef.current?.focus();
            setError("Nazwa grupy nie może być pusta");

            setTimeout(() => {
              setError("");
            }, 3000);
          }
        }}
      >
        Wybierz członków
      </button>
    </div>
  );
};
export default StepName;
