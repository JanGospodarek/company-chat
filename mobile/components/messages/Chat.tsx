import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

const Chat = () => {
  return (
    <View>
      <Avatar.Image
        size={56}
        source={require("../../assets/images/avatar.jpeg")}
      />
      {/* <View style={}></View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  // textContainet
});
export default Chat;
