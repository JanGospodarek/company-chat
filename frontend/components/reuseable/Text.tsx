import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import computeFont from "@/components/utils/getComputedFontSize";
import { tailwindFontsSizes } from "@/components/utils/getComputedFontSize";
import { useEffect } from "react";
import { setFontSize } from "@/lib/uiSlice";
interface Props {
  className?: string;
  children: React.ReactNode | string;
}
const Text = (props: Props) => {
  const { className } = props;
  const fontSizeState = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const readFromStorage = async () => {
      const font = await localStorage.getItem("fontSize");
      if (font) dispatch(setFontSize(font));
    };
    readFromStorage();
  }, []);

  useEffect(() => {
    const writeToStorage = async () => {
      await localStorage.removeItem("fontSize");
      await localStorage.setItem("fontSize", fontSizeState.fontSize);
    };
    writeToStorage();
  }, [fontSizeState]);

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
  return <p className={newClass}>{props.children}</p>;
};
export default Text;
