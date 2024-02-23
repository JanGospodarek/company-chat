import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider, useTheme } from "react-native-paper";
const primaryTheme = {
  ...DefaultTheme,
  custom: "property",
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(120, 69, 172)",
    secondary: "#E5E2F7",
    background: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    optionalBorderColor: "transparent",
    primaryFont: "#000000",
    secondaryFont: "#909090",
    secondaryFontDarker: "#707070",
  },
};
const highContrastTheme = {
  ...DefaultTheme,
  custom: "property",
  colors: {
    ...DefaultTheme.colors,
    primary: "#fcba03",
    secondary: "#ffd86b",
    background: "#000000",
    backgroundSecondary: "#363636",
    primaryFont: "#FFFFFF",
    secondaryFont: "#e8e8e8",
    secondaryFontDarker: "#8f8f8f",
    optionalBorderColor: "#fcba03",
  },
};
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const selectedTheme = useAppSelector((state) => state.ui.theme);

  return (
    <PaperProvider
      theme={selectedTheme === "normal" ? primaryTheme : highContrastTheme}
    >
      {children}
    </PaperProvider>
  );
};
export default ThemeProvider;

export type AppTheme = typeof primaryTheme;

export const useAppTheme = () => useTheme<AppTheme>();
