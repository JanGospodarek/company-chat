import { View, StyleSheet, Text, TextInput } from "react-native";
import globalStyles from "@/app/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, IconButton, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
const Search = () => {
  const theme = useTheme();
  const router = useRouter();
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
      <Text style={styles.headingText}>Search</Text>
      <View style={styles.inputContainer}>
        <Icon source="magnify" color={theme.colors.primary} size={30} />
        <TextInput style={styles.input} placeholder="Type user's name" />
      </View>
      <View style={styles.usersContainer}>
        <Text style={{ fontFamily: "League-Spartan", fontSize: 18 }}>
          Start typing to see users
        </Text>
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
});
export default Search;
