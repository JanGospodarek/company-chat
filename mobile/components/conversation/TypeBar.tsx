import { miau, sendMessageWithAttachment } from "@/shared/api";
import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
interface Props {
  chatId: number;
}
const TypeBar = (props: Props) => {
  const theme = useTheme();
  const { chatId } = props;
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>(
    [] as File[]
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<any>(null);
  // React.useEffect(() => {
  //   console.log(input);
  // }, [input]);
  const handleSend = () => {
    // if (input.trim() === "") return;
    const message = input.trim();

    // if (selectedFiles.length > 0) {
    //   sendMessageWithAttachment(chatId, message, selectedFiles);
    //   setSelectedFiles([]);
    //   setInput("");
    //   inputRef.current?.focus();
    //   return;
    // }
    if (!message) return;
    miau.sendMessage(message);

    setInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        ref={inputRef}
        onChangeText={(t) => setInput(t)}
        value={input}
      />
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
          onPress={handleSend}
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
    fontFamily: "League-Spartan-SemiBold",
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    paddingRight: 10,
  },
});
export default TypeBar;
