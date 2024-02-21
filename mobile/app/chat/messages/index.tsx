import ChatList from "@/components/messages/ChatList";
import Heading from "@/components/messages/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import globalStyles from "@/app/globalStyles";
import ActionsModal from "@/components/messages/ActionsModal";
import { useTheme } from "react-native-paper";
const Messages = () => {
  const { id } = useLocalSearchParams();
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();
  console.log(theme.colors.primary);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <LinearGradient
      colors={[theme.colors.primaryContainer, theme.colors.background]}
      start={{ x: 0, y: 2 }}
      end={{ x: 0, y: 0 }}
      style={globalStyles.container}
      locations={[0.5, 0.6]}
    >
      <Heading showModal={showModal} />
      <ChatList />
      <ActionsModal isVisible={visible} closeModal={hideModal} />
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
