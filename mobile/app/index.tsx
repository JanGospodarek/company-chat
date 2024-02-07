import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Button, PaperProvider } from "react-native-paper";

const StartScreen = () => {
  return (
    <PaperProvider>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold" }}> Company chat</Text>
        <Link href="/auth/login" asChild>
          <Button
            mode="contained"
            style={{ width: "50%" }}
            onPress={() => console.log("Pressed")}
          >
            <Text>Login</Text>
          </Button>
        </Link>

        <Link href="/auth/register" asChild>
          <Button
            mode="outlined"
            style={{ width: "50%" }}
            onPress={() => console.log("register")}
          >
            <Text>Register</Text>
          </Button>
        </Link>
      </View>
    </PaperProvider>
  );
};
export default StartScreen;
