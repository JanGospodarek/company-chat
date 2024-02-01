type Props = {
  isMine: boolean;
};
const Message = (props: Props) => {
  const { isMine } = props;
  return (
    <div className={`flex w-full ${isMine && "flex-row-reverse"}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Monika Kowalska</p>
          <p className="text-xs text-primary">12:00</p>
        </div>
        <div
          className={`rounded-b-[20px]  ${
            isMine
              ? "bg-primary rounded-tl-[20px]"
              : "bg-secondary rounded-tr-[20px]"
          }  font-semibold p-3 text-[14px]`}
        >
          Cześć, jak się masz?
        </div>
      </div>
    </div>
  );
};
export default Message;
