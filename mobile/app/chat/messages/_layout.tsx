import SocketWrapper from "@/components/SocketWrapper";
import { Slot } from "expo-router";

export default function App() {
  return (
    <SocketWrapper>
      <Slot />
    </SocketWrapper>
  );
}
