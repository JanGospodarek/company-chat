import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
import { Avatar } from "react-native-paper";
import { useAppTheme } from "../ThemeProvider";
import { ScalableText } from "../ThemeProvider";

const ActiveUsers = () => {
  const activeUsers = useAppSelector((state) => state.activeUsers);
  const theme = useAppTheme();
  if (activeUsers.users.length === 0) {
    return null;
  }
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
      <View
        style={{
          overflow: "scroll",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
          gap: 10,
        }}
      >
        {activeUsers.users.map((user) => {
          return (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={user.id}
            >
              <Avatar.Text
                size={40}
                label={getInitials(user.name + " " + user.surname)}
              />

              <ScalableText
                style={{
                  fontSize: 14,
                  fontFamily: "League-Spartan-Bold",
                  color: theme.colors.primaryFont,
                }}
              >
                {user.username}
              </ScalableText>
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default ActiveUsers;
