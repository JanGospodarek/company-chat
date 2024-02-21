import { Link } from "expo-router";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import Alert from "@/components/Alert";
const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { logIn, user } = useAuth();
  const router = useRouter();

  const [succeded, setSucceded] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<false | string>(false);

  React.useEffect(() => {
    if (user) {
      router.push("/chat/messages/");
    }
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);

      try {
        await logIn(email, password);

        setLoading(false);
        setError(false);
        setSucceded(true);
        router.push("/chat/messages/");
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
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
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text
            style={{
              fontSize: 48,
              fontFamily: "League-Spartan-Bold",
            }}
          >
            Logowanie
          </Text>
        </View>
        <View style={styles.content}>
          <TextInput
            label="Email"
            value={email}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            label="Hasło"
            value={password}
            style={{ width: 200 }}
            mode="outlined"
            onChangeText={(text) => setPassword(text)}
          />
          <View style={styles.btnContainer}>
            <Link href="/" asChild>
              <Button mode="outlined" onPress={() => console.log("Pressed")}>
                <Text>Cofnij </Text>
              </Button>
            </Link>
            <Button
              mode="contained"
              onPress={() => handleLogin()}
              loading={loading}
            >
              <Text>{loading ? "Logowanie" : "Zaloguj"} </Text>
            </Button>
          </View>
        </View>
      </View>
      <Alert
        type={succeded ? "success" : error ? "error" : "none"}
        message={succeded ? "Zalogowano pomyślnie" : error ? error : ""}
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
    marginHorizontal: "auto",
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
