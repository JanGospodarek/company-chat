import { View, Text, StyleSheet } from "react-native";
import { Avatar, Badge, useTheme } from "react-native-paper";

const Chat = () => {
  return (
    <View style={styles.container}>
      <View>
        <Avatar.Image
          size={56}
          source={require("../../assets/images/avatar.jpeg")}
        />
        <Badge style={styles.badge}></Badge>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.heading}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "League-Spartan-Bold",
            }}
          >
            Damian Kowalski
          </Text>
          <Text
            style={{
              marginLeft: 30,
              color: "#737373",
              fontFamily: "League-Spartan",
            }}
          >
            10:11 01.02.2023
          </Text>
        </View>

        <Text
          style={{
            fontWeight: "400",
            color: "#737373",
            fontFamily: "League-Spartan",
          }}
        >
          lorem srolem djdjkdkjdjkd djkdkd....
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginVertical: 6,
  },
  textContainer: {},
  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: "#17C964",
    position: "absolute",
    top: 0,
    right: -4,
  },
});
export default Chat;
