"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import ThemeProvider from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <Provider store={store}>
        <NextUIProvider navigate={router.push}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextUIProvider>
      </Provider>
    </AuthProvider>
  );
}
