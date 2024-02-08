import ChatList from "@/components/messages/ChatList";
import Heading from "@/components/messages/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import globalStyles from "@/app/globalStyles";
const Messages = () => {
  const { id } = useLocalSearchParams();

  return (
    <LinearGradient
      colors={["rgba(137, 128, 189,0.8)", "transparent"]}
      style={globalStyles.container}
      start={{ x: 0, y: 2 }}
      end={{ x: 0, y: 0 }}
      locations={[0.5, 0.6]}
    >
      <Heading />
      <ChatList />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Messages;
