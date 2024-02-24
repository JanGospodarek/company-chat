import { useAppSelector } from "@/lib/hooks";
import computeFont from "@/components/utils/getComputedFontSize";
import { tailwindFontsSizes } from "@/components/utils/getComputedFontSize";
interface Props {
  className?: string;
  children: React.ReactNode | string;
}
const Text = (props: Props) => {
  const { className } = props;
  const fontSizeState = useAppSelector((state) => state.font);

  if (className === undefined) return <p>{props.children}</p>;

  const textI = className?.split(" ").findIndex((className) => {
    const size = className.split("-")[1];
    return className.startsWith("text-") && tailwindFontsSizes.includes(size);
  });
  //   const textI = className?.split(" ").findIndex((c) => c.includes("text-"));

  if (textI === -1 || textI === undefined)
    return <p className={props.className}>{props.children}</p>;

  const text = className?.split(" ")[textI] as string;
  const newText = computeFont(text, fontSizeState) as string;

  const newClass = className?.replace(text, newText);
  console.log(newClass, "OLD:", className);
  return <p className={newClass}>{props.children}</p>;
};
export default Text;
