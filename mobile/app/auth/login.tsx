import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Login</Text>
      </View>
      <View style={styles.content}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start" },
  heading: { flex: 1, flexDirection: "row", justifyContent: "center" },
  content: { flex: 1, alignItems: "center" },
});

export default LoginScreen;
