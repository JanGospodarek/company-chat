import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Button } from "react-native-paper";

const LoginScreen = () => {
  return (
    <View>
      <Text>Register</Text>
      <Link href="/" asChild>
        <Button
          mode="outlined"
          style={{ width: "50%" }}
          onPress={() => console.log("Pressed")}
        >
          <Text>Home </Text>
        </Button>
      </Link>
    </View>
  );
};
export default LoginScreen;
