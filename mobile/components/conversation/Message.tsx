import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
interface Props {
  isMine: boolean;
}
const Message = (props: Props) => {
  const { isMine } = props;
  const theme = useTheme();
  return (
    <View
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <View style={styles.message}>
        <View>
          <Text
            style={{
              textAlign: "right",
              fontFamily: "League-Spartan",
              color: "#737373",
            }}
          >
            10:22
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isMine
              ? theme.colors.primary
              : theme.colors.primaryContainer,
            padding: 10,
            borderRadius: 20,
            borderTopLeftRadius: isMine ? 20 : 0,
            borderTopRightRadius: isMine ? 0 : 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: "League-Spartan-SemiBold", fontSize: 16 }}>
            Srutu dedkeokok koefkfeo okeofke oekfoefk
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  message: {
    display: "flex",
    width: 150,
  },
});
export default Message;
