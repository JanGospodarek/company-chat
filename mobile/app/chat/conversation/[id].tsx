import Heading from "@/components/conversation/Heading";
import Messages from "@/components/conversation/Messages";
import TypeBar from "@/components/conversation/TypeBar";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
const Conversation = () => {
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log(id);
  }, [id]);
  return (
    <LinearGradient
      colors={["rgba(137, 128, 189,0.8)", "transparent"]}
      style={styles.container}
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

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 10,
    alignItems: "center",

    height: "100%",
  },
});

export default Conversation;
