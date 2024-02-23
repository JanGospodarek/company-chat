import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAppTheme } from "../ThemeProvider";
import { ScalableText } from "../ThemeProvider";

const ActiveUsers = () => {
  //   const fontSizeState = useAppSelector((state) => state.font);
  const activeUsers = useAppSelector((state) => state.activeUsers);
  const theme = useAppTheme();
  if (activeUsers.users.length === 0) {
    return null;
  }
  return (
    <View>
      <ScalableText
        style={{
          color: theme.colors.primary,
          fontFamily: "League-Spartan-SemiBold",
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Aktywni użytkownicy
      </ScalableText>
      {activeUsers.users.map((user) => {
        return (
          <View
            key={user.id}
            style={{
              width: 50,
              height: 50,
              backgroundColor: theme.colors.secondary,
              padding: 10,
              borderRadius: 25,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ScalableText
              style={{ fontSize: 14, fontFamily: "League-Spartan-Bold" }}
            >
              {user.username.split("").slice(0, 3).join("")}
            </ScalableText>
          </View>
        );
      })}
    </View>
  );
};
export default ActiveUsers;
