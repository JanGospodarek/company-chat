import Heading from "@/components/conversation/Heading";
import Messages from "@/components/conversation/Messages";
import TypeBar from "@/components/conversation/TypeBar";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import globalStyles from "@/app/globalStyles";
import { useTheme } from "react-native-paper";
const Conversation = () => {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  useEffect(() => {
    console.log(id);
  }, [id]);
  return (
    <LinearGradient
      colors={["rgba(137, 128, 189,0.8)", theme.colors.background]}
      style={{ ...globalStyles.container, padding: 10, alignItems: "center" }}
      start={{ x: 0, y: 2 }}
      end={{ x: 0, y: 0 }}
      locations={[0.5, 0.6]}
    >
      <Heading />
      <Messages />
      <TypeBar />
    </LinearGradient>
  );
};

export default Conversation;
