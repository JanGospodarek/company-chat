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

      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#8980BD",
              foreground: "#252525",
            },
            secondary: {
              DEFAULT: "#E5E2F7",
            },
            background: {
              DEFAULT: "#FFFFFF",
            },
            // @ts-ignore
            text: {
              DEFAULT: "#252525",
            },
          },
        },
      },
    }),
  ],
};
export default config;
