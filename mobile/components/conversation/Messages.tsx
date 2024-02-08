import { View, StyleSheet } from "react-native";
import Message from "./Message";

const Messages = () => {
  return (
    <View style={styles.container}>
      <Message isMine={false} />
      <Message isMine={true} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 20,
    gap: 10,
    flex: 1,
  },
});
export default Messages;
