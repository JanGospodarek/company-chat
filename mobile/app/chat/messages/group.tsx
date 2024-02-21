import { View, StyleSheet, Text, TextInput, ScrollView } from "react-native";
import globalStyles from "@/app/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Icon, IconButton, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import Person from "@/components/createGroup/Person";
import React from "react";
import { addUsersToChat, getUsers, newGroupChat } from "@/shared/api";
import { User } from "../../../../shared/types";
const Group = () => {
  const theme = useTheme();
  const router = useRouter();
  const [groupName, setGroupName] = React.useState("");
  const [groupMembers, setGroupMembers] = React.useState([] as string[]);
  const [allUsers, setAllUsers] = React.useState([] as User[]);

  React.useEffect(() => {
    // fetch all users
    getUsers().then((users) => {
      setAllUsers(users);
    });
  }, []);
  const handleSubmit = async () => {
    // create group
    try {
      if (groupName.trim() === "") return;

      const groupId = await newGroupChat(groupName);
      const members = groupMembers.map((member) => parseInt(member));

      // add members to group
      await addUsersToChat(groupId, members);
      router.push("/chat/messages/");
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    console.log(groupMembers);
  }, [groupMembers]);
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
      <Text style={styles.headingText}>Utwórz grupę</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nazwa grupy"
          onChangeText={(text) => setGroupName(text)}
          value={groupName}
        />
      </View>
      {/* <View style={styles.inputContainer}>
        <Icon source="magnify" color={theme.colors.primary} size={30} />
        <TextInput style={styles.input} placeholder="Type user's name" />
      </View> */}
      <ScrollView>
        {allUsers.map((user) => (
          <Person
            key={user.id}
            user={user}
            updateGroupMembers={setGroupMembers}
          />
        ))}
      </ScrollView>

      <View>
        <Button
          mode="contained"
          style={{ padding: 6, marginTop: 10 }}
          onPress={handleSubmit}
        >
          <Text style={{ fontFamily: "League-Spartan-SemiBold", fontSize: 18 }}>
            Utwórz
          </Text>
        </Button>
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
    marginBottom: 15,
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
    marginVertical: 10,
    borderRadius: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  usersContainer: {
    marginTop: 10,
    flex: 1,
    display: "flex",
    gap: 10,
    justifyContent: "flex-start",
    padding: 10,
  },
});
export default Group;
