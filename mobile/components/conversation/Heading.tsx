import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Avatar, Badge, IconButton, useTheme } from "react-native-paper";
import { useAppTheme } from "../ThemeProvider";
interface Props {
  handleGoBack: () => void;
  isActive: boolean;
  title: string;
  subtitle: string;
}
import { ScalableText } from "../ThemeProvider";

const Heading = (props: Props) => {
  const { handleGoBack, title, isActive, subtitle } = props;
  const theme = useAppTheme();
  const router = useRouter();
  const getInitials = (name: string) => {
    const n = name.trim();
    console.log(n);
    if (n.split(" ").length === 1) {
      return n.slice(0, 2).toUpperCase();
    }

    const split = n.split(" ");

    const initials = n[0] + split[split.length - 1][0];

    return initials.toUpperCase();
  };
  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left-thin-circle-outline"
        size={40}
        iconColor={theme.colors.primary}
        style={{ margin: 0, padding: 0 }}
        onPress={() => {
          handleGoBack();
          router.push("/chat/messages/");
        }}
      />
      <View>
        <Avatar.Text size={60} label={getInitials(title)} />
        {isActive && <Badge style={styles.badge} size={15}></Badge>}
      </View>
      <View style={styles.textContainer}>
        <ScalableText
          style={{ ...styles.text, color: theme.colors.primaryFont }}
        >
          {/* {title.length > 18 ? title.slice(0, 18) + "..." : title} */}
          {title}
        </ScalableText>
        <ScalableText
          style={{
            color: theme.colors.secondaryFont,
            fontFamily: "League-Spartan",
            fontSize: 14,
          }}
        >
          {subtitle}
        </ScalableText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#17C964",
    position: "absolute",
    top: 0,
    right: -4,
  },
  text: {
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 25,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "red",
    flex: 1,
  },
});
export default Heading;
