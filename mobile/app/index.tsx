import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Button, PaperProvider } from "react-native-paper";

const StartScreen = () => {
  return (
    <PaperProvider>
      <View>
        <Text>dddd wpwpw</Text>
        <Link href="/auth/login" asChild>
          <Button mode="outlined" style={{width:}} onPress={() => console.log("Pressed")}>
            <Text>Login</Text>
          </Button>
        </Link>
        <Link href="/auth/register" asChild>
          <Pressable>
            <Text>Register</Text>
          </Pressable>
        </Link>
      </View>
    </PaperProvider>
  );
};
export default StartScreen;
