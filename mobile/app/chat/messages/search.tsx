import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import globalStyles from "@/app/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Icon, IconButton, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { newPrivateChat, newPrivateChatList } from "@/shared/api";
import React from "react";
import { User } from "@/shared/types";
const Search = () => {
  const theme = useTheme();
  const router = useRouter();

  const [newUsers, setNewUsers] = React.useState([] as User[]);

  React.useEffect(() => {
    newPrivateChatList().then((users) => {
      setNewUsers(users);
    });
  }, []);

  const handleNewChat = async (user: User) => {
    await newPrivateChat(user.username);
    router.push("/chat/messages/");
  };
  return (
    <LinearGradient
      colors={["rgba(137, 128, 189,0.8)", "transparent"]}
      style={{ ...globalStyles.container, alignItems: "center" }}
      start={{ x: 0, y: 2 }}
      end={{ x: 0, y: 0 }}
      locations={[0.5, 0.6]}
    >
      <IconButton
        icon="arrow-left-thin-circle-outline"
        size={40}
        iconColor={theme.colors.primary}
        style={styles.backIcon}
        onPress={() => {
          router.push("/chat/messages/");
        }}
      />
      <Text style={styles.headingText}>Nowy chat</Text>
      <View style={styles.inputContainer}>
        <Icon source="magnify" color={theme.colors.primary} size={30} />
        <TextInput style={styles.input} placeholder="Type user's name" />
      </View>
      <View style={styles.usersContainer}>
        {/* <Text style={{ fontFamily: "League-Spartan", fontSize: 18 }}>
          Start typing to see users
        </Text> */}
        {newUsers.map((user) => (
          <TouchableOpacity
            onPress={() => {
              handleNewChat(user);
            }}
            style={styles.container}
            key={user.id}
          >
            <Avatar.Image
              size={35}
              source={require("../../../assets/images/avatar.jpeg")}
              style={{ margin: 0, padding: 0 }}
            />
            <Text style={styles.text}>{user.username}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  backIcon: {
    position: "absolute",
    top: 30,
    left: 10,
  },
  headingText: {
    fontFamily: "League-Spartan-Bold",
    fontSize: 30,
  },
  input: {
    margin: 10,
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  inputContainer: {
    width: "80%",
    backgroundColor: "rgba(115, 115, 115,0.2)",
    marginVertical: 20,
    borderRadius: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  usersContainer: {
    flex: 1,
    display: "flex",
    gap: 10,
    justifyContent: "flex-start",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 20,
    marginVertical: 2,
  },
  text: {
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 20,
    color: "black",
    margin: 0,
    padding: 0,
  },
});
export default Search;
