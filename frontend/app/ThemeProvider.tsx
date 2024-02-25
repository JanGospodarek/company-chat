import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTheme } from "@/lib/uiSlice";
import { useEffect } from "react";

const ThemeProvider = (props: { children: any }) => {
  const selectedTheme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const readFromStorage = async () => {
      const theme = await localStorage.getItem("theme");
      if (theme) dispatch(setTheme(theme === "high-contrast"));
    };
    readFromStorage();
  }, []);

  useEffect(() => {
    const writeToStorage = async () => {
      await localStorage.removeItem("theme");
      await localStorage.setItem("theme", selectedTheme);
    };
    writeToStorage();
  }, [selectedTheme]);
  return <div className={`${selectedTheme}`}>{props.children}</div>;
};
export default ThemeProvider;
