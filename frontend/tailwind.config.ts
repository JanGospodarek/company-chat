import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        league: ["League Spartan", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      // defaultTheme: "normal",
      themes: {
        normal: {
          extend: "light",
          colors: {
            primary: {
              DEFAULT: "rgb(120, 69, 172)",
              foreground: "#252525",
            },
            secondary: {
              DEFAULT: "#E5E2F7",
            },
            background: {
              DEFAULT: "#FFFFFF",
            },
            // @ts-ignore
            backgroundSecondary: {
              DEFAULT: "#F5F5F5",
            },
            text: {
              DEFAULT: "#FFFFFF",
            },
            textSecondary: {
              DEFAULT: "#00d7fc",
            },
            optionalBorderColor: {
              DEFAULT: "#fcba03",
            },
          },
        },
        "high-contrast": {
          extend: "light",
          colors: {
            primary: {
              DEFAULT: "#fcba03",
              foreground: "#252525",
            },
            secondary: {
              DEFAULT: "#ffd86b",
            },
            background: {
              DEFAULT: "#000000",
            },
            // @ts-ignore
            backgroundSecondary: {
              DEFAULT: "#363636",
            },
            text: {
              DEFAULT: "#000000",
            },
            textSecondary: {
              DEFAULT: "#909090",
            },
            optionalBorderColor: {
              DEFAULT: "transparent",
            },
          },
        },
      },
    }),
  ],
};
export default config;
// const highContrastTheme = {
//   ...DefaultTheme,
//   custom: "property",
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#fcba03",
//     secondary: "#ffd86b",
//     background: "#000000",
//     backgroundSecondary: "#363636",
//     primaryFont: "#FFFFFF",
//     secondaryFont: "#00d7fc",
//     secondaryFontDarker: "#8f8f8f",
//     optionalBorderColor: "#fcba03",
//   },
// };
// const primaryTheme = {
//   ...DefaultTheme,
//   custom: "property",
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "rgb(120, 69, 172)",
//     secondary: "#E5E2F7",
//     background: "#FFFFFF",
//     backgroundSecondary: "#F5F5F5",
//     optionalBorderColor: "transparent",
//     primaryFont: "#000000",
//     secondaryFont: "#909090",
//     secondaryFontDarker: "#707070",
//   },
// };
