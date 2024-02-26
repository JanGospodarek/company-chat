import ChatList from "@/components/messages/ChatList";
import Heading from "@/components/messages/Heading";
import React from "react";
import { View, StyleSheet } from "react-native";
import globalStyles from "@/app/globalStyles";
import ActionsModal from "@/components/messages/ActionsModal";

import ActiveUsers from "@/components/messages/ActiveUsers";
import { useAppTheme } from "@/components/ThemeProvider";
const Messages = () => {
  const [visible, setVisible] = React.useState(false);
  const theme = useAppTheme();
  console.log(theme.colors.primary);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: theme.colors.background,
      }}
    >
      <Heading showModal={showModal} />
      <ActiveUsers />
      <ChatList />
      <ActionsModal isVisible={visible} closeModal={hideModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Messages;
