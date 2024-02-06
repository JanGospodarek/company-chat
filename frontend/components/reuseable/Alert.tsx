interface AlertProps {
  message: string;
  type: "error" | "success";
}
const Alert = (props: AlertProps) => {
  const { message, type } = props;
  return (
    <div
      className={`absolute bottom-0 w-[80%] h-18 rounded-lg flex items-center p-6 ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {message}
    </div>
  );
};
export default Alert;
