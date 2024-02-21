import { useRouter } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { Avatar, Badge, IconButton, useTheme } from "react-native-paper";

const Heading = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left-thin-circle-outline"
        size={40}
        iconColor={theme.colors.primary}
        style={{ margin: 0, padding: 0 }}
        onPress={() => {
          router.push("/chat/messages/");
        }}
      />
      <View>
        <Avatar.Image
          size={60}
          source={require("../../assets/images/avatar.jpeg")}
        />
        <Badge style={styles.badge} size={15}></Badge>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Monika Kowalska</Text>
        <Text style={{ color: "#737373", fontFamily: "League-Spartan" }}>
          monika.kowlska@ms.com
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
  },
  badge: {
    backgroundColor: "#17C964",
    position: "absolute",
    top: 0,
    right: -4,
  },
  text: {
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 25,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "red",
    flex: 1,
  },
});
export default Heading;
