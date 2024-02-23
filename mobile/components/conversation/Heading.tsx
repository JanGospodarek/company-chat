import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Avatar, Badge, IconButton, useTheme } from "react-native-paper";
import { useAppTheme } from "../ThemeProvider";
interface Props {
  handleGoBack: () => void;
  isActive: boolean;
  title: string;
}
import { ScalableText } from "../ThemeProvider";

const Heading = (props: Props) => {
  const { handleGoBack, title, isActive } = props;
  const theme = useAppTheme();
  const router = useRouter();
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
        <Avatar.Image
          size={60}
          source={require("../../assets/images/avatar.jpeg")}
        />
        {isActive && <Badge style={styles.badge} size={15}></Badge>}
      </View>
      <View style={styles.textContainer}>
        <ScalableText
          style={{ ...styles.text, color: theme.colors.primaryFont }}
        >
          {title}
        </ScalableText>
        <ScalableText
          style={{
            color: theme.colors.secondaryFont,
            fontFamily: "League-Spartan",
          }}
        >
          monika.kowlska@ms.com
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
