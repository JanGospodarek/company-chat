import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Button, useTheme } from "react-native-paper";
import { Checkbox } from "react-native-paper";

const Person = () => {
  const [checked, setChecked] = React.useState(false);
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        setChecked(!checked);
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
      <Text style={styles.text}>Michał Kowalski</Text>
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
