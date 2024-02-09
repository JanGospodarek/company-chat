import ChatList from "@/components/messages/ChatList";
import Heading from "@/components/messages/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import globalStyles from "@/app/globalStyles";
import Modal from "@/components/messages/Modal";
const Messages = () => {
  const { id } = useLocalSearchParams();
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <LinearGradient
      colors={["rgba(137, 128, 189,0.8)", "transparent"]}
      style={globalStyles.container}
      start={{ x: 0, y: 2 }}
      end={{ x: 0, y: 0 }}
      locations={[0.5, 0.6]}
    >
      <Heading showModal={showModal} />
      <ChatList />
      <Modal isVisible={visible} closeModal={hideModal} />
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
