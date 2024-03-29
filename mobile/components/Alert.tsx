import { StyleSheet, View } from "react-native";
import { ScalableText } from "./ThemeProvider";
interface Props {
  type: "error" | "success" | "none";
  message: string;
  isVisible: boolean;
}
const Alert = (props: Props) =>
  props.isVisible && (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.type === "success" ? "green" : "red",
      }}
    >
      <ScalableText
        style={{ fontFamily: "League-Spartan", fontSize: 18, color: "white" }}
      >
        {props.message}
      </ScalableText>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    width: "80%",
    borderRadius: 20,
    left: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
});
export default Alert;
