import { miau, sendMessageWithAttachment } from "@/shared/api";
import React from "react";
import { View, StyleSheet, Text, TextInput, Image } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import * as ImageManipulator from "expo-image-manipulator";

interface Props {
  chatId: number;
}
const TypeBar = (props: Props) => {
  const theme = useTheme();
  const { chatId } = props;
  const [selectedFiles, setSelectedFiles] = React.useState<
    { base: string; name: string; type: string }[]
  >([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<any>(null);
  // React.useEffect(() => {
  //   console.log(input);
  // }, [input]);
  const handleSend = async () => {
    // if (input.trim() === "") return;
    const message = input.trim();

    if (selectedFiles.length > 0) {
      // for (const file of selectedFiles) {
      //   const manipResult = await ImageManipulator.manipulateAsync(
      //     file.uri,
      //     [],
      //     { compress: 0.5 } // zmniejsz jakość do 50%
      //   );

      //   file.uri = manipResult.uri;
      // }

      sendMessageWithAttachment(chatId, message, selectedFiles);
      setSelectedFiles([]);
      setInput("");
      inputRef.current?.focus();
      return;
    }
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
  const selectFile = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const base64 = await FileSystem.readAsStringAsync(
        pickerResult.assets[0].uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      setSelectedFiles((prevImages) => [
        ...prevImages,
        {
          base: `data:${pickerResult.assets![0].mimeType};base64,${base64}`,
          name: pickerResult.assets![0].fileName as string,
          type: pickerResult.assets![0].mimeType as string,
        },
      ]);
    }
  };
  return (
    <>
      {selectedFiles.length > 0 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: theme.colors.primaryContainer,
            padding: 10,
            width: "100%",
            gap: 10,
          }}
        >
          {selectedFiles.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.base }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          ))}
        </View>
      )}
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
            onPress={() => {
              selectFile();
            }}
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
    </>
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
