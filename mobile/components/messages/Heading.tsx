import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { ScalableText, useAppTheme } from "../ThemeProvider";

interface Props {
  showModal: () => void;
}

const Heading = (props: Props) => {
  const theme = useAppTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScalableText style={{ ...styles.text, color: theme.colors.primaryFont }}>
        Wiadomości
      </ScalableText>
      <View style={styles.btnContainer}>
        <IconButton
          icon="cog-outline"
          size={30}
          iconColor={theme.colors.primary}
          style={{ margin: 0, padding: 0 }}
          onPress={props.showModal}
        />
        <IconButton
          icon="account-group"
          size={30}
          iconColor={theme.colors.primary}
          style={{ margin: 0, padding: 0 }}
          onPress={() => {
            router.push({
              pathname: "/chat/messages/group",
            });
          }}
        />
        <IconButton
          icon="magnify"
          size={30}
          iconColor={theme.colors.primary}
          style={{ margin: 0, padding: 0 }}
          onPress={() => {
            router.push({
              pathname: "/chat/messages/search",
            });
          }}
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
    alignItems: "center",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "League-Spartan-SemiBold",

    fontSize: 32,
  },
});

export default Heading;
