import { register } from "../../shared/api";
import { Link } from "expo-router";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ScalableText } from "../../components/ThemeProvider";

import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alert from "@/components/Alert";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/components/ThemeProvider";
const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<false | string>(false);
  const [succeded, setSucceded] = React.useState<boolean>(false);
  const theme = useAppTheme();

  const handleRegister = async () => {
    if (email && password) {
      setLoading(true);
      try {
        const data = await register(email, password);
        setLoading(false);
        setError(false);
        setSucceded(true);
        // router.push("/chat/messages/");
        await AsyncStorage.clear();
        await AsyncStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
        router.push("/chat/messages/");
      } catch (error: any) {
        setError(error.message);
      }
    }
  };
  React.useEffect(() => {
    if (error || succeded) {
      setLoading(false);
    }
  }, [error, succeded]);
  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={styles.heading}>
          <ScalableText
            style={{
              fontSize: 48,
              fontFamily: "League-Spartan-Bold",
              color: theme.colors.primaryFont,
            }}
          >
            Register
          </ScalableText>
        </View>
        <View style={styles.content}>
          {/* <TextInput
            label="Name"
            value={name}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setName(text)}
            textColor={theme.colors.primaryFont}
          />
          <TextInput
            label="Surname"
            value={surname}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setSurname(text)}
            textColor={theme.colors.primaryFont}
          /> */}
          <TextInput
            label="Email"
            value={email}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            textColor={theme.colors.primaryFont}
          />
          <TextInput
            label="Hasło"
            value={password}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setPassword(text)}
            textColor={theme.colors.primaryFont}
          />
          <View style={styles.btnContainer}>
            <Link href="/" asChild>
              <Button mode="outlined" onPress={() => console.log("Pressed")}>
                <Text>Cofnij </Text>
              </Button>
            </Link>
            <Button
              mode="contained"
              onPress={() => handleRegister()}
              loading={loading}
            >
              <Text>Zarejestruj </Text>
            </Button>
          </View>
        </View>
      </View>

      <Alert
        type={succeded ? "success" : error ? "error" : "none"}
        message={succeded ? "Created account successfully" : error ? error : ""}
        isVisible={succeded || (error as boolean)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { display: "flex", justifyContent: "flex-start" },
  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
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
