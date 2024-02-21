import { User } from "@/shared/types";
import React, { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Button, useTheme } from "react-native-paper";
interface Props {
  updateGroupMembers: Dispatch<SetStateAction<string[]>>;
  user: User;
}
const Person = (props: Props) => {
  const { updateGroupMembers, user } = props;
  const [checked, setChecked] = React.useState(false);
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        setChecked(!checked);
        if (checked) {
          updateGroupMembers((prev) =>
            prev.filter((id) => id !== user.id.toString())
          );
        } else {
          updateGroupMembers((prev) => [...prev, user.id.toString()]);
        }
      }}
      style={{
        ...styles.container,
        backgroundColor: checked ? theme.colors.primary : "transparent",
      }}
    >
      <Avatar.Image
        size={35}
        source={require("../../assets/images/avatar.jpeg")}
        style={{ margin: 0, padding: 0 }}
      />
      <Text style={styles.text}>{user.username}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
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
export default Person;
