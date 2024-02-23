import { User } from "@/shared/types";
import React, { Dispatch, SetStateAction } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Button, useTheme } from "react-native-paper";
import { useAppTheme } from "../ThemeProvider";
import { ScalableText } from "../ThemeProvider";

interface Props {
  updateGroupMembers: Dispatch<SetStateAction<string[]>>;
  user: User;
}
const Person = (props: Props) => {
  const { updateGroupMembers, user } = props;
  const [checked, setChecked] = React.useState(false);
  const theme = useAppTheme();
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
        borderColor: theme.colors.optionalBorderColor,
      }}
    >
      <Avatar.Image
        size={35}
        source={require("../../assets/images/avatar.jpeg")}
        style={{ margin: 0, padding: 0 }}
      />
      <ScalableText
        style={{
          ...styles.text,
          color: checked ? "black" : theme.colors.primaryFont,
        }}
      >
        {user.username}
      </ScalableText>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 7,
    borderWidth: 3,
    borderRadius: 20,
    marginVertical: 2,
  },
  text: {
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 20,
    // color: "black",
    margin: 0,
    padding: 0,
  },
});
export default Person;
