import { Link, useRouter } from "expo-router";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Avatar, Badge, useTheme } from "react-native-paper";

const Chat = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        router.push({
          pathname: "/chat/conversation/[id]",
          params: { id: "bacon" },
        });
      }}
    >
      <View>
        <Avatar.Image
          size={56}
          source={require("../../assets/images/avatar.jpeg")}
        />
        <Badge style={styles.badge} size={15}></Badge>
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
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginVertical: 6,

    justifyContent: "center",
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
