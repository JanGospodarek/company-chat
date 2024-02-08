import { View, StyleSheet, Text, TextInput } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

const TypeBar = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Type a message" />
      <View style={styles.btnContainer}>
        <IconButton
          icon="pin"
          size={28}
          iconColor={theme.colors.primary}
          style={{ margin: 0, padding: 0 }}
          onPress={() => {}}
        />
        <IconButton
          icon="send"
          size={28}
          iconColor={theme.colors.primary}
          style={{ margin: 0, padding: 0 }}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 50,
    backgroundColor: "rgba(115, 115, 115,0.3)",

    borderRadius: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    margin: 10,
    width: "65%",
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 16,
    marginLeft: 15,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    paddingRight: 10,
  },
});
export default TypeBar;
