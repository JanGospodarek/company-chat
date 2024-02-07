import { View, Text, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

const Heading = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Messages</Text>
      <View style={styles.btnContainer}>
        <IconButton
          icon="cog-outline"
          size={30}
          iconColor={theme.colors.primary}
          onPress={() => console.log("Pressed")}
        />
        <IconButton
          icon="account-group"
          size={30}
          iconColor={theme.colors.primary}
          onPress={() => console.log("Pressed")}
        />
        <IconButton
          icon="magnify"
          size={30}
          iconColor={theme.colors.primary}
          onPress={() => console.log("Pressed")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default Heading;
