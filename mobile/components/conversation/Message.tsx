import { View, StyleSheet, Image, Button, Pressable } from "react-native";
import { ScalableText } from "../ThemeProvider";

import { Attachment, Message } from "@/shared/types";
import { useAuth } from "@/contexts/AuthContext";
import React, { forwardRef, useEffect } from "react";
import { loadAttachments, miau } from "@/shared/api";
import { computeLongDate } from "../utils/computeDate";
import { InView } from "react-native-intersection-observer";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useAppTheme } from "../ThemeProvider";
type Props = {
  message: Message;

  loadMore: ((messageId: number) => void) | undefined;
  setInView: ((inView: boolean) => void) | undefined;
};
const Ms = forwardRef((props: Props, ref) => {
  const { message, loadMore, setInView } = props;

  const theme = useAppTheme();
  const { user } = useAuth();
  const [isInView, setIsElementInView] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [images, setImages] = React.useState<
    { id: number; base: string; width: number; height: number }[]
  >([]);
  useEffect(() => {
    if (isInView) {
      if (message.readBy.every((u) => u.id !== user?.id)) {
        miau.markMessageAsRead(message.messageId);
      }
    }

    if (isInView && loadMore) {
      loadMore(message.messageId);
    }

    setInView?.(isInView);
  }, [isInView]);

  useEffect(() => {
    if (message.attachment) {
      loadAttachments(message.attachment, message.messageId).then((media) => {
        setAttachments(media);
      });
    }
  }, []);
  useEffect(() => {
    const f = async (path: string, id: number) => {
      try {
        const res = await fetch(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}/api/media${path}`
        );
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = function () {
          const base64data = reader.result;
          Image.getSize(base64data as string, (width, height) => {
            if (width < 300) {
              setImages((state) => [
                ...state,
                {
                  id: id,
                  base: base64data as string,
                  width: width,
                  height: height,
                },
              ]);
            } else {
              const aspektRatio = width / height;
              const newWidth = 220;
              const newHeight = newWidth / aspektRatio;
              setImages((state) => [
                ...state,
                {
                  id: id,
                  base: base64data as string,
                  width: newWidth,
                  height: newHeight,
                },
              ]);
            }
          });
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("ERRR", error);
      }
    };
    if (attachments.length > 0) {
      attachments.forEach((attachment) => {
        if (
          attachment.type.startsWith("image/") &&
          images.findIndex((i) => i.id === attachment.id) === -1
        ) {
          const path = attachment.path
            .split("")
            .slice(1, attachment.path.split("").length)
            .join("");
          f(path, attachment.id);
        }
      });
    }
  }, [attachments]);
  const isMine = message.user.id === user?.id;
  const downloadFile = async (url: string, name: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permissions to make this work!");
        return;
      }

      // const response = await fetch(url);

      // const blob = await response.blob();
      // const reader = new FileReader();
      // reader.onloadend = async function () {
      //   const base64 = (reader.result as string).split(",")[1];

      const path = FileSystem.documentDirectory + name;

      const result = await FileSystem.downloadAsync(url, path);

      console.log("File downloaded toddd:", result.uri);
      setIsDownloaded(true);
      setTimeout(() => {
        setIsDownloaded(false);
      }, 5000);
      // };
      // reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Download file error:", error);
    }
  };
  return (
    <InView
      triggerOnce={!loadMore && !setInView}
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        flexDirection: "row",
      }}
      onChange={(inView) => {
        setIsElementInView(inView);
      }}
    >
      <View style={styles.message}>
        <View>
          <ScalableText
            style={{
              textAlign: "right",
              fontFamily: "League-Spartan",
              color: theme.colors.secondaryFont,
              fontSize: 15,
            }}
          >
            {computeLongDate(new Date(message.createdAt))}
          </ScalableText>
        </View>
        <View
          style={{
            backgroundColor: isMine
              ? theme.colors.primary
              : theme.colors.secondary,
            padding: 10,
            borderRadius: 20,
            borderTopLeftRadius: isMine ? 20 : 0,
            borderTopRightRadius: isMine ? 0 : 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ScalableText
            style={{ fontFamily: "League-Spartan-SemiBold", fontSize: 16 }}
          >
            {message.content}
          </ScalableText>
          {message.attachment && (
            <View
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              {attachments.map((attachment) => {
                const imageData = images.find((i) => i.id === attachment.id);
                const path = attachment.path
                  .split("")
                  .slice(1, attachment.path.split("").length)
                  .join("");

                return attachment.type.startsWith("image/") ? (
                  <View
                    key={attachment.path}
                    // style={{ width: attachments.length > 1 ? "48%" : 0 }}
                    style={styles.attachmentContainer}
                  >
                    <Image
                      source={{
                        uri: imageData?.base,
                      }}
                      style={{
                        width: imageData?.width,
                        height: imageData?.height,
                        borderRadius: 10,
                      }}
                      alt="attachment"
                      loadingIndicatorSource={require("../../assets/loading.gif")}
                    />
                  </View>
                ) : (
                  <Pressable
                    key={attachment.id}
                    onPress={() => {
                      downloadFile(
                        `http://${process.env.EXPO_PUBLIC_SERVER_IP}/api/media${path}`,
                        attachment.name
                      );
                    }}
                  >
                    <View style={styles.attachmentContainer}>
                      <ScalableText
                        style={{
                          fontFamily: "League-Spartan-Bold",
                          fontSize: 16,
                        }}
                      >
                        {isDownloaded ? "Pobrano" : attachment.name}
                      </ScalableText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </InView>
  );
});
const styles = StyleSheet.create({
  message: {
    display: "flex",
    maxWidth: 250,
  },
  attachmentContainer: {
    backgroundColor: "rgba(255, 255, 255,0.4)",
    padding: 10,
    display: "flex",
    alignItems: "center",
    borderRadius: 20,
  },
});
export default Ms;
