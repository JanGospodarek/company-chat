"use client";
import { useRef } from "react";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { makeStore, AppStore, store } from "../lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </Provider>
    </AuthProvider>
  );
}
