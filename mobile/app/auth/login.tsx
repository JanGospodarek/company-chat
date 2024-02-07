import { Link } from "expo-router";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

const LoginScreen = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Login</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          label="Username"
          value={username}
          style={{ width: 200 }}
          mode="outlined"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          label="Password"
          value={password}
          style={{ width: 200 }}
          mode="outlined"
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.btnContainer}>
          <Link href="/" asChild>
            <Button mode="outlined" onPress={() => console.log("Pressed")}>
              <Text>Back </Text>
            </Button>
          </Link>
          <Button mode="contained" onPress={() => console.log("Pressed")}>
            <Text>Log in </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: "flex", justifyContent: "flex-start" },
  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 10,
  },
  btnContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});

export default LoginScreen;
