import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Attachment, Message } from "../../../shared/types";
import { useAuth } from "@/contexts/AuthContext";
import React, { forwardRef, useEffect } from "react";
import { loadAttachments, miau } from "@/shared/api";
import { computeLongDate } from "../utils/computeDate";

type Props = {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  loadMore: ((messageId: number) => void) | undefined;
  setInView: ((inView: boolean) => void) | undefined;
  h: number | null;
  y: number | null;
};
const Ms = forwardRef((props: Props, ref) => {
  const { message, isFirst, isLast, loadMore, setInView, h, y } = props;
  const theme = useTheme();
  const { user } = useAuth();
  const [isInView, setIsElementInView] = React.useState(false);
  const elementRef = React.useRef<View>(null);

  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  // useEffect(() => {
  //   if (elementRef.current && h && y) {
  //     const yP = y;

  //     elementRef.current.measure((x, y, width, height, pageX, pageY) => {
  //       const elementTop = pageY;
  //       const elementBottom = pageY + height;
  //       const viewportTop = yP;
  //       const viewportBottom = viewportTop + h;
  //       if (elementBottom > viewportTop && elementTop < viewportBottom) {
  //         setIsElementInView(true);
  //         console.log("in view, ", message.content);
  //       } else {
  //         setIsElementInView(false);
  //         console.log("not in view", message.content);
  //       }
  //       console.log("el:", pageY);
  //     });
  //   }
  // }, [ y, h]);

  React.useEffect(() => {
    if (message.readBy.every((u) => u.id !== user?.id)) {
      miau.markMessageAsRead(message.messageId);
    }

    if (loadMore) {
      loadMore(message.messageId);
    }
  }, [message.messageId]);

  React.useEffect(() => {
    if (message.attachment) {
      loadAttachments(message.attachment, message.messageId).then((media) => {
        setAttachments(media);
      });
    }
  }, []);

  const isMine = message.user.id === user?.id;
  return (
    <View
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        flexDirection: "row",
      }}
      ref={elementRef}
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
            {computeLongDate(new Date(message.createdAt))}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isMine
              ? "rgba(115, 91, 178,0.7)"
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
            {message.content}
          </Text>
          {message.attachment && (
            <View>
              {attachments.map((attachment) => (
                <>
                  <View
                    key={attachment.path}
                    style={{ width: attachments.length > 1 ? "48%" : 0 }}
                  >
                    <Image
                      source={{
                        uri: `http://${process.env.EXPO_PUBLIC_SERVER_IP}/api/media/${attachment.path}`,
                      }}
                    />
                  </View>
                </>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  message: {
    display: "flex",
    maxWidth: 150,
  },
});
export default Ms;
