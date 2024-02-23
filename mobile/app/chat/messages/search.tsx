import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ScalableText } from "../../../components/ThemeProvider";

import globalStyles from "@/app/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Icon, IconButton, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { newPrivateChat, newPrivateChatList } from "@/shared/api";
import React, { useEffect } from "react";
import { User } from "@/shared/types";
import { useAppTheme } from "@/components/ThemeProvider";
const Search = () => {
  const theme = useAppTheme();
  const router = useRouter();

  const [newUsers, setNewUsers] = React.useState([] as User[]);
  const [searchedUsers, setSearchedUsers] = React.useState([] as User[]);
  const [keyword, setKeyword] = React.useState("");
  React.useEffect(() => {
    newPrivateChatList().then((users) => {
      setNewUsers(users);
      setSearchedUsers(users);
    });
  }, []);

  const handleNewChat = async (user: User) => {
    await newPrivateChat(user.username);
    router.push("/chat/messages/");
  };
  useEffect(() => {
    if (keyword != "") {
      setSearchedUsers(
        newUsers.filter((user) =>
          user.username.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    } else {
      setSearchedUsers(newUsers);
    }
  }, [keyword]);
  return (
    <View
      style={{
        ...globalStyles.container,
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
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
      <ScalableText
        style={{ ...styles.headingText, color: theme.colors.primaryFont }}
      >
        Nowy chat
      </ScalableText>
      <View
        style={{
          ...styles.inputContainer,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <Icon source="magnify" color={theme.colors.primary} size={30} />
        <TextInput
          style={{
            ...styles.input,
            color: theme.colors.primaryFont,
            fontSize: 20,
          }}
          placeholder="Wpisz nazwę"
          placeholderTextColor={theme.colors.primary}
          value={keyword}
          onChangeText={(val) => setKeyword(val)}
        />
      </View>
      <ScrollView>
        {searchedUsers.map((user) => (
          <TouchableOpacity
            onPress={() => {
              handleNewChat(user);
            }}
            style={{
              ...styles.container,
              borderColor: theme.colors.optionalBorderColor,
            }}
            key={user.id}
          >
            <Avatar.Image
              size={35}
              source={require("../../../assets/images/avatar.jpeg")}
              style={{ margin: 0, padding: 0 }}
            />
            <ScalableText
              style={{
                ...styles.text,
                color: theme.colors.primaryFont,
              }}
            >
              {user.username}
            </ScalableText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    marginVertical: 2,
    borderWidth: 3,
    borderRadius: 20,
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
