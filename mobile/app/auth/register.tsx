import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

const LoginScreen = () => {
  return (
    <View>
      <Text>Register</Text>
      <Link href="/" asChild>
        <Pressable>
          <Text>Start screen</Text>
        </Pressable>
      </Link>
    </View>
  );
};
export default LoginScreen;
