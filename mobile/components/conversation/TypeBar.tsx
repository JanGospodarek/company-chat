import { miau, sendMessageWithAttachment } from "@/shared/api";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Button,
  Pressable,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import * as ImageManipulator from "expo-image-manipulator";
import { useAppTheme } from "../ThemeProvider";

interface Props {
  chatId: number;
}
type File = { base: string; name: string; type: string };
const TypeBar = (props: Props) => {
  const theme = useAppTheme();
  const { chatId } = props;
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<any>(null);
  // React.useEffect(() => {
  //   console.log(input);
  // }, [input]);
  const handleSend = async () => {
    // if (input.trim() === "") return;
    setIsLoading(true);
    const message = input.trim();

    if (selectedFiles.length > 0) {
      sendMessageWithAttachment(chatId, message, selectedFiles);
      setSelectedFiles([]);
      setInput("");
      inputRef.current?.focus();
      setIsLoading(false);

      return;
    }
    if (!message) return;
    miau.sendMessage(message);

    setInput("");
    setIsLoading(false);

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
  const removeFile = (file: File) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((f) => f !== file);

      return newFiles;
    });
  };

  return (
    <>
      {selectedFiles.length > 0 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: theme.colors.backgroundSecondary,
            padding: 10,
            width: "100%",
            gap: 10,
          }}
        >
          {selectedFiles.map((image, index) => (
            <View style={{ position: "relative" }} key={index}>
              <Image
                source={{ uri: image.base }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
              <Pressable style={styles.badge} onPress={() => removeFile(image)}>
                <Text
                  style={{ fontFamily: "League-Spartan-Bold", color: "white" }}
                >
                  X
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <TextInput
          style={{ ...styles.input, color: theme.colors.primaryFont }}
          placeholder="Type a message"
          placeholderTextColor={theme.colors.primary}
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
            loading={isLoading}
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
  badge: {
    backgroundColor: "red",
    position: "absolute",
    top: 0,
    right: -4,
    padding: 5,
    width: 30,
    height: 30,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default TypeBar;
